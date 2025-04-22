import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminItemPage() {
  const [items, setItems] = useState([]);
  const [itemsLoaded, setItemLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!itemsLoaded) {
      const token = localStorage.getItem("token");
      axios
        .get(`${backendUrl}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setItems(res.data);
          setItemLoaded(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [itemsLoaded]);

  const handleDelete = (key) => {
    setItems(items.filter((item) => item.key !== key));
    const token = localStorage.getItem("token");
    axios
      .delete(`${backendUrl}/api/products/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setItemLoaded(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6">
        Item Management
      </h1>

      {!itemsLoaded && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {itemsLoaded && (
        <div className="w-full max-w-6xl">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-4">
            {items.map((product) => (
              <div
                key={product.key}
                className="border rounded-lg shadow p-4 bg-white space-y-1"
              >
                <div className="text-sm font-semibold text-gray-600">
                  {product.name} - Rs.{product.price}
                </div>
                <div className="text-sm text-gray-500">
                  Category: {product.category}
                </div>
                <div className="text-sm text-gray-500">
                  Dimensions: {product.dimensions}
                </div>
                <div className="text-sm text-gray-500">
                  {product.description}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    product.availability ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.availability ? "In Stock" : "Out of Stock"}
                </div>
                <div className="flex justify-end space-x-4 pt-2">
                  <button
                    onClick={() =>
                      navigate("/admin/item/edit", { state: product })
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border border-gray-200 shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-4">Key</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr
                    key={product.key}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4 text-center">{product.key}</td>
                    <td className="py-3 px-4 text-center">{product.name}</td>
                    <td className="py-3 px-4 text-center">
                      Rs.{product.price}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {product.dimensions}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {product.description}
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-semibold ${
                        product.availability ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.availability ? "In Stock" : "Out of Stock"}
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center space-x-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          navigate("/admin/item/edit", { state: product })
                        }
                      >
                        <FiEdit size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(product.key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <Link
        to="/admin/item/add"
        className="fixed bottom-6 right-6 text-orange-700 hover:text-orange-500"
      >
        <AiOutlinePlusCircle size={60} />
      </Link>
    </div>
  );
}
