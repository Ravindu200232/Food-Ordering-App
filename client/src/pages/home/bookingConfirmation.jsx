import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state.sendData.result;
  console.log(booking);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Booking details not found.
      </div>
    );
  }

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        amount: booking.totalAmount,
        bookingId: booking.orderId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-primary text-primary p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-accent mb-6">Booking Confirmed</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl space-y-4">
        <p>
          <span className="font-bold">Order ID:</span> {booking.orderId}
        </p>
        <p>
          <span className="font-bold">Email:</span> {booking.email}
        </p>
        
        <p>
          <span className="font-bold">Total:</span> Rs.
          {booking.totalAmount.toFixed(2)}
        </p>

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Items Booked:</h2>
          <ul className="space-y-2">
            {booking.orderItem.map((item, index) => (
              <li key={index} className="border rounded p-3 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs.{item.product.price.toFixed(2)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleProceedToPayment}
          className="mt-6 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
        >
          Proceed to Payment
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 ml-40 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
