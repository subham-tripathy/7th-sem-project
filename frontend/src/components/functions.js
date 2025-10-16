export const backendURL = "http://localhost:3000";

export function validateEmail(email) {
  if (typeof email !== "string") return false;

  const value = email.trim();
  if (value.length < 3) return false;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(value);
}

export function findStudent(id) {
  return fetch(`${backendURL}/searchStudent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sid: id }),
  })
    .then((response) => response.json())
    .then((data) => data);
}
