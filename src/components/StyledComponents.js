import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 580px) {
    padding: 0;
    max-width: 100%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1.25rem;
    border-radius: 0;
    min-height: 100vh;
    justify-content: center;
    max-width: 100%;
    width: 100vw;
  }
`;

export const Input = styled.input`
  width: 90%;
  padding: 0.8rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1F2937;
  background: white;
  
  &::placeholder {
    color: #9CA3AF;
  }
  
  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 0.875rem;
    font-size: 16px;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #18181B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
    z-index: 10000;
  
  &:hover {
    background: #27272A;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 16px;
    min-height: 44px;
  }
  
  &:focus {
    outline: 2px solid #2563EB;
    outline-offset: 2px;
  }
`;

export const GoogleButton = styled(Button)`
  background: white;
  border: 1px solid #E5E7EB;
  color: #18181B;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.8rem 1rem;
  
  &:hover {
    background: #F9FAFB;
  }
  
  img {
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 14px;
    
    img {
      width: 16px;
      height: 16px;
    }
  }
`;

export const Error = styled.div`
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #18181B;
  margin-bottom: -0.75rem;
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const SignUpText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #4B5563;
  margin-top: 1rem;

  a {
    color: #2563EB;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin-top: 0.75rem;
  }
`; 