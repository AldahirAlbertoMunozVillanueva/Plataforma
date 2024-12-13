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
  const navigate = useNavigate();
  const { login } = useAuth();

  const signInWithEmail = async () => {
    try {
      setLoading(true);
      setError("");

      // Validaciones
      if (!email || !password) {
        setError("Por favor ingrese correo y contraseña");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Obtener información adicional del usuario
      const { data: userData } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('correo', email)
        .single();

      const role = userData?.rol || "user";

      // Información de usuario para el contexto
      const userInfo = {
        id: data.user.id,
        email,
        role
      };

      login(userInfo);

      // Redirección basada en rol
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message || "Error al iniciar sesión. Verifique sus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    try {
      setLoading(true);
      setError("");

      // Validaciones más estrictas
      if (!email || !password) {
        setError("Complete todos los campos");
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Formato de correo electrónico inválido");
        return;
      }

      // Validar contraseña
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      // Registro de usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            role: "user" 
          }
        }
      });

      if (error) throw error;

      // Verificar si el registro fue exitoso
      if (!data.user) {
        throw new Error("No se pudo crear el usuario");
      }

      // Obtener el ID del usuario recién creado
      const userId = data.user.id;

      // Insertar en la tabla de usuarios con las columnas existentes
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({ 
          id: userId,
          correo: email,
          contrasena: password,  // Añadido según el esquema
          rol: "user",
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Mensaje de éxito
      alert("Registro exitoso. Por favor inicia sesión.");

      // Cambiar al modo de inicio de sesión
      setIsRegister(false);
    } catch (error) {
      console.error("Error de registro:", error);
      setError(error.message || "Error en el registro");
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
            <p className="text-red-500 text-sm text-center">{error}</p>
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