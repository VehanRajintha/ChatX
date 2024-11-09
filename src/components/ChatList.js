import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { FaCog } from 'react-icons/fa';

const ChatListContainer = styled.div`
  width: 380px;
  min-width: 380px;
  border-right: 1px solid #e2e8f0;
  background: white;
  box-shadow: 2px 0 10px rgba(0,0,0,0.05);
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    min-width: 100%;
    height: 100vh;
    overflow-y: auto;
    margin: 0;
    border: none;
    border-radius: 0;
    z-index: 1000;
  }
`;

const ChatListHeader = styled.div`
  padding: 1.25rem;
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  
  h2 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 600;
  }
`;

const SettingsIcon = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }
`;

const ChatItem = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  background: ${props => props.selected ? '#f8fafc' : 'white'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  &:hover {
    background: #f1f5f9;
  }
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #e2e8f0;
`;

const ChatContent = styled.div`
  flex: 1;
  overflow: hidden;
  
  .chat-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .last-message {
    font-size: 0.875rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function ChatList({ onSelectChat, selectedChat, onSettingsClick }) {
  const [chats, setChats] = useState([]);
  const [chatUsers, setChatUsers] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);

      // Fetch user details for each chat
      const userPromises = chatList.flatMap(chat => 
        chat.participants
          .filter(uid => uid !== currentUser.uid)
          .map(async uid => {
            const userDoc = await getDoc(doc(db, 'users', uid));
            return [uid, userDoc.data()];
          })
      );

      const users = Object.fromEntries(await Promise.all(userPromises));
      setChatUsers(users);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <ChatListContainer>
      <ChatListHeader>
        <h2>Chats</h2>
        <SettingsIcon onClick={onSettingsClick}>
          <FaCog />
        </SettingsIcon>
      </ChatListHeader>
      {chats.map(chat => {
        const otherUserId = chat.participants.find(uid => uid !== currentUser.uid);
        const otherUser = chatUsers[otherUserId];
        
        return (
          <ChatItem 
            key={chat.id}
            selected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat({
              ...chat,
              otherUser
            })}
          >
            <UserAvatar 
              src={otherUser?.photoURL || 'https://via.placeholder.com/48'} 
              alt={otherUser?.displayName || 'User'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48';
              }}
            />
            <ChatContent>
              <div className="chat-name">
                {otherUser?.displayName || otherUser?.email || 'Loading...'}
              </div>
              <div className="last-message">
                {chat.lastMessage || 'No messages yet'}
              </div>
            </ChatContent>
          </ChatItem>
        );
      })}
    </ChatListContainer>
  );
} 