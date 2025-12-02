// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ResetSuccessPage from "../components/ResetSuccessPage";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetDone, setResetDone] = useState(false);

  // Vérifier la validité du token dès l'arrivée
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post("http://localhost:4000/verify-token", { token });
        if (res.data.valid) setValidToken(true);
      } catch {
        setValidToken(false);
        setError(t("tokenExpired"));
      }
    };
    if (token) verifyToken();
  }, [token]);

  // Gestion de la soumission
  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/reset-password", {
        token,
        newPassword: password,
      });
      setMessage(res.data.message || t("resetSuccess"));
      setResetDone(true); // <- affiche ResetSuccessPage
    } catch (err) {
      setError(err.response?.data || t("resetError"));
    }
  }

  // Si la réinitialisation est réussie → page animée de succès
  if (resetDone) return <ResetSuccessPage />;

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#FDF6EC] dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded p-6 w-full max-w-md text-gray-900 dark:text-gray-100">
        {/* TOKEN INVALIDE */}
        {!validToken ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">{t("invalidLink")}</h2>
            {error && <p className="text-gray-600">{error}</p>}
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-6 bg-[#7CB342] text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
            >
              {t("requestNewLink")}
            </button>
          </div>
        ) : (
          <>
            {/* TOKEN VALIDE - FORMULAIRE RESET */}
            <h2 className="text-2xl font-bold mb-4 text-[#7CB342] dark:text-[#A8E06E] text-center">
              {t("resetPasswordTitle")}
            </h2>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <input
                type="password"
                placeholder={t("newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="password"
                placeholder={t("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-black"
              />
              <button
                type="submit"
                className="bg-[#7CB342] text-white w-full py-2 rounded font-semibold hover:bg-green-700 transition"
              >
                {t("resetPasswordButton")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
