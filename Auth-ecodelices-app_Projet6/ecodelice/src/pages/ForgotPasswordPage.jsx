import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("http://localhost:4000/forgot-password", { email });
      setMessage("Un email de réinitialisation a été envoyé.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Erreur lors de la demande de réinitialisation.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-12">
      <h2 className="text-2xl font-semibold mb-4">{t("forgotPassword") || "Mot de passe oublié"}</h2>

      {message && <div className="text-green-700 mb-4">{message}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">{t("email") || "Email"}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#7CB342] text-white py-2 rounded hover:bg-green-600"
        >
          {t("sendResetEmail") || "Envoyer le lien"}
        </button>
      </form>
    </div>
  );
}
