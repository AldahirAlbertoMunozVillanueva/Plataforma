import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./client";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const signInWithEmail = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Inicio de sesión exitoso:", data);

      const { user } = data;
      const role = user.user_metadata?.role || "user";

      if (role === "admin") {
        navigate("/adminpanel");
      } else {
        navigate("/userpanel");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error al iniciar sesión. Verifique sus credenciales.");
    }
  };

  const signUpWithEmail = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name, role: "user" },
        },
      });

      if (error) throw error;

      console.log("Registro exitoso:", data);

      // Enviar correo de confirmación
      await sendConfirmationEmail(email, name);

      alert(
        "¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta."
      );
    } catch (error) {
      console.error("Error de registro:", error.message);
      alert("Error al registrarse. Por favor, inténtelo de nuevo.");
    }
  };

  const sendConfirmationEmail = async (email, username) => {
    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el correo de confirmación");
      }

      console.log("Correo de confirmación enviado");
    } catch (error) {
      console.error("Error al enviar el correo de confirmación:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister) {
      signUpWithEmail();
    } else {
      signInWithEmail();
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            disabled={loading}
          >
            {loading
              ? "Cargando..."
              : isRegister
              ? "Registrarse"
              : "Iniciar Sesión"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <p className="text-sm mt-4 text-gray-600 text-center">
          {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 hover:underline"
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
