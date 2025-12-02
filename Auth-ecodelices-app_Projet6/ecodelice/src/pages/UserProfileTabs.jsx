import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

export default function UserProfileTabs({ user }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("history");
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = React.useState([]);

  useEffect(() => {
    if (activeTab === "history" && user) {
      axios
        .get("http://localhost:4000/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => setOrders(res.data))
        .catch(console.error);
    }
  }, [activeTab, user]);

  // Le panier ici est stocké dans le state local (tu peux lier avec un contexte ou backend)
  
  function removeFromCart(productId) {
    setCart(cart.filter(item => item.product_id !== productId));
  }

  function downloadReceipt(orderId) {
    window.open(`http://localhost:4000/receipt/${orderId}/barcode`, "_blank");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 dark:text-gray-100 rounded shadow">
      <div className="flex space-x-4 mb-4 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "history" ? "border-b-4 border-[#7CB342]" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          {t("orderHistory")}
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "cart" ? "border-b-4 border-[#7CB342]" : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          {t("cart")}
        </button>
      </div>

      {activeTab === "history" && (
        <>
          {orders.length === 0 ? (
            <p>{t("noOrders")}</p>
          ) : (
            <ul>
              {orders.map(order => (
                <li key={order.id} className="mb-4 p-2 border rounded">
                  <div>Date: {new Date(order.order_date).toLocaleDateString()}</div>
                  <div>Total: {order.total_amount} €</div>
                  <div>Status: {order.status}</div>
                  <button
                    className="mt-2 bg-[#7CB342] text-white rounded px-3 py-1"
                    onClick={() => downloadReceipt(order.id)}
                  >
                    {t("downloadReceipt")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {activeTab === "cart" && (
        <>
          {cart.length === 0 ? (
            <p>{t("emptyCart")}</p>
          ) : (
            <ul>
              {cart.map(item => (
                <li key={item.product_id} className="mb-4 p-2 border rounded flex justify-between items-center">
                  <span>{item.product_name}</span>
                  <button
                    className="bg-red-600 text-white rounded px-3 py-1"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
