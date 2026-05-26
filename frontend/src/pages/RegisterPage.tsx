import { useRegister } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const { mutateAsync, isPending } = useRegister();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await mutateAsync({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h1>Register</h1>

      <input name="username" placeholder="Username" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={isPending}>
        {isPending ? "Creando..." : "Register"}
      </button>
    </form>
  );
}