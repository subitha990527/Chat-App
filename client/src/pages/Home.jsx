import { useEffect, useState, useRef } from "react";
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
  const [search, setSearch] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("chats");

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
              lastMessageTime:
                lastMessage?.createdAt || null,
            };

          } catch {

            return {
              ...user,
              lastMessage: "Start chatting...",
              lastMessageTime: null,
            };
          }
        })
      );

      setUsers(updatedUsers);

      } catch (error) {

        console.log(error);
      }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

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

      setTimeout(() => {
        scrollToBottom();
      }, 100);

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

      setUsers((prevUsers) => {
          const updated = prevUsers.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  lastMessage: text,
                  lastMessageTime: res.data.createdAt,
                }
              : user
          );

          return updated.sort(
            (a, b) =>
              new Date(b.lastMessageTime || 0) -
              new Date(a.lastMessageTime || 0)
          );
        });

      socket.emit("sendMessage", res.data);

      setText("");

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {

    const handleReceiveMessage = (newMessage) => {

      console.log("RECEIVED ONCE", newMessage);

      const senderId = newMessage.sender;

      if (
        !selectedUser ||
        selectedUser._id !== senderId
      ) {
        setUnreadCounts(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
      }

      if (
        selectedUser &&
        selectedUser._id === senderId
      ) {
        setMessages(prev => [...prev, newMessage]);
      }

      setUsers(prevUsers => {
        const updated = prevUsers.map(user =>
          user._id === senderId
            ? {
                ...user,
                lastMessage: newMessage.message,
                lastMessageTime: newMessage.createdAt,
              }
            : user
        );

        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageTime || 0) -
            new Date(a.lastMessageTime || 0)
        );
      });
    };

    socket.off("receiveMessage"); // remove old listeners
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };

  }, [selectedUser]);


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

    setProfileImage(croppedImage);

    if (selectedUser) {
      setSelectedUser((prev) => ({
        ...prev,
        profilePic: croppedImage,
      }));
    }

    localStorage.setItem(
      "profileImage",
      croppedImage
    );

    await fetchUsers();

    setShowCrop(false);
  };

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      return (
        new Date(b.lastMessageTime || 0) -
        new Date(a.lastMessageTime || 0)
      );
  });

  const formatChatTime = (date) => {

    if (!date) return "";

    const msgDate = new Date(date);
    const today = new Date();

    const isToday =
      msgDate.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
      msgDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return "Yesterday";
    }

    return msgDate.toLocaleDateString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("userOnline", currentUser._id);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const formatLastSeen = (date) => {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  const chatUsers = filteredUsers.filter(
    (user) => user.lastMessageTime
  );

  const contactUsers = filteredUsers;

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
          className="col-md-4 p-0 d-flex flex-column"
          style={{
            background:
              "linear-gradient(180deg,#8b7cf6,#7c6df5)",
            color: "white",
            height: "95vh",
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "15px",
                border: "none",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                padding: "14px",
              }}
            />

            <div
              className="px-6 mt-3"
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  padding: "4px",
                  gap: "4px",
                  marginBottom:"-10px",
                }}
              >
                <button
                  onClick={() => setActiveTab("chats")}
                  style={{
                    flex: 1,
                    height: "42px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      activeTab === "chats"
                        ? "#926eec"
                        : "transparent",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Chats
                </button>

                <button
                  onClick={() => setActiveTab("contacts")}
                  style={{
                    flex: 1,
                    height: "42px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      activeTab === "contacts"
                        ? "#926eec"
                        : "transparent",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Contacts
                </button>
              </div>
            </div>

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
              (activeTab === "chats"
                ? chatUsers
                : contactUsers
              ).map((user) => (

                <div
                  key={user._id}
                    onClick={() => {

                    setSelectedUser(user);

                    fetchMessages(user._id);

                    setUnreadCounts((prev) => ({
                      ...prev,
                      [user._id]: 0,
                    }));
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

                    <div
                      style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "linear-gradient(135deg,#4f46e5,#60a5fa)",
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

                      {onlineUsers.includes(user._id) && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 2,
                            right: 2,
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            border: "2px solid white",
                          }}
                        />
                      )}
                    </div>

                  {/* User Details */}
                    <div className="flex-grow-1">

                      {/* Top Row: Name + Time */}
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

                        <small
                          style={{
                            color: "#94a3b8",
                            fontSize: "11px",
                          }}
                        >
                          {formatChatTime(user.lastMessageTime)}
                        </small>
                      </div>

                      {/* Bottom Row: Message + Badge */}
                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ marginTop: "4px" }}
                      >
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "220px",
                          }}
                        >
                          {user.lastMessage ||
                            messages[messages.length - 1]?.message ||
                            "Start chatting..."}
                        </div>

                        {unreadCounts[user._id] > 0 && (
                          <div
                            style={{
                              minWidth: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: "#22c55e",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginLeft: "10px",
                            }}
                          >
                            {unreadCounts[user._id]}
                          </div>
                        )}
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
                      {selectedUser?.name?.charAt(0)}
                    </div>

                    <div>

                      <h5
                        className="mb-0"
                        style={{
                          fontWeight: "700",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                            }}
                          >
                            {selectedUser.name}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              marginTop:"6px",
                              // color: "#64748b",
                              color: onlineUsers.includes(selectedUser._id)
                                                  ? "#22c55e"
                                                  : "#94a3b8",
                            }}
                          >
                            {onlineUsers.includes(selectedUser._id)
                              ? "Online"
                              : `Last seen ${formatLastSeen(
                                  selectedUser.lastSeen
                                )}`}
                          </div>
                        </div>
                      </h5>

                    {/* <small
                      style={{
                        color: onlineUsers.includes(selectedUser._id)
                          ? "#22c55e"
                          : "#94a3b8",
                      }}
                    >
                      {onlineUsers.includes(selectedUser._id)
                        ? "Online"
                        : "Offline"}
                    </small> */}

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

                  <div ref={messagesEndRef} />

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