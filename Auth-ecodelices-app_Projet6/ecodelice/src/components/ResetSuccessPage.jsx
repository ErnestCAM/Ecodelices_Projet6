import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // facultatif pour animation
import { HiCheckCircle } from "react-icons/hi";

export default function ResetSuccessPage() {
  const navigate = useNavigate();

  // Redirection automatique vers /login après quelques secondes
  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#FDF6EC] dark:bg-gray-900 transition-colors text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <HiCheckCircle className="text-green-500 dark:text-[#A8E06E]" size={90} />
        <h1 className="text-3xl font-bold mt-4 text-[#4C8B2B] dark:text-[#A8E06E]">
          Réinitialisation réussie !
        </h1>
        <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-md">
          Votre mot de passe a été réinitialisé avec succès. Vous allez être
          redirigé vers la page de connexion pour accéder à votre compte avec
          votre nouveau mot de passe.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 bg-[#7CB342] hover:bg-green-700 text-white px-5 py-2 rounded font-semibold transition"
        >
          Se connecter maintenant
        </button>
      </motion.div>
    </div>
  );
}
