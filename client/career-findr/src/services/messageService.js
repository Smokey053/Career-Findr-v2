import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

/**
 * Create or get existing chat between two users
 * @param {string} currentUserId - Current user's ID
 * @param {string} otherUserId - Other user's ID
 * @param {object} currentUserData - Current user's profile data
 * @param {object} otherUserData - Other user's profile data
 * @returns {Promise<object>} Chat document
 */
export const getOrCreateChat = async (
  currentUserId,
  otherUserId,
  currentUserData,
  otherUserData
) => {
  try {
    const chatsRef = collection(db, "chats");

    // Check if chat already exists between these two users
    const existingChatQuery = query(
      chatsRef,
      where("participants", "array-contains", currentUserId)
    );

    const snapshot = await getDocs(existingChatQuery);
    let existingChat = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(otherUserId)) {
        existingChat = { id: doc.id, ...data };
      }
    });

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const newChat = {
      participants: [currentUserId, otherUserId],
      participantsData: {
        [currentUserId]: {
          name: currentUserData.displayName || currentUserData.name || currentUserData.email,
          email: currentUserData.email,
          avatar: currentUserData.photoURL || "",
          role: currentUserData.role,
        },
        [otherUserId]: {
          name: otherUserData.displayName || otherUserData.name || otherUserData.email,
          email: otherUserData.email,
          avatar: otherUserData.photoURL || "",
          role: otherUserData.role,
        },
      },
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      unreadCount: 0,
    };

    const docRef = await addDoc(chatsRef, newChat);
    return { id: docRef.id, ...newChat };
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    throw error;
  }
};

/**
 * Send a message in a chat
 * @param {string} chatId - Chat document ID
 * @param {string} senderId - Sender's user ID
 * @param {string} senderName - Sender's display name
 * @param {string} text - Message text
 * @returns {Promise<object>} Message document
 */
export const sendMessage = async (chatId, senderId, senderName, text) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);

    const message = {
      text,
      senderId,
      senderName,
      timestamp: serverTimestamp(),
      read: false,
    };

    const docRef = await addDoc(messagesRef, message);

    // Update chat's last message
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
    });

    return { id: docRef.id, ...message };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Get all chats for a user
 * @param {string} userId - User ID
 * @returns {Promise<array>} Array of chat documents
 */
export const getUserChats = async (userId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", userId),
      orderBy("lastMessageTime", "desc")
    );

    const snapshot = await getDocs(q);
    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    return chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
};

/**
 * Start a new conversation with initial message
 * @param {string} currentUserId - Current user's ID
 * @param {string} otherUserId - Other user's ID
 * @param {object} currentUserData - Current user's profile data
 * @param {object} otherUserData - Other user's profile data
 * @param {string} initialMessage - Optional initial message
 * @returns {Promise<object>} Chat and message documents
 */
export const startConversation = async (
  currentUserId,
  otherUserId,
  currentUserData,
  otherUserData,
  initialMessage = ""
) => {
  try {
    const chat = await getOrCreateChat(
      currentUserId,
      otherUserId,
      currentUserData,
      otherUserData
    );

    let message = null;
    if (initialMessage) {
      message = await sendMessage(
        chat.id,
        currentUserId,
        currentUserData.displayName || currentUserData.name || currentUserData.email,
        initialMessage
      );
    }

    return { chat, message };
  } catch (error) {
    console.error("Error starting conversation:", error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
