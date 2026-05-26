import { useLogin } from "@/features/auth/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const data = await mutateAsync({
        email: e.target.email.value,
        password: e.target.password.value,
      });

      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h1>Login</h1>

      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button disabled={isPending}>
        {isPending ? "Entrando..." : "Login"}
      </button>
    </form>
  );
}