import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { Person as PersonIcon, Edit, Delete, AddAPhoto, Email, Phone, Lock, Language, Logout, FlutterDash } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const Profile = () => {
  // Placeholder data for UI skeleton
  const user = {
    avatar: '',
    nickname: 'fayzvllo',
    email: 'fayzvllo@gmail.com',
    phones: ['+1234567890'],
    createdAt: '2024-06-01T12:00:00Z',
  };
  const navigate = useNavigate();
  const fileInputRef = React.useRef();
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatar);
  const handleAddPhotoClick = () => fileInputRef.current && fileInputRef.current.click();
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Uploading file:', file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:8080/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
        });
        console.log('Upload response:', res.data);
        if (res.data.avatarUrl) {
          setAvatarUrl(res.data.avatarUrl);
        }
      } catch (err) {
        alert('Failed to upload avatar');
        console.error('Upload error:', err);
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(-45deg, #2196f3 0%, #4facfe 50%, #1976d2 100%)',
      backgroundSize: '400% 400%',
      animation: `${gradientShift} 15s ease infinite`,
      position: 'relative',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      {/* Glassy Header */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        py: 2,
        mt: 2,
        mb: 4,
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255,255,255,0.10)',
        borderRadius: 4,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
      }}>
        {/* Left: Butterfly/Chat Icon (placeholder for logo) */}
        <IconButton sx={{
          bgcolor: 'rgba(255,255,255,0.18)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 2px 8px #0002',
          p: 1.5,
          '&:hover': { bgcolor: '#2196f3', color: '#fff' },
        }}
        onClick={() => navigate('/chat')}
        >
          <FlutterDash sx={{ fontSize: 32 }} />
        </IconButton>
        {/* Right: Language and Exit/Account Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{
            bgcolor: 'rgba(255,255,255,0.18)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 8px #0002',
            p: 1.5,
            '&:hover': { bgcolor: '#2196f3', color: '#fff' },
          }}>
            <Language sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton sx={{
            bgcolor: 'rgba(255,255,255,0.18)',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 8px #0002',
            p: 1.5,
            '&:hover': { bgcolor: '#1976d2', color: '#fff' },
          }}>
            <Logout sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Animated background shapes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 6s ease-in-out infinite`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: 120,
        height: 120,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 8s ease-in-out infinite reverse`,
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: 90,
        height: 90,
        borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        animation: `${float} 7s ease-in-out infinite`,
        zIndex: 1
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={0} sx={{
          p: 6,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: `${pulse} 4s ease-in-out infinite`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Avatar Section */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Avatar
              src={avatarUrl}
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 48, boxShadow: '0 4px 24px #0002' }}
            >
              {!avatarUrl && <PersonIcon fontSize="inherit" />}
            </Avatar>
          </Box>
          {/* Avatar Edit/Delete Buttons - moved further down */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Tooltip title="Upload Avatar">
              <IconButton color="primary" sx={{ bgcolor: 'white', boxShadow: '0 2px 8px #0002', '&:hover': { bgcolor: '#2196f3' }, width: 40, height: 40 }}
                onClick={handleAddPhotoClick}
              >
                <AddAPhoto />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Avatar">
              <IconButton color="error" sx={{ bgcolor: 'white', boxShadow: '0 2px 8px #0002', '&:hover': { bgcolor: '#1976d2' }, width: 40, height: 40 }}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Nickname Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              @{user.nickname}
            </Typography>
            <Tooltip title="Edit Nickname">
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.12)', ml: 1, '&:hover': { bgcolor: '#2196f3', color: '#fff' } }}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, mb: 2, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            Unique nickname (searchable by others)
          </Typography>

          <Divider sx={{ width: '100%', my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Emails Section */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ color: '#2196f3', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Emails
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography sx={{ color: 'white', opacity: 0.9 }}>
                {user.email}
              </Typography>
              <Tooltip title="Edit Email">
                <IconButton sx={{ color: '#2196f3', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: '#2196f3', color: '#fff' } }}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Email">
                <IconButton sx={{ color: '#1976d2', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: '#1976d2', color: '#fff' } }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Phones Section */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ color: '#2196f3', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Phone Numbers
              </Typography>
            </Box>
            {user.phones.map((phone, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography sx={{ color: 'white', opacity: 0.9 }}>
                  {phone}
                </Typography>
                <Tooltip title="Edit Phone">
                  <IconButton sx={{ color: '#2196f3', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: '#2196f3', color: '#fff' } }}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Phone">
                  <IconButton sx={{ color: '#1976d2', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: '#1976d2', color: '#fff' } }}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>

          <Divider sx={{ width: '100%', my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Password Section */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Lock sx={{ color: '#2196f3', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Password
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'white', opacity: 0.7, fontSize: 16 }}>
                ••••••••••
              </Typography>
              <Tooltip title="Change Password">
                <IconButton sx={{ color: '#2196f3', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: '#2196f3', color: '#fff' } }}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ width: '100%', my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

          <Typography variant="body2" sx={{ color: 'white', opacity: 0.7, mt: 2, textAlign: 'center' }}>
            Account created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 