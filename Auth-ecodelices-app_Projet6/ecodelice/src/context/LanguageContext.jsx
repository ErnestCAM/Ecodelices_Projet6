import React, { createContext, useState, useContext, useEffect } from "react";

// Création du contexte
const LanguageContext = createContext();

// Provider global
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "fr");

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  // Dictionnaire FR/EN nettoyé
  const translations = {
    fr: {
      home: "Accueil",
      about: "À propos",
      products: "Nos produits",
      blog: "Blogue",
      contact: "Contact",
      login: "Connexion",
      register: "Inscription",
      profile: "Profil utilisateur",
      forgotPassword: "Mot de passe oublié",
      loginTitle: "Connexion",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      email: "Email",
      loginSuccess: "Connecté avec succès !",
      loginError: "Erreur de connexion",
      registerSuccess: "Inscription réussie, connectez-vous",
      registerError: "Erreur lors de l'inscription",
      forgotSuccess: "Email de réinitialisation envoyé",
      forgotError: "Erreur lors de la demande",
      resetSuccess: "Mot de passe réinitialisé avec succès. Redirection vers la page de connexion...",
      resetError: "Erreur lors de la réinitialisation",
      sendResetEmail: "Envoyer le lien",
      backToLogin: "Retour à la connexion",
      resetPasswordTitle: "Réinitialiser le mot de passe",
      newPassword: "Nouveau mot de passe",
      resetPasswordButton: "Valider",
      loading: "Chargement en cours...",
      error: "Erreur",
      noProducts: "Aucun produit disponible",
      order: "Commander",
      orderActionFor: "Action pour produit",
      userRole: "avec rôle utilisateur",
      unavailable: "Indisponible",
      edit: "Modifier",
      delete: "Supprimer",
      orderHistory: "Historique des commandes",
      cart: "Panier",
      noOrders: "Aucune commande trouvée",
      downloadReceipt: "Télécharger le reçu",
      emptyCart: "Votre panier est vide",
      remove: "Retirer",
      add: "Ajouter",
      total: "Total",
      clearCart: "Vider le panier",
      yourEmail: "Votre email",
      resetPassword: "Réinitialiser le mot de passe",
      forgotMailSent: "Un email de réinitialisation a été envoyé.",
      forgotMailError: "Erreur lors de l'envoi de l'email.",
      invalidLink: "Lien invalide ou expiré",
      tokenExpired: "Token invalide ou expiré, veuillez renvoyer un nouvel email.",
      requestNewLink: "Demander un nouveau lien",
    },

    en: {
      home: "Home",
      about: "About",
      products: "Products",
      blog: "Blog",
      contact: "Contact",
      login: "Login",
      register: "Register",
      profile: "User Profile",
      forgotPassword: "Forgot Password",
      loginTitle: "Login",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      email: "Email",
      loginSuccess: "Successfully logged in!",
      loginError: "Login error",
      registerSuccess: "Successful registration, please login",
      registerError: "Error during registration",
      forgotSuccess: "Password reset email sent",
      forgotError: "Error during request",
      resetSuccess: "Password successfully reset. Redirecting to login page...",
      resetError: "Error during reset",
      sendResetEmail: "Send link",
      backToLogin: "Back to login",
      resetPasswordTitle: "Reset Password",
      newPassword: "New password",
      resetPasswordButton: "Submit",
      loading: "Loading...",
      error: "Error",
      noProducts: "No products available",
      order: "Order",
      orderActionFor: "Action for product",
      userRole: "with user role",
      unavailable: "Unavailable",
      edit: "Edit",
      delete: "Delete",
      orderHistory: "Order History",
      cart: "Cart",
      noOrders: "No orders found",
      downloadReceipt: "Download Receipt",
      emptyCart: "Your cart is empty",
      remove: "Remove",
      add: "Add",
      total: "Total",
      clearCart: "Clear Cart",
      yourEmail: "Your email",
      resetPassword: "Reset password",
      forgotMailSent: "A reset email has been sent.",
      forgotMailError: "Error sending email.",
      invalidLink: "Invalid or expired link",
      tokenExpired: "Your token is invalid or expired, request a new one.",
      requestNewLink: "Request new link",
    },
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook pratique pour accéder à la langue
export const useLanguage = () => useContext(LanguageContext);
