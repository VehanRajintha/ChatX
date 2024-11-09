import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

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
  z-index: 10000;
`;

const UserListContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }
`;

const UserItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #e2e8f0;
`;

const UserItemContent = styled.div`
  display: flex;
  flex-direction: column;
  
  .name {
    font-weight: 500;
  }
  
  .email {
    font-size: 0.8rem;
    color: #64748b;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 1rem;
  color: #666;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export default function UserList({ onClose, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        console.log('Fetching users...');
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        console.log('Found users:', snapshot.docs.length);
        
        const userList = snapshot.docs
          .map(doc => {
            console.log('User doc:', doc.data());
            return {
              id: doc.id,
              ...doc.data()
            };
          })
          .filter(user => 
            user.id !== currentUser.uid && 
            !user.isPrivate
          );
        
        console.log('Filtered users:', userList);
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal onClick={onClose}>
      <UserListContainer onClick={e => e.stopPropagation()}>
        <h3>New Chat</h3>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
        />
        {loading ? (
          <LoadingText>Loading users...</LoadingText>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserItem 
              key={user.id}
              onClick={() => onSelectUser(user)}
            >
              <UserAvatar 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.displayName
                )}&background=2c3e50&color=fff`}
                alt={user.displayName || user.email}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.displayName || user.email.split('@')[0]
                  )}&background=2c3e50&color=fff`;
                }}
              />
              <UserItemContent>
                <div className="name">{user.displayName || user.email.split('@')[0]}</div>
                {user.displayName && <div className="email">{user.email}</div>}
              </UserItemContent>
            </UserItem>
          ))
        ) : (
          <LoadingText>No users found</LoadingText>
        )}
      </UserListContainer>
    </Modal>
  );
} 