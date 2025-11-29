import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  SportsSoccer as SportsIcon,
  FitnessCenter as FitnessIcon
} from '@mui/icons-material';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          },
        }}
      >
        <SportsIcon sx={{ fontSize: 120, color: '#00d4ff', opacity: 0.1 }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-25px) rotate(-5deg)' },
          },
        }}
      >
        <FitnessIcon sx={{ fontSize: 100, color: '#00d4ff', opacity: 0.1 }} />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'rgba(17, 17, 17, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Logo/Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
                mb: 2,
                boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
              }}
            >
              <SportsIcon sx={{ fontSize: 45, color: '#000' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#00d4ff',
                mb: 1,
                letterSpacing: 1,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
              }}
            >
              Morsli Sport
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: 1,
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(17, 17, 17, 0.95)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 1.5,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.5)',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.15)',
                    '& fieldset': {
                      borderColor: '#00d4ff',
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94a3b8',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&.Mui-focused': {
                    color: '#00d4ff',
                    fontWeight: 600,
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  fontWeight: 500,
                  padding: '14px 16px',
                  '&::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#00d4ff', fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(17, 17, 17, 0.95)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    borderWidth: 1.5,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.5)',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    boxShadow: '0 0 0 3px rgba(0, 212, 255, 0.15)',
                    '& fieldset': {
                      borderColor: '#00d4ff',
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94a3b8',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&.Mui-focused': {
                    color: '#00d4ff',
                    fontWeight: 600,
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  fontWeight: 500,
                  padding: '14px 16px',
                  '&::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#00d4ff', fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ 
                        color: '#94a3b8',
                        '&:hover': {
                          color: '#00d4ff',
                          backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: 2,
                background: '#00d4ff',
                color: '#000',
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                letterSpacing: 0.5,
                boxShadow: '0 4px 16px rgba(0, 212, 255, 0.4)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#00b8d4',
                  boxShadow: '0 6px 20px rgba(0, 212, 255, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 212, 255, 0.3)',
                  color: '#94a3b8',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Se Connecter'
              )}
            </Button>
          </form>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.85rem',
                letterSpacing: 0.5,
              }}
            >
              Accès administrateur sécurisé
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;

