import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideInDesktop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInMobile = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutDesktop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const slideOutMobile = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  padding: 16px 24px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;

  @media (min-width: 769px) {
    top: 20px;
    right: 20px;
    max-width: 400px;
    animation: ${props => props.isClosing ? slideOutDesktop : slideInDesktop} 0.3s ease forwards;
  }

  @media (max-width: 768px) {
    bottom: 100px;
    left: 9%;
    transform: translateX(-50%);
    width: 85%;
    max-width: 320px;
    justify-content: center;
    padding: 12px 20px;
    font-size: 0.95rem;
    animation: ${props => props.isClosing ? slideOutMobile : slideInMobile} 0.3s ease forwards;
  }

  .icon {
    font-size: 20px;
    color: #4ade80;
  }
`;

export default function Notification({ message, onClose }) {
  return (
    <NotificationContainer>
      <span className="icon">✓</span>
      {message}
    </NotificationContainer>
  );
} 