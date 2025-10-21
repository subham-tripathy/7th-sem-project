export const backendURL = "https://045ed84a-1df5-41aa-8625-d047165ab5f2-00-4yyssrg00tmu.sisko.replit.dev";

export function validateEmail(email) {
  if (typeof email !== "string") return false;

  const value = email.trim();
  if (value.length < 3) return false;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(value);
}

export async function findStudent(id) {
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
