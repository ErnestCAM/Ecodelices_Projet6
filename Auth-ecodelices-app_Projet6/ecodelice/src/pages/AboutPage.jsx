import React from "react";
import { Users, MapPin, Calendar, Leaf } from "lucide-react";
import aboutpic1 from "../assets/aboutpic1.jpg";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 bg-[#FDF6EC] dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold font-montserrat mb-6 tracking-tight drop-shadow
                       text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500"
          >
            Notre Histoire
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed
                       text-gray-700 dark:text-gray-200 transition-colors duration-500"
          >
            Découvrez l'histoire passionnante d'ÉcoDélices, née de l'amour pour
            les produits authentiques et le respect de la nature.
          </p>
        </div>

        {/* MAIN STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2
              className="text-3xl mb-6 font-semibold
                         text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500"
            >
              L'aventure commence en 2020
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed transition-colors duration-500">
              Tout a commencé dans la cuisine de Josiane et Tristan Tremblay,
              passionnés de cuisine et amoureux de la nature. Après avoir quitté
              leurs emplois dans la finance, ils ont décidé de se reconvertir
              pour créer des produits qui leur ressemblent : authentiques,
              naturels et respectueux de l'environnement.
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed transition-colors duration-500">
              Installés dans une petite ferme en Provence, ils ont commencé par
              cultiver leurs propres fruits biologiques. Rapidement, leur
              passion pour la transformation artisanale les a menés à créer
              leurs premières confitures, d'abord pour la famille et les amis,
              puis pour les marchés locaux.
            </p>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-500">
              Aujourd'hui, ÉcoDélices emploie une équipe de 8 personnes
              passionnées et fournit plusieurs points de vente dans toute la
              région, tout en gardant ses valeurs d'origine : qualité,
              authenticité et respect de l'environnement.
            </p>
          </div>
          <div>
            <img
              src={aboutpic1}
              alt="L'histoire d'ÉcoDélices"
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* KEY FACTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
            <Calendar className="w-8 h-8 text-[#7CB342] mx-auto mb-4" />
            <h3 className="text-2xl mb-2 text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500">
              2020
            </h3>
            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
              Année de création
            </p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
            <Users className="w-8 h-8 text-[#7CB342] mx-auto mb-4" />
            <h3 className="text-2xl mb-2 text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500">
              8
            </h3>
            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
              Employés passionnés
            </p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
            <MapPin className="w-8 h-8 text-[#7CB342] mx-auto mb-4" />
            <h3 className="text-2xl mb-2 text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500">
              50+
            </h3>
            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
              Points de vente
            </p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-500">
            <Leaf className="w-8 h-8 text-[#7CB342] mx-auto mb-4" />
            <h3 className="text-2xl mb-2 text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500">
              100%
            </h3>
            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
              Produits biologiques
            </p>
          </div>
        </div>

        {/* MISSION & VALUES */}
        <div className="bg-[#FDF6EC] dark:bg-[#222A20] rounded-lg p-8 lg:p-12 transition-colors duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl mb-6 font-semibold text-[#2C3E2D] dark:text-[#A8E06E] transition-colors duration-500">
                Notre Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed transition-colors duration-500">
                Créer des confitures d'exception qui révèlent toute la saveur
                naturelle des fruits, tout en respectant l'environnement et en
                soutenant l'agriculture locale biologique.
              </p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-500">
                Nous croyons que la qualité passe par la patience, le
                savoir-faire traditionnel et le choix de matières premières
                exceptionnelles.
              </p>
            </div>
            <div>
              <h2 className="text-3xl mb-6 font-semibold text-[#2C3E2D] dark:text-[#A8E06E] transition-colors durée-500">
                Nos Engagements
              </h2>
              <ul className="space-y-4 text-gray-700 dark:text-gray-200 transition-colors duration-500">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#7CB342] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Fruits 100% biologiques et locaux quand c'est possible
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#7CB342] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Méthodes de production respectueuses de l'environnement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#7CB342] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Emballages recyclables et éco-responsables
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#7CB342] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Soutien aux producteurs locaux
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-[#7CB342] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Transparence totale sur nos méthodes de fabrication
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
