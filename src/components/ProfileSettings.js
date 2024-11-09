import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';
import { updateUserProfile } from '../utils/userUtils';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Notification from './Notification';

const SettingsContainer = styled.div`
  width: 380px;
  min-width: 380px;
  background: white;
  height: 100%;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
  }
`;

const Header = styled.div`
  padding: 1.25rem;
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(-3px);
  }
`;

const ProfileSection = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2c3e50;
`;

const CameraButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #2c3e50;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  input {
    display: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.danger ? '#ef4444' : '#2c3e50'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
`;

const ToggleLabel = styled.span`
  font-size: 0.95rem;
  color: #4a5568;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e0;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #2c3e50;
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

export default function ProfileSettings({ onClose }) {
  const { currentUser, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchPrivateMode = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setIsPrivate(userDoc.data().isPrivate || false);
      }
    };
    fetchPrivateMode();
  }, [currentUser]);

  useEffect(() => {
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setDisplayName(userData.displayName || '');
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        await updateUserProfile(currentUser.uid, {
          profileImage: file
        });
        setNotification('Profile photo updated successfully');
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error('Error updating profile image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(currentUser.uid, {
        displayName
      });
      setNotification('Profile name updated successfully');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivateMode = async (e) => {
    const newValue = e.target.checked;
    setIsPrivate(newValue);
    try {
      await updateUserProfile(currentUser.uid, {
        isPrivate: newValue
      });
      setNotification(`Private mode ${newValue ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error updating private mode:', error);
      setIsPrivate(!newValue); // Revert on error
    }
  };

  return (
    <SettingsContainer>
      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification(null)}
        />
      )}
      <Header>
        <BackButton onClick={onClose}>
          <FaArrowLeft />
        </BackButton>
        <h2>Profile Settings</h2>
      </Header>
      
      <ProfileSection>
        <AvatarContainer>
          <Avatar 
            src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`}
            alt="Profile"
          />
          <CameraButton>
            <FaCamera />
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </CameraButton>
        </AvatarContainer>

        <Input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <ToggleWrapper>
          <ToggleLabel>Private Mode</ToggleLabel>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handlePrivateMode}
            />
            <span></span>
          </ToggleSwitch>
        </ToggleWrapper>

        <Button onClick={handleUpdateProfile} disabled={loading}>
          Update Profile
        </Button>

        <Button danger onClick={logout}>
          Logout
        </Button>
      </ProfileSection>
    </SettingsContainer>
  );
} 