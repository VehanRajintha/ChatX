import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container } from './StyledComponents';
import ChatList from './ChatList';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { createChat } from '../utils/chatUtils';
import ProfileSettings from './ProfileSettings';

const ChatContainer = styled(Container)`
  height: 100vh;
  padding: 0;
  position: relative;
  max-width: 100%;
  background: #f8fafc;
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    padding: 0;
  }
`;

const ChatLayout = styled.div`
  display: flex;
  height: calc(100vh - 70px);
  
  @media (max-width: 768px) {
    position: relative;
    padding: 0;
    
    ${props => props.showChat && `
      .chat-list {
        display: none;
      }
      
      .chat-window {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3000;
        margin: 0;
        border-radius: 0;
      }
    `}
  }
`;

const NewChatButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  z-index: 2000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  
  &:hover {
    transform: scale(1.1) rotate(180deg);
    background: #34495e;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    bottom: 1rem;
    right: 1rem;
    font-size: 1.25rem;
    z-index: 2000;
  }
`;

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [showUserList, setShowUserList] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ChatContainer>
      <ChatLayout showChat={isMobile && selectedChat}>
        <div className="chat-list">
          <ChatList 
            onSelectChat={setSelectedChat} 
            selectedChat={selectedChat}
            onSettingsClick={() => setShowSettings(true)}
          />
        </div>
        {showSettings && (
          <ProfileSettings onClose={() => setShowSettings(false)} />
        )}
        {selectedChat && (
          <div className="chat-window">
            <ChatWindow 
              chat={selectedChat}
              onBack={() => setSelectedChat(null)}
            />
          </div>
        )}
      </ChatLayout>

      <NewChatButton onClick={() => setShowUserList(true)}>
        <FaPlus />
      </NewChatButton>

      {showUserList && (
        <UserList 
          onClose={() => setShowUserList(false)}
          onSelectUser={async (user) => {
            try {
              if (!user || !user.id) {
                console.error('Invalid user object:', user);
                return;
              }
              
              const chatId = await createChat(currentUser.uid, user.id);
              const chatData = {
                id: chatId,
                participants: [currentUser.uid, user.id],
                otherUser: user,
                createdAt: new Date(),
                lastMessage: '',
                lastMessageTimestamp: new Date()
              };
              setSelectedChat(chatData);
              setShowUserList(false);
            } catch (error) {
              console.error('Error creating chat:', error);
            }
          }}
        />
      )}
    </ChatContainer>
  );
} 