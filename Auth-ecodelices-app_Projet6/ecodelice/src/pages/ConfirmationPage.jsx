import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { jsPDF } from 'jspdf';

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { total, basket } = location.state || {};

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('REÇU COMMANDE ECODELICES', 20, 30);
    doc.setFontSize(12);
    doc.text(`N°: ${orderId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
    
    let y = 80;
    basket?.forEach(item => {
      doc.text(`${item.name} x${item.quantity || 1} - ${(item.price * (item.quantity || 1)).toFixed(2)}€`, 20, y);
      y += 10;
    });
    
    doc.setFontSize(16);
    doc.text(`TOTAL: ${total?.toFixed(2)}€`, 20, y + 10);
    doc.save(`recu-${orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="w-32 h-32 mx-auto mb-8 bg-green-100 rounded-3xl flex items-center justify-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white">✓</div>
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Commande confirmée !
        </h1>
        <p className="text-2xl text-gray-600 mb-2">N° <span className="font-mono font-bold text-green-600 text-3xl">{orderId}</span></p>
        <p className="text-3xl font-bold text-green-600 mb-12">{total?.toFixed(2)}€</p>

        <button
          onClick={generatePDF}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl mx-auto mb-12 flex items-center gap-3"
        >
          📄 Télécharger reçu PDF
        </button>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Link to="/products" className="flex-1 bg-green-600 text-white py-4 px-8 rounded-2xl font-bold text-center hover:bg-green-700">
            Continuer achats
          </Link>
          <Link to="/history" className="flex-1 bg-gray-800 text-white py-4 px-8 rounded-2xl font-bold text-center hover:bg-gray-900">
            Mon historique
          </Link>
        </div>
      </div>
    </div>
  );
}
