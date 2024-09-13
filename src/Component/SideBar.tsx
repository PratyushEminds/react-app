import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Image as ImageIcon
} from "lucide-react";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => (
  <div
    className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${
      isOpen ? "w-64" : "w-16"
    }`}
  >
    <button
      onClick={toggleSidebar}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
    <nav className="mt-16">
      <ul>
        <li>
          <Link to="/" className="flex items-center p-4 hover:bg-gray-700">
            <LayoutDashboard size={20} />
            {isOpen && <span className="ml-2">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/image" className="flex items-center p-4 hover:bg-gray-700">
            <ImageIcon size={20} />
            {isOpen && <span className="ml-2">Image</span>}
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
