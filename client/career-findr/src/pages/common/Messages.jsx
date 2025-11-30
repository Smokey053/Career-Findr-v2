import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  Chip,
  Paper,
  InputAdornment,
  Fade,
  Zoom,
  Grow,
  Slide,
} from "@mui/material";
import {
  Send,
  Search,
  AttachFile,
  MoreVert,
  Forum,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function Messages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch chats in real-time
  useEffect(() => {
    if (!user?.uid) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatsData = [];
        snapshot.forEach((doc) => {
          chatsData.push({ id: doc.id, ...doc.data() });
        });
        setChats(chatsData);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        // If index error, try without ordering
        if (error.code === "failed-precondition") {
          const fallbackQuery = query(
            chatsRef,
            where("participants", "array-contains", user.uid)
          );
          onSnapshot(fallbackQuery, (snapshot) => {
            const chatsData = [];
            snapshot.forEach((doc) => {
              chatsData.push({ id: doc.id, ...doc.data() });
            });
            // Sort client-side
            chatsData.sort((a, b) => {
              const aTime = a.lastMessageTime?.toMillis?.() || 0;
              const bTime = b.lastMessageTime?.toMillis?.() || 0;
              return bTime - aTime;
            });
            setChats(chatsData);
          });
        }
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat?.id) return;

    const messagesRef = collection(db, "chats", selectedChat.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat?.id) return;

    try {
      const messagesRef = collection(db, "chats", selectedChat.id, "messages");
      await addDoc(messagesRef, {
        text: messageText,
        senderId: user.uid,
        senderName: user.email,
        timestamp: Timestamp.now(),
        read: false,
      });

      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (chat) => {
    if (!chat?.participants || !Array.isArray(chat.participants)) {
      return { name: "Unknown User", avatar: "" };
    }
    const otherId = chat.participants.find((p) => p !== user?.uid);
    return (
      chat.participantsData?.[otherId] || { name: "Unknown User", avatar: "" }
    );
  };

  const filteredChats = chats.filter((chat) => {
    const other = getOtherParticipant(chat);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Fade in timeout={600}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="xl" sx={{ py: 4, height: "calc(100vh - 100px)" }}>
          {/* Animated Header */}
          <Zoom in timeout={500}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                borderRadius: 4,
                p: 4,
                mb: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: "30%",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Forum sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      Messages
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Connect with employers, institutes, and students
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Zoom>

          <Box display="flex" gap={2} height="calc(100% - 180px)">
            {/* Chat List */}
            <Slide direction="right" in timeout={600}>
              <Card
                sx={{
                  width: 350,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                  }}
                >
                  <Box
                    p={2}
                    sx={{
                      background:
                        "linear-gradient(180deg, rgba(37,99,235,0.05) 0%, transparent 100%)",
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "white",
                        },
                      }}
                    />
                  </Box>
                  <Divider />
                  <List sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
                    {filteredChats.length === 0 ? (
                      <Fade in timeout={500}>
                        <Box py={6} textAlign="center">
                          <ChatBubbleOutline
                            sx={{ fontSize: 64, color: "grey.300", mb: 2 }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            No conversations yet
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Start connecting with others
                          </Typography>
                        </Box>
                      </Fade>
                    ) : (
                      filteredChats.map((chat, index) => {
                        const other = getOtherParticipant(chat);
                        return (
                          <Fade in timeout={300 + index * 100} key={chat.id}>
                            <ListItem
                              button
                              selected={selectedChat?.id === chat.id}
                              onClick={() => setSelectedChat(chat)}
                              sx={{
                                borderLeft:
                                  selectedChat?.id === chat.id ? 4 : 0,
                                borderColor: "primary.main",
                                transition: "all 0.2s ease",
                                bgcolor:
                                  selectedChat?.id === chat.id
                                    ? "rgba(37,99,235,0.08)"
                                    : "transparent",
                                "&:hover": {
                                  bgcolor: "rgba(37,99,235,0.05)",
                                  transform: "translateX(4px)",
                                },
                              }}
                            >
                              <ListItemAvatar>
                                <Badge
                                  color="success"
                                  variant="dot"
                                  invisible={!chat.online}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                  sx={{
                                    "& .MuiBadge-badge": {
                                      boxShadow: "0 0 0 2px white",
                                    },
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: "primary.main",
                                      background:
                                        "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                                      boxShadow:
                                        "0 2px 8px rgba(37,99,235,0.3)",
                                    }}
                                  >
                                    {(other.name || "U").charAt(0)}
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={
                                        chat.unreadCount > 0 ? 700 : 600
                                      }
                                    >
                                      {other.name}
                                    </Typography>
                                    {chat.unreadCount > 0 && (
                                      <Chip
                                        label={chat.unreadCount}
                                        size="small"
                                        color="primary"
                                        sx={{
                                          height: 20,
                                          minWidth: 20,
                                          fontWeight: 700,
                                        }}
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        fontWeight:
                                          chat.unreadCount > 0 ? 600 : 400,
                                        color:
                                          chat.unreadCount > 0
                                            ? "text.primary"
                                            : "text.secondary",
                                      }}
                                    >
                                      {chat.lastMessage}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {chat.lastMessageTime?.toDate
                                        ? formatDistanceToNow(
                                            chat.lastMessageTime.toDate(),
                                            {
                                              addSuffix: true,
                                            }
                                          )
                                        : ""}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </Fade>
                        );
                      })
                    )}
                  </List>
                </CardContent>
              </Card>
            </Slide>

            {/* Chat Window */}
            <Grow in timeout={700}>
              <Card
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                {!selectedChat ? (
                  <Fade in timeout={500}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                      textAlign="center"
                      sx={{
                        background:
                          "linear-gradient(180deg, rgba(37,99,235,0.03) 0%, transparent 100%)",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(30,64,175,0.1) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 3,
                          }}
                        >
                          <Forum sx={{ fontSize: 48, color: "primary.main" }} />
                        </Box>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                          fontWeight={600}
                        >
                          Select a conversation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Choose a chat from the list to start messaging
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                ) : (
                  <>
                    {/* Chat Header */}
                    <Box
                      p={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        background:
                          "linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.02) 100%)",
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            background:
                              "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                          }}
                        >
                          {(
                            getOtherParticipant(selectedChat).name || "U"
                          ).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {getOtherParticipant(selectedChat).name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: selectedChat.online
                                ? "success.main"
                                : "text.secondary",
                              fontWeight: 500,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: selectedChat.online
                                  ? "success.main"
                                  : "grey.400",
                              }}
                            />
                            {selectedChat.online ? "Online" : "Offline"}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(37,99,235,0.1)",
                          },
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box
                      flexGrow={1}
                      overflow="auto"
                      p={2}
                      sx={{
                        bgcolor: "grey.50",
                        background:
                          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                      }}
                    >
                      {messages.map((message, index) => {
                        const isOwn = message.senderId === user.uid;
                        return (
                          <Fade in timeout={200 + index * 50} key={message.id}>
                            <Box
                              display="flex"
                              justifyContent={isOwn ? "flex-end" : "flex-start"}
                              mb={2}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  maxWidth: "70%",
                                  bgcolor: isOwn ? "primary.main" : "white",
                                  background: isOwn
                                    ? "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
                                    : "white",
                                  color: isOwn ? "white" : "text.primary",
                                  borderRadius: isOwn
                                    ? "16px 16px 4px 16px"
                                    : "16px 16px 16px 4px",
                                  boxShadow: isOwn
                                    ? "0 4px 12px rgba(37,99,235,0.3)"
                                    : "0 2px 8px rgba(0,0,0,0.08)",
                                }}
                              >
                                <Typography variant="body2">
                                  {message.text}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                    color: isOwn
                                      ? "rgba(255,255,255,0.7)"
                                      : "text.secondary",
                                    textAlign: isOwn ? "right" : "left",
                                  }}
                                >
                                  {message.timestamp?.toDate
                                    ? formatDistanceToNow(
                                        message.timestamp.toDate(),
                                        { addSuffix: true }
                                      )
                                    : "Just now"}
                                </Typography>
                              </Paper>
                            </Box>
                          </Fade>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>

                    {/* Message Input */}
                    <Box
                      p={2}
                      sx={{
                        borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "white",
                      }}
                    >
                      <Box display="flex" gap={1} alignItems="flex-end">
                        <IconButton
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(37,99,235,0.1)",
                              color: "primary.main",
                            },
                          }}
                        >
                          <AttachFile />
                        </IconButton>
                        <TextField
                          fullWidth
                          multiline
                          maxRows={3}
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              "&:hover": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                },
                              },
                            },
                          }}
                        />
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          sx={{
                            bgcolor: messageText.trim()
                              ? "primary.main"
                              : "grey.200",
                            color: messageText.trim() ? "white" : "grey.500",
                            background: messageText.trim()
                              ? "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
                              : undefined,
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                            "&.Mui-disabled": {
                              bgcolor: "grey.200",
                              color: "grey.500",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Send />
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
              </Card>
            </Grow>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}
