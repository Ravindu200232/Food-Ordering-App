import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import "./login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      console.log(res);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
          accessToken: res.access_token,
        })
        .then((res) => {
          console.log(res);
          toast.success("Login successful");
          const user = res.data.user;
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: user._id,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address,
              phone: user.phone,
              image: user.image,
            })
          );
          if (user.role == "admin") {
            navigate("/admin/");
            return
          } 
          if(user.role == "restaurant"){
            navigate("/restaurantC/")
            return
          }
          else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  function handleOnSubmit(e) {
    e.preventDefault(); //default sumbit refres wena eka nawaththganna

   

    axios
      .post(`http://localhost:3000/api/v1/users/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.message == "User is blocked") {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        const user = res.data.user;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phone: user.phone,
            image: user.image,
            lat : user.lat,
            lng : user.lng
          })
        );

        if (user.emailVerified == false) {
          toast.error("Please verify your email first");
          navigate("/verify-email");
          return;
        }

        if (user.role == "admin") {
          navigate("/admin/");
          return
        } if(user.role == "restaurant"){
          navigate("/restaurantC/")
          return
        }
        else {
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="bg-picture w-full h-screen flex justify-center items-center">
        <div className="w-[400px] h-[480px] backdrop-blur-2xl rounded-2xl flex flex-col justify-center items-center relative shadow-2xl">
          <img
            src="/logo.png"
            className="w-[100px] h-[100px] object-cover absolute top-2 rounded-full border-4 border-white"
            alt="Logo"
          />
          <span className="text-white text-3xl mt-28 mb-6 font-semibold">
            Login
          </span>
          <input
            type="email"
            placeholder="Email"
            className="w-[300px] h-[40px] bg-transparent border-b-2 border-white text-xl text-white placeholder-white outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-[300px] h-[40px] bg-transparent border-b-2 border-white mt-6 text-xl text-white placeholder-white outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="submit"
            className="mt-6 w-[300px] h-[50px] bg-[#010750] text-xl text-white rounded-lg hover:bg-blue-900 transition"
          >
            Login
          </button>

          <div className="mt-4">
            <button
              type="button"
              className="w-[300px] h-[50px] bg-white text-[#010750] font-semibold rounded-lg flex items-center justify-center gap-3 shadow-md hover:bg-gray-100 transition"
              onClick={googleLogin}
            >
              <FcGoogle className="text-red-500 text-xl" />
              Login with Google
            </button>

            {/* //create sign up button to navigate to signup page */}
            <p className="text-white mt-4">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
