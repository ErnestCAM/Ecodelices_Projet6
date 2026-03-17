Ecodelice – Site vitrine, blog et mini e‑commerce
Application full‑stack pour présenter ÉcoDélices (confitures artisanales bio), gérer un blog et permettre la commande de produits avec compte client, panier et simulation de paiement.

1. Fonctionnalités
Site vitrine public (accueil, produits, blog, contact) accessible sans login.
​

Authentification par email/mot de passe (JWT), avec rôles user et admin.

Espace client : gestion du panier, passage de commande et paiement simulé.

Génération de reçu de commande avec identifiant unique et code‑barres (simulation, prêt pour PDF).
​

Espace admin : gestion des produits, disponibilités et articles de blog (texte + médias).
​

Stack : React + Node/Express + MySQL, le tout dockerisé avec Docker Compose.

2. Stack technique
Frontend : React, React Router, Context API pour l’état utilisateur et le panier, Axios pour les appels API.

Backend : Node.js, Express, JWT, bcrypt, gestion des commandes et paiement simulé.

Base de données : MySQL (tables utilisateurs, produits, commandes, lignes de commande, articles de blog).

Docker :

Un container frontend (React)

Un container backend (Express)

Un container MySQL avec volume de données

Orchestration via docker-compose.yml

3. Architecture du projet
Arborescence recommandée :

text
ecodelice/
  frontend/
    src/
      components/
      pages/
      context/
      services/
  backend/
    src/
      routes/
      controllers/
      models/
      middleware/
    config/
  db/
    init.sql
  docker/
    frontend.Dockerfile
    backend.Dockerfile
  docker-compose.yml
  README.md
frontend/ : logique UI, routing, context Auth/Basket.

backend/ : API REST (auth, produits, panier, commandes, blog).
​

db/init.sql : création de la base et des tables + éventuelles données de démo.

docker-compose.yml : définition des services frontend, backend, mysql.

4. Base de données
4.1 Tables principales
users : id, nom, email (unique), mot de passe hashé, rôle (user/admin).

products : id, nom, description, prix, stock, image, actif.

orders : id, user_id, total, status (pending, paid…), payment_reference, barcode_value.
​

order_items : id, order_id, product_id, quantity, unit_price.
​

posts : id, titre, contenu, image, auteur, date_publication, status.

4.2 Initialisation avec Docker
Le service MySQL est initialisé via un script monté dans le container, par exemple :

text
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: <root_password>
      MYSQL_DATABASE: ecodelice
      MYSQL_USER: <user>
      MYSQL_PASSWORD: <password>
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
5. Backend (Node/Express)
5.1 Endpoints principaux
Auth :

POST /api/auth/register – création de compte.
​

POST /api/auth/login – login, retour token + infos utilisateur.
​

GET /api/auth/profile – profil utilisateur (protégé, JWT).
​

Produits :

GET /api/products – liste publique des produits.
​

GET /api/products/:id – détail produit.

POST /api/products – création (admin).
​

PUT /api/products/:id – mise à jour (admin).

DELETE /api/products/:id – suppression (admin).

Panier / Commandes :

POST /api/orders – création d’une commande à partir du panier (user connecté).

GET /api/orders – liste des commandes de l’utilisateur.

GET /api/orders/:id – détails commande.

POST /api/orders/:id/pay – simulation de paiement, génération d’un identifiant et d’un code‑barres.
​

GET /api/orders/:id/receipt – récupération des infos de reçu (pour affichage/téléchargement).
​

Blog :

GET /api/posts – liste d’articles.

GET /api/posts/:id – détail article.

POST /api/posts – création (admin).

PUT /api/posts/:id – édition (admin).

DELETE /api/posts/:id – suppression (admin).

5.2 Authentification & sécurité
JWT stocké côté client (localStorage ou cookie) et envoyé dans Authorization: Bearer <token>.
​

Middleware auth pour vérifier le token et attacher l’utilisateur à req.user.
​

Middleware isAdmin pour sécuriser les routes d’administration.
​

6. Frontend (React)
6.1 Pages principales
HomePage : présentation ÉcoDélices, mise en avant de quelques produits/articles.
​

ProductsPage : catalogue produits, bouton “Ajouter au panier”, bouton “Commander”.

BasketPage : récapitulatif du panier, bouton “Valider la commande” (redirige vers login si non connecté).
​

AuthPage : login / register, mise à jour du contexte utilisateur et redirection.
​

BlogPage : liste des articles.

AdminDashboard : gestion produits, commandes, blog (visible seulement pour un admin).
​

6.2 State global & navigation
UserContext : stocke utilisateur connecté + token + rôle.
​

Basket : state local ou context + éventuellement persistance dans localStorage.
​

Routes protégées :

PrivateRoute pour les pages nécessitant un login (panier final, commandes, profil).

AdminRoute pour le back‑office.
​

6.3 Intégration API
Service Axios centralisé, avec baseURL (backend) et intercepteur pour injecter le token.
​

Gestion des erreurs (toast / messages) pour login, paiement et erreurs serveur MySQL.

7. Docker & Docker Compose
7.1 Dockerfiles
Exemple pour le backend :

text
# docker/backend.Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/. .

EXPOSE 5000
CMD ["npm", "start"]
Exemple pour le frontend :

text
# docker/frontend.Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
7.2 docker-compose.yml
Structure type pour React + Express + MySQL :

text
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    container_name: ecodelice-mysql
    environment:
      MYSQL_ROOT_PASSWORD: <root_password>
      MYSQL_DATABASE: ecodelice
      MYSQL_USER: <user>
      MYSQL_PASSWORD: <password>
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: always

  backend:
    build:
      context: .
      dockerfile: ./docker/backend.Dockerfile
    container_name: ecodelice-backend
    environment:
      DB_HOST: mysql
      DB_USER: <user>
      DB_PASSWORD: <password>
      DB_DATABASE: ecodelice
      JWT_SECRET: <secret>
    depends_on:
      - mysql
    ports:
      - "5000:5000"

  frontend:
    build:
      context: .
      dockerfile: ./docker/frontend.Dockerfile
    container_name: ecodelice-frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:5000
    ports:
      - "3000:3000"

volumes:
  db_data:
8. Installation & lancement
8.1 Prérequis
Node.js ≥ 18

Docker & Docker Compose installés.
​

Git (optionnel)

8.2 Lancement avec Docker
bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd ecodelice

# Créer le fichier .env backend si nécessaire
cp backend/.env.example backend/.env
# puis renseigner les variables (JWT_SECRET, DB_*, etc.)

# Démarrer l’ensemble
docker compose up --build
Frontend : http://localhost:3000

Backend API : http://localhost:5000

MySQL : localhost:3306 (ou via le container mysql).

8.3 Lancement sans Docker (dev)
Backend :

bash
cd backend
npm install
npm run dev
Frontend :

bash
cd frontend
npm install
npm run dev
9. Scénarios d’utilisation
Visiteur : navigue sur le site, consulte produits et blog sans compte.
​

Client : crée un compte, ajoute des produits au panier, valide la commande, simule le paiement, consulte son reçu.

Admin : se connecte avec un compte admin, gère le catalogue, les articles de blog et la disponibilité des produits.
​

10. Évolutions possibles
Intégration d’un vrai prestataire de paiement (Stripe, PayPal, etc.).
​

Génération de reçus PDF téléchargeables.
​

Gestion d’images via stockage externe (S3, Firebase Storage…).

Internationalisation (FR/EN) et SEO avancé.
