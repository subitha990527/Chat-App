import heroBg from "../assets/UI001.png";
import secondBg from "../assets/UI002.png";
import thirdBg from "../assets/UI003.png";
import heroVideo from "../assets/video2.mp4";


function Landing() {
  return (
    <div
      style={{
        background: `
          radial-gradient(circle at top left, rgba(96,165,250,0.35) 0%, transparent 28%),
          radial-gradient(circle at top right, rgba(129,140,248,0.30) 0%, transparent 30%),
          radial-gradient(circle at bottom left, rgba(99,102,241,0.25) 0%, transparent 35%),
          linear-gradient(180deg, #eef2ff 0%, #c7d2fe 45%, #a5b4fc 100%)
        `,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Blobs */}
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

      {/* NAVBAR */}
      <nav className="container py-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3
            className="fw-bold m-0"
            style={{
              background:
                "linear-gradient(to right,#7c3aed,#06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NexChat
          </h3>

          <div className="d-flex gap-3">
            <a
              href="/login"
              style={{
                padding: "10px 22px",
                borderRadius: "40px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "600",
                background:
                  "linear-gradient(to right,#0f172a,#334155)",
              }}
            >
              Login
            </a>

            <a
              href="/register"
              style={{
                padding: "10px 22px",
                borderRadius: "40px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "600",
                background:
                  "linear-gradient(to right,#7c3aed,#06b6d4)",
              }}
            >
              Register
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="container"
        style={{
          minHeight: "75vh",
        }}
      >
        <div className="row align-items-center h-100">

          {/* LEFT */}
          <div className="col-lg-5">

            <span
              className="px-3 py-2 rounded-pill"
              style={{
                background: "rgba(124,58,237,.15)",
                color: "#6d28d9",
                fontWeight: "600",
              }}
            >
              ✨ Real-Time Messaging
            </span>

            <h1
              className="fw-bold mt-4"
              style={{
                fontSize: "3.1rem",
                lineHeight: "1.1",
                color: "#0f172a",
                display: "block",
                marginTop: "20px",  }}
            >
            Connect,
            <br />
            Communicate,
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "2.8rem",
                lineHeight: "1.1",
                display: "block",
                marginTop: "20px",  
                }}
            >
              Stay Close Anywhere
            </span>
            </h1>

            <p
              className="mt-4"
              style={{
                color: "#475569",
                fontSize: "1.1rem",
              }}
            >
              Chat, connect, and share moments with people who matter most in a secure and engaging space.
            </p>

            <div className="d-flex gap-3 mt-4">
              <a
                href="/register"
                className="btn btn-lg text-white"
                style={{
                  borderRadius: "50px",
                  padding: "8px 25px",
                    
                  background:
                    "linear-gradient(to right,#7c3aed,#06b6d4)",
                }}
              >
                Get Started
              </a>

            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-7 text-center">
            <div
              style={{
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,.15)",
              }}
            >
              {/* <img
                src={firstBg}
                alt="hero"
                className="img-fluid"
              /> */}

              <div
                style={{
                  borderRadius: "30px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0,0,0,.15)",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "cover",
                  }}
                >
                  <source src={heroVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APP PREVIEW */}
      <section className="container py-3">

        <div className="text-center mb-5">
          <h2 className="fw-bold">Conversations Made Simple</h2>

          <p
            style={{
              color: "#475569",
            }}
          >
            
            Browse the screens that power a smooth and
            interactive chatting experience.
          </p>
        </div>

        <div className="row g-4">

          {/* CARD 1 */}
          <div className="col-md-4 px-5">
            <div
              style={{
                height: "600px",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,.15)",
              }}
            >
              <img
                src={thirdBg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-md-4 px-5">
            <div
              style={{
                height: "600px",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,.15)",
              }}
            >
              <img
                src={secondBg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-md-4 px-5">
            <div
              style={{
                height: "600px",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,.15)",
              }}
            >
              <img
                src={heroBg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Landing;