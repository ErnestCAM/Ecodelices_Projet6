import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleOrderClick = () => {
    console.log("Bouton Commander cliqué pour produit id:", id);
    navigate(`/order/${id}`);
  };

  return (
    <div>
      <h1>Détail du produit #{id}</h1>
      <button
        onClick={handleOrderClick}
        className="bg-[#7CB342] text-[#FDF6EC] rounded px-4 py-2 font-semibold"
        type="button"
      >
        Commander
      </button>
    </div>
  );
}
