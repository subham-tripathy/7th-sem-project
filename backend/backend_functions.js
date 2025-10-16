const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

function generateJWT(id, name, role) {
  const SECRET = process.env.SECRET_KEY;
  if (!SECRET) {
    throw new Error("Missing SECRET_KEY environment variable");
  }

  const payload = {
    sub: String(id),
    name,
    role,
  };

  return jwt.sign(payload, SECRET, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
}

async function login(id, pw) {
  if (!id || !pw) return "missingFields";

  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  if (!user)
    return {
      status: "noAcc",
    };
  if (user.pw !== pw)
    return {
      status: "pwError",
    };
  return {
    status: "success",
    token: generateJWT(user.id, user.name, user.role),
  };
}

async function updateAcc(id, name, email, pw) {
  if (!id) return "missingId";

  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  if (!user) return "noAcc";

  const updatedData = {};
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (pw) updatedData.pw = pw;

  if (Object.keys(updatedData).length === 0) return "noChanges";

  await prisma.users.update({
    where: { id },
    data: updatedData,
  });

  return "success";
}

async function signup(id, name, email, pw) {
  console.log(id, name, email, pw);
  if (!id || !name || !email || !pw) return "missingFields";

  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  if (user != null) return "userExists";

  await prisma.users.create({
    data: {
      id: id,
      name: name,
      email: email,
      pw: pw,
      role: "company",
    },
  });

  return { status: "success", token: generateJWT(id, name, "company") };
}

module.exports = { login, updateAcc, signup };