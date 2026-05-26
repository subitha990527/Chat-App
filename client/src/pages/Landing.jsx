import heroBg from "../assets/UI001.png";
import secondBg from "../assets/UI002.png";
import thirdBg from "../assets/UI003.png";



function Landing() {

  return (

<div
  className="vh-100"
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

  {/* Soft Floating Shapes */}
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

  <div
    style={{
      position: "absolute",
      width: "180px",
      height: "180px",
      background: "rgba(168,85,247,0.12)",
      borderRadius: "50%",
      top: "35%",
      right: "10%",
      filter: "blur(30px)",
    }}
  />



      {/* Navbar */}
        <div className="d-flex justify-content-end p-4 gap-3">

        {/* Login */}
        <a
            href="/login"
            style={{
            padding: "10px 22px",
            borderRadius: "40px",
            textDecoration: "none",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
            background:
                "linear-gradient(to right,#0f172a,#334155)",
            boxShadow: "0 8px 18px rgba(15,23,42,0.25)",
            transition: "0.3s",
            }}
        >
            Login
        </a>


        {/* Register */}
        <a
            href="/register"
            style={{
            padding: "10px 24px",
            borderRadius: "40px",
            textDecoration: "none",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
            background:
                "linear-gradient(to right,#7c3aed,#06b6d4)",
            boxShadow: "0 8px 20px rgba(124,58,237,0.35)",
            transition: "0.3s",
            }}
        >
            Register
        </a>

        </div>


      {/* Main Section */}
      <div className="container-fluid">

        <div className="row justify-content-center align-items-center">


          {/* Card 1 */}
          <div className="col-md-3 d-flex justify-content-center">

            <div
              style={{
                width: "280px",
                height: "620px",
                borderRadius: "40px",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              }}
            >

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "rgba(0,0,0,0.35)",
                }}
              ></div>


              <div
                className="position-relative text-white h-100 d-flex flex-column justify-content-center align-items-center text-center px-4"
              >

              </div>

            </div>

          </div>


          {/* Card 2 */}
          <div className="col-md-3 d-flex justify-content-center">

            <div
                style={{
                width: "280px",
                height: "620px",
                borderRadius: "40px",
                overflow: "hidden",
                position: "relative",
                background: "#000",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                }}
            >

                {/* Image */}
                <img
                src={secondBg}
                alt="chat-phone"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                />

                {/* Overlay */}
                <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                    "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                }}
                >

                </div>

            </div>

            </div>


          {/* Card 3 */}
          <div className="col-md-3 d-flex justify-content-center">

            <div
                style={{
                width: "280px",
                height: "620px",
                borderRadius: "40px",
                overflow: "hidden",
                position: "relative",
                background: "#000",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                }}
            >

                {/* Image */}
                <img
                src={thirdBg}
                alt="chat-phone"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                />

                {/* Overlay */}
                <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                    "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                }}
                ></div>


            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Landing;