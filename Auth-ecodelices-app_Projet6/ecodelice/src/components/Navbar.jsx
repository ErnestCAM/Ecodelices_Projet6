import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#7CB342] text-[#FDF6EC] p-5 flex justify-between items-center shadow-md">
      <h1 className="font-montserrat text-3xl font-bold">ÉcoDélices</h1>
      <ul className="flex space-x-10 text-lg font-semibold">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "border-b-4 border-[#FDF6EC] pb-1"
                : "hover:border-b-4 hover:border-[#d3c8b8] pb-1"
            }
          >
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "border-b-4 border-[#FDF6EC] pb-1"
                : "hover:border-b-4 hover:border-[#d3c8b8] pb-1"
            }
          >
            À propos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "border-b-4 border-[#FDF6EC] pb-1"
                : "hover:border-b-4 hover:border-[#d3c8b8] pb-1"
            }
          >
            Nos produits
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive
                ? "border-b-4 border-[#FDF6EC] pb-1"
                : "hover:border-b-4 hover:border-[#d3c8b8] pb-1"
            }
          >
            Blogue
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "border-b-4 border-[#FDF6EC] pb-1"
                : "hover:border-b-4 hover:border-[#d3c8b8] pb-1"
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
