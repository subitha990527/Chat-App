import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import Cropper from "react-easy-crop";


const socket = io("http://localhost:5000");

function Home() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // Upload Profile Image
  const handleProfileUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onloadend = () => {

        setImageSrc(reader.result);

        setShowCrop(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const [imageSrc, setImageSrc] = useState(null);

  const [showCrop, setShowCrop] = useState(false);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  // Fetch Users
  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      // users
      const userRes = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = userRes.data;

      // fetch latest message for each user
      const updatedUsers = await Promise.all(

        usersData.map(async (user) => {

          try {

            const msgRes = await axios.get(
              `http://localhost:5000/api/messages/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const userMessages = msgRes.data;

            const lastMessage =
              userMessages[userMessages.length - 1];

            return {
              ...user,
              lastMessage:
                lastMessage?.message || "Start chatting...",
            };

          } catch {

            return {
              ...user,
              lastMessage: "Start chatting...",
            };
          }
        })
      );

      setUsers(updatedUsers);

      } catch (error) {

        console.log(error);
      }
  };

  // Fetch Messages
  const fetchMessages = async (userId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // Send Message
  const sendMessage = async () => {

    if (!text) return;

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/messages",
        {
          receiver: selectedUser._id,
          message: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...messages, res.data]);

      socket.emit("sendMessage", res.data);

      setText("");

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  useEffect(() => {

    socket.on("receiveMessage", (newMessage) => {

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);
    });

  }, []);


  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {

   return new Promise((resolve) => {
    const image = new Image();

    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
   });
  };

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const saveCroppedImage = async () => {

    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels
    );

    setProfileImage(croppedImage);

    localStorage.setItem(
      "profileImage",
      croppedImage
    );

    const token = localStorage.getItem("token");

    await axios.put(
      "http://localhost:5000/api/users/profile-image",
      {
        profilePic: croppedImage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchUsers();

    setShowCrop(false);
  };

  return (

    <div
      className="container-fluid"
      style={{
        background:
          "linear-gradient(180deg,#dbe4ff,#c7d2fe)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      <div
        className="row mx-auto"
        style={{
          maxWidth: "1400px",
          height: "95vh",
          borderRadius: "35px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          background: "#fff",
        }}
      >

        {/* Sidebar */}
        <div
          className="col-md-4 p-0"
          style={{
            background:
              "linear-gradient(180deg,#8b7cf6,#7c6df5)",
            color: "white",
          }}
        >

          {/* Header */}
          <div className="p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div className="d-flex align-items-center gap-3">

                {/* Hidden Upload */}
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileUpload}
                />

                {/* Profile Image */}
           
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg,#4f46e5,#60a5fa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  {
                    profileImage && profileImage !== "" ? (
                      <img
                        src={profileImage}
                        alt="profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // CROPS PERFECTLY
                        }}
                      />

                    ) : (

                      <FaUserCircle
                        size={44}
                        color="white"
                      />

                    )
                  }

                {/* </label> */}
                </div>

                {/* Name */}
                <div>

                  <h5
                    className="mb-0"
                    style={{
                      fontWeight: "700",
                    }}
                  >
                    {currentUser?.name}
                  </h5>

                  <small
                    style={{
                      opacity: "0.85",
                    }}
                  >
                    My Profile
                  </small>

                </div>

              </div>

            <div className="d-flex align-items-center gap-2">

              {/* Profile Icon Button */}
           

              <label
                htmlFor="profileUpload"
                style={{
                  border: "none",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
              >
                <FaUserCircle size={30} color="white" />
              </label>

              {/* Logout */}
              <button
                onClick={logout}
                style={{
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "600",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                }}
              >
                Logout
              </button>

            </div>

            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search conversation"
              className="form-control"
              style={{
                borderRadius: "15px",
                border: "none",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                padding: "14px",
              }}
            />

          </div>

          {/* Users */}
          <div
            style={{
              padding: "15px",
              overflowY: "auto",
              height: "calc(100vh - 220px)",
            }}
          >

            {
              users.map((user) => (

                <div
                  key={user._id}
                  onClick={() => {

                    setSelectedUser(user);

                    fetchMessages(user._id);
                  }}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    padding: "15px",
                    marginBottom: "15px",
                    cursor: "pointer",
                    boxShadow:
                      "0 5px 15px rgba(0,0,0,0.08)",
                  }}
                >

                  <div className="d-flex align-items-center gap-3">

                    {/* Avatar */}

                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        background:
                          "linear-gradient(135deg,#4f46e5,#60a5fa)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >

                      {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (

                        <span
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          {user.name.charAt(0)}
                        </span>

                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex-grow-1">

                      {/* Top Row */}
                      <div className="d-flex justify-content-between align-items-center">

                        <div
                          style={{
                            fontWeight: "700",
                            color: "#1e293b",
                            fontSize: "15px",
                          }}
                        >
                          {user.name}
                        </div>

                        {/* Time */}
                        <small
                          style={{
                            color: "#94a3b8",
                            fontSize: "11px",
                          }}
                        >
                          {
                            user.lastMessageTime
                              ? user.lastMessageTime
                              : ""
                          }
                        </small>

                      </div>

                      {/* Recent Message */}
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginTop: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "220px",
                        }}
                      >
                        {
                          user.lastMessage ||
                          messages[messages.length - 1]?.message ||
                          "Start chatting..."
                        }
                      </div>

                    </div>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

        {/* Chat Section */}
        <div
            className="col-md-8 p-0 d-flex flex-column"
            style={{
              background: "#f8fafc",
              height: "95vh",
            }}
          >

          {
            selectedUser ? (

              <>

                {/* Chat Header */}
                <div
                  className="d-flex align-items-center justify-content-between p-4"
                  style={{
                    background: "white",
                    borderBottom:
                      "1px solid rgba(0,0,0,0.05)",
                  }}
                >

                  <div className="d-flex align-items-center gap-3">

                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg,#4f46e5,#60a5fa)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {selectedUser.name.charAt(0)}
                    </div>

                    <div>

                      <h5
                        className="mb-0"
                        style={{
                          fontWeight: "700",
                        }}
                      >
                        {selectedUser.name}
                      </h5>

                      <small
                        style={{
                          color: "#22c55e",
                        }}
                      >
                        Online
                      </small>

                    </div>

                  </div>

                </div>

                {/* Messages */}
               <div
                className="flex-grow-1 p-4"
                style={{
                  overflowY: "auto",
                  height: "0",
                  minHeight: "0",
                }}
              >

                  {
                    messages.map((msg) => (

                      <div
                        key={msg._id}
                        className={`d-flex mb-3 ${
                          msg.sender === currentUser._id
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >

                        <div
                          style={{
                            maxWidth: "320px",
                            padding: "14px 18px",
                            borderRadius: "18px",
                            background:
                              msg.sender === currentUser._id
                                ? "linear-gradient(135deg,#8b7cf6,#6d5dfc)"
                                : "#ffffff",
                            color:
                              msg.sender === currentUser._id
                                ? "white"
                                : "#1e293b",
                            boxShadow:
                              "0 5px 15px rgba(0,0,0,0.06)",
                            fontSize: "15px",
                          }}
                        >

                          {msg.message}

                        </div>

                      </div>
                    ))
                  }

                </div>

                {/* Input */}
             <div
                className="p-3"
                style={{
                  background: "white",
                  borderTop:
                    "1px solid rgba(0,0,0,0.05)",
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                }}
              >

                  <div className="d-flex gap-3">

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type message..."
                      value={text}
                      onChange={(e) =>
                        setText(e.target.value)
                      }
                      style={{
                        height: "55px",
                        borderRadius: "18px",
                        border: "1px solid #dbeafe",
                        background: "#f8fafc",
                      }}
                    />

                    <button
                      onClick={sendMessage}
                      style={{
                        width: "60px",
                        border: "none",
                        borderRadius: "18px",
                        background:
                          "linear-gradient(135deg,#8b7cf6,#6d5dfc)",
                        color: "white",
                        fontSize: "22px",
                        boxShadow:
                          "0 10px 25px rgba(109,93,252,0.3)",
                      }}
                    >
                      ➤
                    </button>

                  </div>

                </div>

              </>

            ) : (

              <div
                className="d-flex flex-column justify-content-center align-items-center h-100"
              >

                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "35px",
                    background:
                      "linear-gradient(135deg,#8b7cf6,#6d5dfc)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "55px",
                    color: "white",
                    marginBottom: "20px",
                  }}
                >
                  💬
                </div>

                <h3
                  style={{
                    fontWeight: "700",
                    color: "#475569",
                  }}
                >
                  Select a user to start chatting
                </h3>

              </div>
            )
          }

        </div>

      </div>

      {
        showCrop && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <div
              style={{
                width: "350px",
                height: "450px",
                background: "white",
                borderRadius: "25px",
                padding: "20px",
                position: "relative",
              }}
            >

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "300px",
                }}
              >


                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(croppedArea, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                />

              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) =>
                  setZoom(e.target.value)
                }
                className="w-100 mt-4"
              />

              <button
                onClick={saveCroppedImage}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  border: "none",
                  padding: "14px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#8b7cf6,#6d5dfc)",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Save Profile
              </button>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Home;