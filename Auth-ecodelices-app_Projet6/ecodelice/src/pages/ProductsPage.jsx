import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }
  const { user } = useContext(UserContext);
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur /api/products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ferme automatiquement le toast après 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }
    addToCart(product);
    showToast(`"${product.name}" ajouté au panier.`);
  };

  const handleGoToBasket = () => {
    if (!user) {
      navigate("/login", { state: { from: "/basket" } });
    } else {
      navigate("/basket");
    }
  };

  // ADMIN : changer disponibilité
  const toggleAvailability = async (product) => {
    if (!user || user.role !== "admin") return;
    try {
      const newAvailable = !product.available;
      await axios.patch(
        `http://localhost:4000/products/${product.id}/availability`,
        { available: newAvailable },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, available: newAvailable } : p
        )
      );
      showToast(
        `Produit "${product.name}" ${
          newAvailable ? "rendu disponible" : "rendu indisponible"
        }.`,
        "info"
      );
    } catch (err) {
      console.error("Erreur maj disponibilité:", err.response?.data || err);
      showToast("Impossible de mettre à jour la disponibilité", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-green-600">Nos produits</h1>
            <p className="text-gray-600 mt-2">
              Découvrez toute notre sélection de confitures et gelées bio.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => navigate("/history")}
                className="px-6 py-3 rounded-full font-bold text-white bg-gray-800 hover:bg-gray-900 shadow"
              >
                Mon historique
              </button>
            )}

            <button
              onClick={handleGoToBasket}
              className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              }`}
              disabled={cartItems.length === 0}
            >
              🛒 ({cartItems.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-44 object-cover rounded mb-3"
                  />
                )}
                <h4 className="font-bold text-xl text-[#7CB342] dark:text-[#A8E06E] mb-1">
                  {product.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-200 mb-2 flex-1">
                  {product.description}
                </p>
                <span className="font-semibold text-lg text-[#2C3E2D] dark:text-[#A8E06E] mb-2">
                  {new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(product.price)}
                </span>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      product.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.available ? "Disponible" : "Indisponible"}
                  </span>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => toggleAvailability(product)}
                      className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100"
                    >
                      {product.available
                        ? "Rendre indisponible"
                        : "Rendre dispo"}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition"
                  disabled={!product.available}
                >
                  {product.available ? "Ajouter au panier" : "Indisponible"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-gray-500">
                Aucun produit disponible pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-6 px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-3
          ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : toast.type === "info"
              ? "bg-blue-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-xs underline"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
