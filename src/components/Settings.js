import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaTimes } from 'react-icons/fa';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SettingsContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: #c0392b;
  }
`;

export default function Settings({ onClose }) {
  const { currentUser, logout } = useAuth();

  return (
    <Modal onClick={onClose}>
      <SettingsContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <h2>Settings</h2>
        <div>
          <p>Email: {currentUser.email}</p>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </div>
      </SettingsContainer>
    </Modal>
  );
} 