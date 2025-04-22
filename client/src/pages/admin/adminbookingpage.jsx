import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminBookingPage() {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingData(response.data.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const handleApproveOrder = async (orderId, isApproved) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingData((prevData) =>
        prevData.map((order) =>
          order.orderId === orderId
            ? { ...order, isApprove: !isApproved }
            : order
        )
      );
    } catch (error) {
      console.log("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookingData((prevData) =>
          prevData.filter((order) => order.orderId !== orderId)
        );

        Swal.fire("Deleted!", "Order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error!", "Failed to delete order.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleDescription = (orderId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="w-full h-full p-6 flex flex-col items-center bg-secondary text-black">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        Order Management
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Mobile Layout */}
          <div className="sm:hidden w-full space-y-4">
            {bookingData.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-lg rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <div className="font-semibold">{order.orderId}</div>
                  <div
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      order.isApprove
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {order.isApprove ? "Approved" : "Pending"}
                  </div>
                </div>
                <div>Email: {order.email}</div>
                <div>
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </div>
                <div>Total Amount: Rs.{order.totalAmount}</div>
                <div>Description: {order.description || "N/A"}</div>

                <div className="flex justify-between mt-4">
                  <button
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      order.isApprove ? "bg-gray-500" : "bg-blue-500"
                    } text-white`}
                    onClick={() =>
                      handleApproveOrder(order.orderId, order.isApprove)
                    }
                  >
                    {order.isApprove ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    className="text-blue-600 underline hover:text-blue-800"
                    onClick={() => toggleRow(order.orderId)}
                  >
                    {expandedRows[order.orderId] ? "Hide Items" : "View Items"}
                  </button>
                  <button
                    className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white"
                    onClick={() => handleDeleteOrder(order.orderId)}
                  >
                    Delete
                  </button>
                </div>

                {expandedRows[order.orderId] && (
                  <div className="mt-4">
                    {order.orderItem.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-lg p-3 mb-4"
                      >
                        <div className="text-center">{item.product.name}</div>
                        <img
                          src={item.product.image || "/default-product.jpg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover mx-auto rounded"
                        />
                        <div>Quantity: {item.quantity}</div>
                        <div>Price: ${item.product.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop/Table Layout */}
          <div className="hidden sm:block w-full bg-white shadow-lg rounded-lg overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full border-collapse">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-center">Order ID</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Order Date</th>
                    <th className="py-3 px-4 text-left">Total Amount</th>
                    <th className="py-3 px-4 text-center">Description</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Approve</th>
                    <th className="py-3 px-4 text-center">Details</th>
                    <th className="py-3 px-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookingData.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-100">
                        <td className="py-3 px-4 text-center">
                          {order.orderId}
                        </td>
                        <td className="py-3 px-4">{order.email}</td>
                        <td className="py-3 px-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">Rs.{order.totalAmount}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className="text-blue-600 underline hover:text-blue-800"
                            onClick={() => toggleDescription(order.orderId)}
                          >
                            {expandedDescriptions[order.orderId]
                              ? "Hide"
                              : "Show"}{" "}
                            Description
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              order.isApprove
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            {order.isApprove ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              order.isApprove ? "bg-gray-500" : "bg-blue-500"
                            } text-white`}
                            onClick={() =>
                              handleApproveOrder(order.orderId, order.isApprove)
                            }
                          >
                            {order.isApprove ? "Unapprove" : "Approve"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className="text-blue-600 underline hover:text-blue-800"
                            onClick={() => toggleRow(order.orderId)}
                          >
                            {expandedRows[order.orderId]
                              ? "Hide Items"
                              : "View Items"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white"
                            onClick={() => handleDeleteOrder(order.orderId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {expandedDescriptions[order.orderId] && (
                        <tr>
                          <td
                            colSpan="9"
                            className="bg-gray-100 p-4 text-gray-700 italic"
                          >
                            <strong>Description:</strong>{" "}
                            {order.description || "N/A"}
                          </td>
                        </tr>
                      )}

                      {expandedRows[order.orderId] && (
                        <tr>
                          <td colSpan="9" className="bg-gray-50 p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {order.orderItem.map((item) => (
                                <div
                                  key={item._id}
                                  className="border rounded-lg p-3 flex flex-col items-center text-center"
                                >
                                  <img
                                    src={
                                      item.product.image ||
                                      "/default-product.jpg"
                                    }
                                    alt={item.product.name || "Product"}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                  <div className="mt-2 font-semibold">
                                    {item.product.name}
                                  </div>
                                  <div>Quantity: {item.quantity}</div>
                                  <div>Price: Rs.{item.product.price}</div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
