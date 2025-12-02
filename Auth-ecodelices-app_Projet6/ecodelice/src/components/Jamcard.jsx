export default function JamCard({ name, description, price, image }) {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
        {image && <img className="w-full h-48 object-cover" src={image} alt={name} />}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{name}</div>
          <p className="text-gray-700 text-base">{description}</p>
          <p className="text-green-600 font-semibold mt-2">{price} €</p>
        </div>
      </div>
    );
  }
  