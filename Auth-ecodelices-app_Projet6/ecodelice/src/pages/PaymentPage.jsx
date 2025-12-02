import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { basket, total } = location.state || {};

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation paiement
    setTimeout(() => {
      setLoading(false);
      navigate(`/confirmation/${orderId}`, { 
        state: { orderId, total, basket } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">💳</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Paiement sécurisé</h1>
            <p className="text-xl text-gray-600">Total: <span className="font-bold text-2xl text-green-600">{total?.toFixed(2)}€</span></p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-4 border rounded-2xl" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="MM/AA" className="p-4 border rounded-xl" required />
              <input type="text" placeholder="123" maxLength="3" className="p-4 border rounded-xl" required />
            </div>
          
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Paiement...
                </>
              ) : (
                `Payer ${total?.toFixed(2)}€`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
