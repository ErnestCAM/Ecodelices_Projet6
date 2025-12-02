import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/login", { username, password });
      const token = res.data.token;
      const userRes = await axios.get("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userRes.data;
      setUser({ ...userData, token });
      localStorage.setItem("token", token);

      // Après login réussi : redirection
      let redirectTo = "/";
      if (location.state?.from) {
        redirectTo = location.state.from; // Toujours une string, pas un objet ou .pathname
      }
      navigate(redirectTo, {
        replace: true,
        state: location.state?.basket ? { basket: location.state.basket } : undefined,
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        t("loginFailed") ||
        "Échec de connexion"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-2xl font-semibold mb-4">{t("login") || "Connexion"}</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">{t("username") || "Nom d'utilisateur"}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t("password") || "Mot de passe"}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#7CB342] text-white py-2 rounded hover:bg-green-600"
        >
          {t("login") || "Connexion"}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Mot de passe oublié ?
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline">
          S'inscrire
        </Link>
      </div>
    </div>
  );
}
