import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc, 
  arrayUnion
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const ChatWindowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  height: calc(100vh - 96px);
  min-width: 400px;
  max-width: 400px;

  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    border-radius: 0;
    height: 100vh;
    z-index: 9999;
    background: white;
    min-width: 100%;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #2c3e50;
  color: white;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    width: 100%;
  }
`;

const BackArrow = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(-3px);
  }
  
  &:active {
    transform: translateX(0);
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #e2e8f0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .name {
    font-weight: 500;
    font-size: 1rem;
  }
  
  .status {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
    margin-top: 0.1rem;

    width: 100%;
  }
`;

const MessageWrapper = styled.div`
  position: relative;
  max-width: 99%;
  margin-left: auto;
  margin-right: auto;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: ${props => props.sent ? '16px 16px 0 16px' : '16px 16px 16px 0'};
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
  position: relative;
  background: ${props => props.sent ? '#2c3e50' : '#e2e8f0'};
  color: ${props => props.sent ? 'white' : '#1a202c'};
  max-width: 60%;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
`;

const MessageOptions = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  z-index: 10001;
  overflow: hidden;
  width: 95%;
  max-width: 300px;
`;

const OptionsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: ${props => props.show ? 'block' : 'none'};
  z-index: 10000;
`;

const OptionsButton = styled.button`
  background: transparent;
  border: none;
  padding: 16px;
  color: ${props => props.delete ? '#e74c3c' : '#4a5568'};
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #edf2f7;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #f7fafc;
  }
`;

const MessageInput = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  gap: 0.75rem;
  width: 55%;
  
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem;
    background: white;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    z-index: 10000;
      width: 95%;
  }
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const SendButton = styled.button`
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  font-weight: 500;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MentionIcon = styled.div`
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  cursor: pointer;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s;
  padding: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MentionedMessagePreview = styled.div`
  background: #f1f5f9;
  padding: 0.75rem;
  border-left: 4px solid #2c3e50;
  border-radius: 4px;
  margin-bottom: 4rem;
  font-size: 0.9rem;
  color: #64748b;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    font-size: 1.1rem;
    
    &:hover {
      color: #4a5568;
    }
  }
`;

const ReplyPreview = styled(MentionedMessagePreview)`
  margin: 0 0 0.5rem;
  background: rgba(241, 245, 249, 0.5);
  max-width: 90%;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  border-left: none;
  border-${props => props.sent ? 'right' : 'left'}: 3px solid #2c3e50;
`;

const MessageInputWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 0.5rem;
`;

const MessageSwipeArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: ${props => props.sent ? 'flex-end' : 'flex-start'};
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    .message-actions {
      opacity: 1;
    }
  }
`;

function MessageComponent({ message, sent, onDelete, onMention }) {
  const [showOptions, setShowOptions] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const messageRef = useRef(null);
  const swipeThreshold = 50;

  const handleTouchStart = (e) => {
    setSwipeX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - swipeX;
    if (diff > swipeThreshold) {
      onMention(message);
      setSwipeX(0);
    }
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    setShowOptions(true);
  };

  const handleClose = () => {
    setShowOptions(false);
  };

  const handleDelete = (type) => {
    onDelete(message.id, type);
    setShowOptions(false);
  };

  return (
    <MessageSwipeArea>
      <MessageWrapper sent={sent} ref={messageRef}>
        {message.replyTo && (
          <ReplyPreview sent={sent}>
            <span>↩️ {message.replyTo.text}</span>
          </ReplyPreview>
        )}
        <Message 
          sent={sent}
          onClick={handleMessageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {message.text}
          {!sent && (
            <MentionIcon 
              show={true}
              onClick={(e) => {
                e.stopPropagation();
                onMention(message);
              }}
            >
              ↩️
            </MentionIcon>
          )}
        </Message>
      </MessageWrapper>

      <OptionsOverlay show={showOptions} onClick={handleClose} />
      <MessageOptions show={showOptions}>
        <OptionsButton onClick={() => handleDelete('everyone')} delete>
          Delete for Everyone
        </OptionsButton>
        <OptionsButton onClick={() => handleDelete('me')}>
          Delete for Me
        </OptionsButton>
        <OptionsButton onClick={handleClose}>
          Cancel
        </OptionsButton>
      </MessageOptions>
    </MessageSwipeArea>
  );
}

export default function ChatWindow({ chat, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentionedMessage, setMentionedMessage] = useState(null);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat?.id) return;

    const q = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsubscribe();
  }, [chat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMention = (message) => {
    setMentionedMessage(message);
    // Focus input after mention
    document.querySelector('input[type="text"]').focus();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: new Date(),
        ...(mentionedMessage && {
          replyTo: {
            id: mentionedMessage.id,
            text: mentionedMessage.text,
            senderId: mentionedMessage.senderId
          }
        })
      };

      await addDoc(collection(db, `chats/${chat.id}/messages`), messageData);
      setNewMessage('');
      setMentionedMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  async function handleDeleteMessage(messageId, deleteType) {
    try {
      const messageRef = doc(db, `chats/${chat.id}/messages/${messageId}`);
      
      if (deleteType === 'everyone') {
        await deleteDoc(messageRef);
      } else {
        await updateDoc(messageRef, {
          deletedFor: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <BackArrow onClick={onBack}>
          <FaArrowLeft />
        </BackArrow>
        <UserAvatar 
          src={chat.otherUser?.photoURL || 'https://via.placeholder.com/40'} 
          alt={chat.otherUser?.displayName || 'User'}
        />
        <UserInfo>
          <div className="name">
            {chat.otherUser?.displayName || chat.otherUser?.email || 'User'}
          </div>
          <div className="status">Online</div>
        </UserInfo>
      </ChatHeader>

      <MessagesContainer>
        {messages
          .filter(message => !message.deletedFor?.includes(currentUser.uid))
          .map(message => (
            <React.Fragment key={message.id}>
              <MessageComponent
                message={message}
                sent={message.senderId === currentUser.uid}
                onDelete={handleDeleteMessage}
                onMention={handleMention}
              />
            </React.Fragment>
          ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageInputWrapper>
        {mentionedMessage && (
          <MentionedMessagePreview>
            <span>Replying to: {mentionedMessage.text}</span>
            <button onClick={() => setMentionedMessage(null)}>✕</button>
          </MentionedMessagePreview>
        )}
        <MessageInput>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
          />
          <SendButton 
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            Send
          </SendButton>
        </MessageInput>
      </MessageInputWrapper>
    </ChatWindowContainer>
  );
} 