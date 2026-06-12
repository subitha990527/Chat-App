import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      window.location.href = "/home";

    } catch (error) {

      console.log(error);

      alert("Login Failed");
    }
  };

  const navigate = useNavigate();

  return (

    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(96,165,250,0.35) 0%, transparent 28%),
          radial-gradient(circle at top right, rgba(129,140,248,0.30) 0%, transparent 30%),
          radial-gradient(circle at bottom left, rgba(99,102,241,0.25) 0%, transparent 35%),
          linear-gradient(180deg, #eef2ff 0%, #c7d2fe 45%, #a5b4fc 100%)
        `,
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* Floating Shapes */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          background: "rgba(99,102,241,0.18)",
          borderRadius: "50%",
          top: "-80px",
          left: "-100px",
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          background: "rgba(59,130,246,0.15)",
          borderRadius: "50%",
          bottom: "-60px",
          right: "-60px",
          filter: "blur(35px)",
        }}
      />

      {/* Back Button */}
      <div
        onClick={() => window.history.back()}
        style={{
          position: "absolute",
          top: "25px",
          left: "25px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 18px",
          borderRadius: "30px",
          background: "rgba(15,23,42,0.22)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          zIndex: 20,
          boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        }}
      >

        <span
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "0",
          }}
        >
          ←
        </span>

        <span
          style={{
            color: "white",
            fontSize: "15px",
            fontWeight: "500",
            letterSpacing: "0.3px",
          }}
        >
          Back
        </span>

      </div>

      {/* Login Card */}
      <div
        className="p-4"
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: "35px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          zIndex: 10,
        }}
      >

        {/* Top Icon */}
        <div className="text-center mb-4">

          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto",
              borderRadius: "30px",
              background:
                "linear-gradient(135deg,#4f46e5,#60a5fa)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(79,70,229,0.3)",
            }}
          >

            <span
              style={{
                fontSize: "55px",
              }}
            >
              🤖
            </span>

          </div>

        </div>

        {/* Heading */}
        <h2
          className="text-center fw-bold mb-2"
          style={{
            color: "#2563eb",
          }}
        >
          Welcome Back
        </h2>

        <p
          className="text-center mb-4"
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Login and continue your conversations
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="form-control mb-3"
            onChange={handleChange}
            style={{
              height: "50px",
              borderRadius: "14px",
              border: "1px solid #dbeafe",
              background: "#f8fafc",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="form-control mb-4"
            onChange={handleChange}
            style={{
              height: "50px",
              borderRadius: "14px",
              border: "1px solid #dbeafe",
              background: "#f8fafc",
            }}
          />

          {/* <div
            style={{
              textAlign: "center",
              marginTop: "-10px",
              marginBottom: "15px",
            }}
          >
            <span
              onClick={() => navigate("/forgot-password")}
              style={{
                color: "#6366f1",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Forgot password?
            </span>
          </div> */}

          <button
            className="btn w-100"
            style={{
              height: "52px",
              borderRadius: "14px",
              background:
                "linear-gradient(to right,#4f46e5,#3b82f6)",
              border: "none",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 10px 25px rgba(79,70,229,0.3)",
            }}
          >
            Login
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "18px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#2563eb",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign Up
            </span>
          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;