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
} from "@mui/material";
import { Send, Search, AttachFile, MoreVert } from "@mui/icons-material";
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = [];
      snapshot.forEach((doc) => {
        chatsData.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatsData);
    });

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
    const otherId = chat.participants.find((p) => p !== user.uid);
    return (
      chat.participantsData?.[otherId] || { name: "Unknown User", avatar: "" }
    );
  };

  const filteredChats = chats.filter((chat) => {
    const other = getOtherParticipant(chat);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4, height: "calc(100vh - 100px)" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom mb={3}>
          Messages
        </Typography>

        <Box display="flex" gap={2} height="calc(100% - 60px)">
          {/* Chat List */}
          <Card sx={{ width: 350, display: "flex", flexDirection: "column" }}>
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 0,
              }}
            >
              <Box p={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider />
              <List sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
                {filteredChats.length === 0 ? (
                  <Box py={4} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      No conversations yet
                    </Typography>
                  </Box>
                ) : (
                  filteredChats.map((chat) => {
                    const other = getOtherParticipant(chat);
                    return (
                      <ListItem
                        key={chat.id}
                        button
                        selected={selectedChat?.id === chat.id}
                        onClick={() => setSelectedChat(chat)}
                        sx={{
                          borderLeft: selectedChat?.id === chat.id ? 3 : 0,
                          borderColor: "primary.main",
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
                          >
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {other.name.charAt(0)}
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
                              <Typography variant="body2" fontWeight={600}>
                                {other.name}
                              </Typography>
                              {chat.unreadCount > 0 && (
                                <Chip
                                  label={chat.unreadCount}
                                  size="small"
                                  color="primary"
                                  sx={{ height: 20, minWidth: 20 }}
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
                    );
                  })
                )}
              </List>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {!selectedChat ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                textAlign="center"
              >
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a chat from the list to start messaging
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                {/* Chat Header */}
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {getOtherParticipant(selectedChat).name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {getOtherParticipant(selectedChat).name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedChat.online ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box
                  flexGrow={1}
                  overflow="auto"
                  p={2}
                  sx={{ bgcolor: "grey.50" }}
                >
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === user.uid;
                    return (
                      <Box
                        key={message.id}
                        display="flex"
                        justifyContent={isOwn ? "flex-end" : "flex-start"}
                        mb={2}
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: "70%",
                            bgcolor: isOwn ? "primary.main" : "white",
                            color: isOwn ? "white" : "text.primary",
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
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box p={2} borderTop={1} borderColor="divider">
                  <Box display="flex" gap={1}>
                    <IconButton>
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
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </>
            )}
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
