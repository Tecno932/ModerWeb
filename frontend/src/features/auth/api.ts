const API_URL = "http://192.168.0.110:3000";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error en login");

  return res.json();
};

export const register = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const data = await res.json();
    console.log("❌ BACKEND ERROR:", data);
    throw new Error(data.error || "Error en register");
  }

  return res.json();
};