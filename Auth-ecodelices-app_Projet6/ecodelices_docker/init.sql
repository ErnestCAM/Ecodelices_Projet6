CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(5,2),
  image VARCHAR(255)
);

INSERT INTO products (name, description, price, image) VALUES
('Confiture Fraise', 'Confiture bio de fraises, sucrée naturellement.', 5.00, 'https://cgreenag.com/assets/images/crop-images/strawberry/Strawberrieswithleaves..png'),
('Confiture Framboise', 'Confiture bio de framboises, parfum intense.', 6.00, 'https://cdn.britannica.com/83/156583-050-4A1FABB5/Red-raspberries.jpg'),
('Confiture Abricot', 'Confiture bio d’abricots, goût doux et fruité.', 5.50, 'https://thumbs.dreamstime.com/b/apricot-jam-25528040.jpg'),
('Confiture Mûre', 'Confiture bio de mûres, texture riche et parfumée.', 6.20, 'https://ogden_images.s3.amazonaws.com/www.motherearthgardener.com/images/2012/06/19160414/Blackberry-Jam-jpg.jpg'),
('Confiture Cassis', 'Confiture bio de cassis, saveur intense.', 6.00, 'https://www.recipesmadeeasy.co.uk/wp-content/uploads/2017/07/blackcurrant-jam-jar-sq-1.jpg'),
('Gelée Groseille', 'Gelée artisanale de groseille, sans pépins.', 4.90, 'https://www.daringgourmet.com/wp-content/uploads/2021/02/Red-Currant-Jelly-1-1024x1536.jpg'),
('Marmelade Orange', 'Marmelade bio d’oranges amères, recette britannique.', 5.80, 'https://realfood.tesco.com/media/images/1400x919-marmalade-4a65ff09-a7bb-421f-b93e-2ea2856ad27e-0-1400x919.jpg'),
('Confiture Rhubarbe', 'Confiture maison rhubarbe, acidulée et rafraîchissante.', 6.00, 'https://www.foodbasics.ca/userfiles/image/recipes/2021/rhubarb-jam2x.jpg');
