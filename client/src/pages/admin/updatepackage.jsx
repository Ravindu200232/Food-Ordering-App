import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdatePackagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?._id || "";

  const [packageData, setPackageData] = useState({
    name: "",
    description: "",
    basePrice: "",
    eventType: "Wedding",
    image: "",
    inclusions: [""], // start with one empty inclusion
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) {
        console.error("Package ID is missing");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPackageData({
          ...response.data,
          inclusions: response.data.inclusions.length
            ? response.data.inclusions
            : [""],
        });
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInclusionChange = (index, value) => {
    const newInclusions = [...packageData.inclusions];
    newInclusions[index] = value;
    setPackageData((prevData) => ({
      ...prevData,
      inclusions: newInclusions,
    }));
  };

  const addInclusion = () => {
    setPackageData((prevData) => ({
      ...prevData,
      inclusions: [...prevData.inclusions, ""],
    }));
  };

  const removeInclusion = (index) => {
    const newInclusions = packageData.inclusions.filter((_, i) => i !== index);
    setPackageData((prevData) => ({
      ...prevData,
      inclusions: newInclusions.length ? newInclusions : [""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/api/packages/${id}`,
        packageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated:", response.data);
      navigate("/admin/package");
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Update Package</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="name">Package Name</label>
          <input
            id="name"
            name="name"
            value={packageData.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={packageData.description}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="basePrice">Base Price</label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            value={packageData.basePrice}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            type="text"
            value={packageData.image}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            value={packageData.eventType}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          >
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate">Corporate</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-lg font-medium">Inclusions</label>
          {packageData.inclusions.map((inclusion, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={inclusion}
                onChange={(e) => handleInclusionChange(index, e.target.value)}
                className="flex-1 border p-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeInclusion(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInclusion}
            className="text-blue-500 hover:underline mt-1"
          >
            + Add Inclusion
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Update Package
        </button>
      </form>
    </div>
  );
}
