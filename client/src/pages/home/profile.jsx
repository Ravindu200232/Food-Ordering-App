import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import mediaUpload from "../../utils/mediaUpload";
import Footer from "../../components/footer";

export function Profile() {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    image: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        address: parsed.address,
        phone: parsed.phone,
        image: parsed.image,
      });
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/one`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch order history", err);
        Swal.fire("Error", "Could not fetch order history.", "error");
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/v1/users/update/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Success", "Profile updated successfully!", "success");
      localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      setUser({ ...user, ...formData });
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Your account will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.clear();
        Swal.fire("Deleted", "Your account has been deleted.", "success");
        window.location.href = "/";
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error", "Failed to delete account.", "error");
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/password/${user.id}`,
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Success", res.data.message, "success");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password change failed", err);
      const message =
        err.response?.data?.message || "Failed to change password.";
      Swal.fire("Error", message, "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedUrl = await mediaUpload(file);
      setFormData((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));
      Swal.fire("Uploaded!", "Image uploaded successfully.", "success");
    } catch (err) {
      console.error("Image upload failed", err);
      Swal.fire("Error", "Image upload failed.", "error");
    }
  };

  const toggleOrderHistory = () => {
    setIsOrderHistoryVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    Swal.fire("Logged Out", "You have been logged out.", "success");
    window.location.href = "/login";
  };

  // 📍 Get location & reverse geocode
  const getLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation is not supported by your browser.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const location = res.data?.display_name || "";
          setFormData((prev) => ({
            ...prev,
            address: location,
          }));
          Swal.fire("Success", "Location fetched successfully!", "success");
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          Swal.fire("Error", "Failed to fetch location details.", "error");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        Swal.fire("Error", "Failed to access your location.", "error");
      }
    );
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-gray-700 to-pink-700 rounded-xl shadow-xl mt-10">
      <div className="flex flex-col items-center mb-6">
        <div onClick={() => fileInputRef.current.click()} className="cursor-pointer mb-4">
          <img
            src={formData.image || "https://via.placeholder.com/150?text=Upload+Image"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg hover:opacity-90 transition-all duration-300"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <h2 className="text-3xl font-semibold text-white text-center mb-4">
          Your Profile
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="border p-3 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
          />
          <button
            onClick={getLocation}
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            Use Current Location
          </button>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleUpdate}
              className="bg-accent text-white px-6 py-3 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              Update Profile
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            >
              Delete Account
            </button>
          </div>

          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Change Password
            </h3>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-5"
              placeholder="Old Password"
            />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-5"
              placeholder="New Password"
            />
            <button
              onClick={handleChangePassword}
              className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 mt-4"
            >
              Change Password
            </button>
          </div>

          <div className="mt-10 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Order History
              </h3>
              <button
                onClick={toggleOrderHistory}
                className="text-sm text-blue-600 hover:underline"
              >
                {isOrderHistoryVisible ? "Collapse" : "Expand"}
              </button>
            </div>

            {isOrderHistoryVisible && (
              <>
                {ordersLoading ? (
                  <p>Loading order history...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  <ul className="space-y-6">
                    {orders.map((order, idx) => (
                      <li
                        key={order._id || idx}
                        className="border p-4 rounded-md shadow-sm bg-gray-50"
                      >
                        <p>
                          <strong>Order ID:</strong> {order.orderId}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Total:</strong> Rs.{order.totalAmount}
                        </p>
                        <p>
                          <strong>Description:</strong> {order.description}
                        </p>

                        <div className="mt-4">
                          <strong>Items:</strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            {order.orderItem?.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-4 border p-2 rounded-md bg-white shadow"
                              >
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="font-semibold">
                                    {item.product.name}
                                  </p>
                                  <p>
                                    Rs.{item.product.price} x {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Total: Rs.
                                    {item.product.price * item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
