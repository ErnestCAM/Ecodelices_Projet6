import { useEffect, useState } from "react";
import axios from "axios";

export default function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:4000/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!orders.length) return <div>Aucune commande passée.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded">
      <h2>Historique des commandes</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id} className="mb-4 border-b pb-2">
            <div>ID: {o.id}</div>
            <div>Date: {o.order_date}</div>
            <div>Montant: {o.total_amount} €</div>
            <div>Statut: {o.status}</div>
            <div>
              {o.receipt_code && <a href={`http://localhost:4000/receipt/${o.id}/barcode`} target="_blank">Voir code-barres</a>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
