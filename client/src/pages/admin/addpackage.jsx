import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AddPackagePage() {
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState({
    name: "",
    image: "",
    description: "",
    inclusions: [
      "Catering services",
      "Venue decoration",
      "Photography",
      "Live music",
    ],
    basePrice: "",
    eventType: "Wedding",
  });

  const [packageImage, setPackageImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "inclusions") {
      setPackageData((prevData) => ({
        ...prevData,
        inclusions: value.split(",").map((inclusion) => inclusion.trim()),
      }));
    } else {
      setPackageData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setPackageImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const imageUrl = await mediaUpload(packageImage);

      const response = await axios.post(
        `${backendUrl}/api/packages/create`,
        {
          ...packageData,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      toast.success("Package added successfully!");
      navigate("/admin/package");
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Package</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg">
            Package Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={packageData.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg">
            Package Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={packageData.description}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="inclusions" className="text-lg">
            Inclusions (comma separated)
          </label>
          <textarea
            id="inclusions"
            name="inclusions"
            value={packageData.inclusions.join(", ")}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label htmlFor="basePrice" className="text-lg">
            Base Price
          </label>
          <input
            type="number"
            id="basePrice"
            name="basePrice"
            value={packageData.basePrice}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="eventType" className="text-lg">
            Event Type
          </label>
          <select
            id="eventType"
            name="eventType"
            value={packageData.eventType}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          >
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate">Corporate</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg"
          >
            Add Package
          </button>
        </div>
      </form>
    </div>
  );
}
