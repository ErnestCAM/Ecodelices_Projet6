// UserProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const { user, isLoading } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      axios
        .get("http://localhost:4000/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          setOrders(res.data);
          setOrdersError(null);
        })
        .catch((err) => {
          setOrdersError("Erreur lors du chargement des commandes.");
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    navigate("/login", { state: { from: "/profile" } });
    return null;
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-[#7CB342] mb-4">Profil utilisateur</h2>
      <div className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Nom d'utilisateur :</span> {user.username}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Email :</span> {user.email}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Rôle :</span> {user.role}
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3 text-[#7CB342]">Historique de commandes</h3>
      {ordersLoading ? (
        <div>Chargement de l'historique...</div>
      ) : ordersError ? (
        <div className="text-red-600">{ordersError}</div>
      ) : orders.length === 0 ? (
        <div>Aucune commande trouvée.</div>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {orders.map((order) => (
            <li key={order.id} className="p-4">
              <div>
                <strong>Commande #{order.id}</strong> du{" "}
                {new Date(order.order_date).toLocaleDateString()} :{" "}
                <span className="text-gray-700 font-medium">{order.total_amount} $CAD</span>
              </div>
              <div>
                Statut :{" "}
                <span
                  className={
                    order.status === "payée"
                      ? "text-green-600 font-bold"
                      : "text-orange-600 font-semibold"
                  }
                >
                  {order.status}
                </span>
              </div>
              <div>
                Code reçu : {order.receipt_code ? order.receipt_code : "Indisponible"}
              </div>
              {/* Bouton de téléchargement conditionnel */}
              {order.status === "payée" && order.receipt_code && (
                <a
                  href={`http://localhost:4000/receipt/${order.id}/pdfBase64`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-[#7CB342] text-white px-4 py-2 rounded shadow font-bold text-sm hover:bg-green-700 transition"
                >
                  Télécharger le reçu PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
