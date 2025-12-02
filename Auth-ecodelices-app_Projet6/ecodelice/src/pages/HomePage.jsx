import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import homepic1 from "../assets/homepic1.jpg";
import homepic2 from "../assets/homepic2.jpg";
import homepic3 from "../assets/homepic3.jpg";
import axios from "axios";

const navLinks = [
  {
    name: "À propos",
    path: "/about",
    desc: "Découvrez notre histoire, notre équipe et nos valeurs écologiques.",
  },
  {
    name: "Nos produits",
    path: "/products",
    desc: "Découvrez et magasinez vos confitures bio favorites.",
  },
  {
    name: "Blogue",
    path: "/blog",
    desc: "Explorez nos recettes, conseils et actualités durables.",
  },
  {
    name: "Contact",
    path: "/contact",
    desc: "Pour poser vos questions ou communiquer avec nous.",
  },
];

export default function HomePage() {
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => {
        const products = res.data;
        setTopProducts(
          products.length <= 6
            ? products
            : [...products].sort(() => 0.5 - Math.random()).slice(0, 6)
        );
      })
      .catch(() => setTopProducts([]));
  }, []);

  const featureSections = [
    {
      img: homepic1,
      title: "De la nature à votre table",
      desc: "Des fruits bio, cueillis et cuisinés avec passion pour préserver le goût et les valeurs qui font notre réputation.",
      reverse: false,
    },
    {
      img: homepic2,
      title: "Savoir-faire & Authenticité",
      desc: "Nos recettes uniques sont transmises dans le respect de l’environnement et la tradition culinaire provençale.",
      reverse: true,
    },
    {
      img: homepic3,
      title: "Engagement local",
      desc: "Soutien aux producteurs, emballages écoresponsables et circuits courts sans compromis sur la saveur.",
      reverse: false,
    },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-lora text-lg space-y-16 flex flex-col md:flex-row">
      {/* NAV bar latérale gauche */}
      <aside className="md:w-64 shrink-0 mb-8 md:mb-0 md:mr-12">
        <nav className="space-y-6">
          <h3 className="text-xl font-bold text-[#7CB342] mb-4">Accès rapide</h3>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block bg-white dark:bg-gray-900 border border-[#7CB342] rounded-lg p-4 hover:shadow-lg hover:bg-[#FDF6EC] dark:hover:bg-gray-800 transition"
            >
              <div className="font-semibold text-[#7CB342] dark:text-[#A8E06E] mb-1">{link.name}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{link.desc}</div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <section className="flex-1 flex flex-col space-y-16">
        {/* HERO */}
        <section className="dark:bg-[#273427] bg-opacity-10 rounded-xl p-10 text-center font-montserrat shadow mb-4">
          <h2 className="text-5xl font-bold mb-4 text-gray-700 dark:text-gray-200">
            Bienvenue chez ÉcoDélices
          </h2>
          <p className="italic text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-200">
            Des confitures artisanales bio, naturelles et savoureuses, fabriquées avec passion et savoir-faire.
          </p>
        </section>

        {/* Alternance images/texte */}
        {featureSections.map((section, i) => (
          <section
            key={i}
            className={`grid grid-cols-1 md:grid-cols-2 items-center gap-12 bg-white dark:bg-gray-900 rounded-xl shadow py-10`}
          >
            <div
              className={`px-8 flex flex-col justify-center ${
                section.reverse ? "md:order-2" : "md:order-1"
              }`}
            >
              <h3 className="text-3xl font-montserrat text-[#7CB342] mb-4 dark:text-[#A8E06E]">{section.title}</h3>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{section.desc}</p>
            </div>
            <div className={`px-8 flex justify-center ${section.reverse ? "md:order-1" : "md:order-2"}`}>
              <img
                src={section.img}
                alt={section.title}
                className="w-full max-w-md h-[320px] object-cover rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          </section>
        ))}

        {/* Produits phares */}
        <section className="space-y-6">
          <h3 className="text-3xl font-montserrat text-[#7CB342] dark:text-[#A8E06E]">
            Nos produits phares
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded mb-3"
                />
                <h4 className="font-bold text-xl text-[#7CB342] dark:text-[#A8E06E] mb-1">{product.name}</h4>
                <p className="text-gray-600 dark:text-gray-200 mb-2">{product.description}</p>
                <span className="font-semibold text-lg text-[#2C3E2D] dark:text-[#A8E06E]">
                  {new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(product.price)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophie */}
        <section className="bg-[#FDF6EC] dark:bg-[#273427] border-2 border-[#7CB342] rounded-lg p-10 text-gray-700 dark:text-gray-200 font-lora max-w-3xl mx-auto mt-8">
          <h3 className="text-2xl font-montserrat mb-3 text-[#7CB342] dark:text-[#A8E06E]">Notre philosophie</h3>
          <p>
            Respect de la nature, ingrédients bio, qualité artisanale : notre engagement envers un goût authentique et durable.
          </p>
        </section>
      </section>
    </main>
  );
}
