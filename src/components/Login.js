import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Input, Button, Error, GoogleButton } from './StyledComponents';
import googleLogo from '../assets/google-logo.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
    setLoading(false);
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <Error>{error}</Error>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button disabled={loading} type="submit">
          Login
        </Button>
        <GoogleButton 
          type="button" 
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img 
            src={googleLogo}
            alt="Google logo"
          />
          Sign in with Google
        </GoogleButton>
        <div>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </Container>
  );
} 