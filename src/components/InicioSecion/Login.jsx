import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import supabase from "../client";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const signInWithEmail = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error types
        switch (error.message) {
          case "Email not confirmed":
            setError("Por favor, confirma tu correo electrónico. Revisa tu bandeja de entrada.");
            // Optionally, resend confirmation email
            await resendConfirmationEmail(email);
            break;
          case "Invalid login credentials":
            setError("Credenciales inválidas. Verifica tu correo y contraseña.");
            break;
          default:
            setError("Error al iniciar sesión. Intenta nuevamente.");
            console.error("Login error:", error.message);
        }
        return;
      }

      console.log("Inicio de sesión exitoso:", data);

      const { user } = data;
      const role = user.user_metadata?.role || "user";

      login(role);

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError("Error al iniciar sesión. Verifique sus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  // New function to resend confirmation email
  const resendConfirmationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error("Error resending confirmation email:", error);
        // Optionally, show an additional error message
        return;
      }

      // Optional: Show a success message to the user
      alert("Se ha enviado un nuevo correo de confirmación. Revisa tu bandeja de entrada.");
    } catch (err) {
      console.error("Unexpected error resending email:", err);
    }
  };

  const signUpWithEmail = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Previous validations
      if (!email || !password || !name) {
        setError("Complete todos los campos");
        return;
      }

      // User registration in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            display_name: name, 
            role: "user" 
          },
          emailRedirectTo: 'http://localhost:3000/dashboard' // Optional: redirect after email confirmation
        },
      });

      if (error) {
        // Handle specific errors
        if (error.message.includes("rate limit")) {
          setError("Demasiados intentos. Espere un momento.");
        } else {
          setError(error.message || "Error en el registro");
        }
        throw error;
      }

      // Check if user exists before insertion
      if (!data.user) {
        setError("No se pudo crear el usuario");
        return;
      }

      // Manual insertion into users table
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({ 
          correo: email,
          rol: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error al insertar en tabla de usuarios:", insertError);
        setError("Error al completar el registro");
        throw insertError;
      }

      console.log("Registro exitoso:", data);

      // Alert user to check email
      alert(
        "¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta."
      );

      // Reset to login page
      setIsRegister(false);
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error al registrarse. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      signUpWithEmail();
    } else {
      signInWithEmail();
    }
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
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
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