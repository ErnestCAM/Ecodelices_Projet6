import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo-ecodelicesdb.png";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
  };

  const linkBase =
    "px-3 py-2 rounded-full text-sm font-medium transition-colors";
  const activeClasses = "bg-[#7CB342]/10 text-[#2F5A1A]";
  const inactiveClasses = "text-gray-700 hover:text-white";

  return (
    <header className="bg-white shadow mb-4">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo cliquable */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <img
            src={logo}
            alt="ÉcoDélices"
            className="h-12 w-auto object-contain"
          />
          <span className="text-2xl font-bold text-white group-hover:text-[#5A922B] transition-colors">
            ÉcoDélices
          </span>
        </button>

        <nav className="flex items-center gap-3 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            À propos
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Produits
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Blogue
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Contact
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className="ml-3 px-4 py-2 bg-[#5cb342] text-white rounded-full text-sm font-semibold hover:bg-green-700"
            >
              Se connecter
            </NavLink>
          ) : (
            <div className="flex items-center gap-3 ml-3">
              <span className="text-xs text-gray-700">
                {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded-full text-xs hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
