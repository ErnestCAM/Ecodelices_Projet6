import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2C3E2D] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl mb-4 text-[#7CB342]">ÉcoDélices</h3>
            <p className="text-gray-300 mb-4">
              Confitures artisanales biologiques depuis 2020.<br/>
              Nous transformons les meilleurs fruits locaux en délicieuses confitures 
              dans le respect de l'environnement.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[#7CB342]" />
                <span>205 avenue Viger ouest, Montréal, Québec Canada, H2Z 1G2</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#7CB342]" />
                <span>(514) 316-0220</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-[#7CB342]" />
                <span>contact@ecodelices.ca</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold">Horaires</h4>
            <div className="text-gray-300 space-y-2">
              <p>Lundi - Vendredi : 9h - 18h</p>
              <p>Samedi : 9h - 17h</p>
              <p>Dimanche : Fermé</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2025 ÉcoDélices. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
