import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AdminPackagePage() {
  const [packages, setPackages] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Using the navigate hook

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(`${backendUrl}/api/packages`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages", error);
      }
    };
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    // Show confirmation popup
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        await axios.delete(`${backendUrl}/api/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        // SweetAlert success popup
        Swal.fire("Deleted!", "The package has been deleted.", "success");

        // Optionally, reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        Swal.fire("Error", "There was an error deleting the package.", "error"); // SweetAlert error popup
      }
    } else {
      Swal.fire("Cancelled", "The package was not deleted.", "info"); // SweetAlert cancellation popup
    }
  };

  const handleEdit = (pkg) => {
    // Navigate to the edit page and pass the package data via state
    navigate("/admin/package/edit", { state: pkg });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Packages</h2>
      <Link
        to="/admin/package/add"
        className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Add New Package
      </Link>
      <div className="space-y-4">
        {packages.map((pkg) => (
          <div key={pkg._id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">{pkg.name}</h3>
            <p>{pkg.description}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(pkg)} // Use handleEdit to pass the package
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pkg._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
