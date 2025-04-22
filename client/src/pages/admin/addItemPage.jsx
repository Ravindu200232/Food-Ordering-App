import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddItemPage() {
  const [productKey, setProductKey] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productCategory, setProductCategory] = useState("audio");
  const [productDimension, setProductDimension] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();

  async function handleAddItem() {
    const promises = [];

    for (let i = 0; i < productImages.length; i++) {
      const promise = mediaUpload(productImages[i]);
      promises.push(promise);
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const imageUrls = await Promise.all(promises);
        const result = await axios.post(
          `${backendUrl}/api/products`,
          {
            key: productKey,
            name: productName,
            price: productPrice,
            category: productCategory,
            dimensions: productDimension,
            description: productDescription,
            Image: imageUrls,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        toast.success(result.data.message);
        navigate("/admin/item");
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to add item");
      }
    } else {
      toast.error("Please login first");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2 sm:px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Add New Item</h1>
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6 flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Product Key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productKey}
          onChange={(e) => setProductKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        >
          <option value="audio">Audio</option>
          <option value="lights">Light</option>
        </select>
        <input
          type="text"
          placeholder="Product Dimensions"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productDimension}
          onChange={(e) => setProductDimension(e.target.value)}
        />
        <textarea
          placeholder="Product Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />

        <label className="w-full cursor-pointer text-sm text-gray-600">
          <span className="block mb-1">Upload Images</span>
          <input
            type="file"
            multiple
            onChange={(e) => setProductImages(e.target.files)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </label>

        {productImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {Array.from(productImages).map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        <div className="flex justify-between space-x-2">
          <button
            className="w-1/2 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleAddItem}
          >
            Add
          </button>
          <button
            className="w-1/2 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => navigate("/admin/item")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
