import "./App.css";
import AdminPage from "./pages/admin/adminPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import Testing from "./components/testing";
import Login from "./pages/login/login";
import toast, { Toaster } from "react-hot-toast";
import Register from "./pages/register/register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";
import { Payment } from "./pages/home/payment";
import BookingConfirmation from "./pages/home/bookingConfirmation";
import RestaurantPage from "./pages/restaurantant/restaurantPage";


function App() {
  return (
    <GoogleOAuthProvider clientId="93119756985-3cvvkvdu7epn3h2k0i53pg5i17o9b3ji.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes path="/">
          <Route path="/*" element={<HomePage />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/login" element={<Login />} />
          <Route path="admin/*" element={<AdminPage />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="restaurantC/*" element={<RestaurantPage/>}/>
          <Route
            path="/bookingconfirmation"
            element={<BookingConfirmation />}
          />
         
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
