// ContactPage.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:4000/contact", form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Erreur lors de l’envoi, veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-8 font-lora text-lg space-y-8 max-w-lg">
      
      <h1 className="text-4xl font-montserrat text-[#7CB342] mb-6">
        Contactez-nous
      </h1>

      {/* FORMULAIRE */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-semibold mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            value={form.message}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 p-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-[#7CB342] text-[#FDF6EC] px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
        </button>

        {sent && (
          <div className="text-green-600 font-bold mt-3">
            Merci, votre message a bien été envoyé.
          </div>
        )}

        {error && (
          <div className="text-red-600 font-bold mt-3">
            {error}
          </div>
        )}
      </form>

      {/* GOOGLE MAPS */}
      <div className="mt-12 space-y-3">
        <h2 className="text-2xl font-montserrat font-semibold text-[#7CB342]">
          Notre emplacement
        </h2>

        <iframe
          title="Localisation Collège Universel Montréal"
          className="rounded shadow-lg w-full h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.25818653229!2d-73.5614815!3d45.5052654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91b06eaa764df%3A0xbad7d3d16a9e22f1!2sColl%C3%A8ge%20Universel%20-%20Campus%20Montr%C3%A9al!5e0!3m2!1sfr!2sca!4v1701550680000!5m2!1sfr!2sca"
        ></iframe>
      </div>

    </main>
  );
}
