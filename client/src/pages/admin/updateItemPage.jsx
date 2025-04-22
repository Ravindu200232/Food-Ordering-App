import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function UpdateItemPage() {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);

  const [productKey, setProductKey] = useState(location.state.key);
  const [productName, setProductName] = useState(location.state.name);
  const [productPrice, setProductPrice] = useState(location.state.price);
  const [productCategory, setProductCategory] = useState(
    location.state.category
  );
  const [productDimension, setProductDimension] = useState(
    location.state.dimensions
  );
  const [productDescription, setProductDescription] = useState(
    location.state.description
  );
  const [productImages, setProductImages] = useState([]);

  async function handleUpdateItem() {
    const promises = [];

    let updatingImages = location.state.Image;

    if (productImages.length > 0) {
      for (let i = 0; i < productImages.length; i++) {
        console.log(productImages[i]);
        const promise = mediaUpload(productImages[i]);
        promises.push(promise);
        // if(i == 5){
        //   toast.error("You can only uploaded 25 images at a time")
        //   break;
        // }
      }

      updatingImages = await Promise.all(promises);
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const result = await axios.put(
          `${backendUrl}/api/products/${productKey}`,
          {
            key: productKey,
            name: productName,
            price: productPrice,
            category: productCategory,
            dimensions: productDimension,
            description: productDescription,
            Image : updatingImages
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
        toast.error(err.response.data.error);
      }
    } else {
      toast.error("Please login first");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6"> Update Item</h1>
      <div className="w-[400px] bg-white shadow-xl rounded-lg p-6 flex flex-col space-y-4">
        <input
          type="text"
          disabled
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
        <input
          type="file"
          multiple
          onChange={(e) => {
            setProductImages(e.target.files);
          }}
          className="w-full p-2 border rounded"
        ></input>
        <div className="flex justify-between space-x-2">
          <button
            className="w-1/2 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleUpdateItem}
          >
            Update
          </button>
          <button
            className="w-1/2 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => {
              navigate("/admin/item");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
