import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function BasketPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // items au format attendu par ton backend: product_id + quantity
      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity || 1,
      }));

      const res = await axios.post("http://localhost:4000/orders", { items });
      const { orderId, totalTTC } = res.data;

      navigate(`/payment/${orderId}`, {
        state: { basket: cartItems, total: totalTTC || total, orderId },
      });
    } catch (error) {
      console.error("Erreur validation commande:", error.response?.data || error.message);
      alert("Erreur validation commande");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
            🛒
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Panier vide</h2>
          <a
            href="/products"
            className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold hover:bg-green-700"
          >
            Voir les produits
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Votre panier
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6"
              >
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {item.price}€
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-xl p-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, (item.quantity || 1) - 1)
                      }
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg mx-3">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, (item.quantity || 1) + 1)
                      }
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Résumé</h3>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-lg">
                <span>Sous-total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Livraison</span>
                <span className="text-green-600 font-bold">Gratuite</span>
              </div>
              <hr />
              <div className="flex justify-between text-2xl font-bold text-green-600">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Validation..." : "Passer à la caisse"}
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-sm text-red-500 hover:text-red-700"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
