import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function createChat(currentUserId, otherUserId) {
  try {
    // Check if chat already exists
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUserId)
    );
    
    const querySnapshot = await getDocs(q);
    const existingChat = querySnapshot.docs.find(doc => 
      doc.data().participants.includes(otherUserId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat with auto-generated ID
    const newChatRef = doc(collection(db, 'chats'));
    
    // Set chat document data
    await setDoc(newChatRef, {
      participants: [currentUserId, otherUserId],
      participantDetails: {
        [currentUserId]: { lastSeen: new Date() },
        [otherUserId]: { lastSeen: null }
      },
      createdAt: new Date(),
      lastMessage: '',
      lastMessageTimestamp: new Date()
    });

    return newChatRef.id;
  } catch (error) {
    console.error('Error in createChat:', error);
    throw error;
  }
}

export async function updateLastMessage(chatId, message) {
  const chatRef = doc(db, 'chats', chatId);
  await setDoc(chatRef, {
    lastMessage: message,
    lastMessageTimestamp: new Date()
  }, { merge: true });
} 