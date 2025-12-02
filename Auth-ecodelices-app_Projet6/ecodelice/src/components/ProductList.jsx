import { useState, useEffect } from 'react';
import axios from 'axios';
import JamCard from './JamCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);
  return (
    <div className="flex flex-wrap justify-center">
      {products.map(product => <JamCard key={product.id} {...product} />)}
    </div>
  );
}
