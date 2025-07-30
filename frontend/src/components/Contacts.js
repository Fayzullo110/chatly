import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  TextField, 
  IconButton, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  InputAdornment,
  Badge,
  Tooltip,
  Fade,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useThemeMode } from '../contexts/ThemeContext';
import ChatIconMui from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import OnlineIcon from '@mui/icons-material/FiberManualRecord';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Contacts = ({ users, handleOpenNewChat, handleOpenNewGroup, onNav, mainView, onContactSelect }) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, online, recent
  const [isLoading, setIsLoading] = useState(false);

  // Theme-aware search field styling
  const getSearchFieldStyles = () => {
    const isDark = mode === 'dark';
    return {
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(10px)',
        border: '2px solid #1976d2',
        transition: 'all 0.3s ease',
        '& fieldset': {
          border: 'none',
        },
        '&:hover fieldset': {
          border: 'none',
        },
        '&.Mui-focused fieldset': {
          border: 'none',
        },
        '&:hover': {
          background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          border: '2px solid #1976d2',
        },
        '&.Mui-focused': {
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          border: '2px solid #1976d2',
          boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
        },
      },
      '& .MuiInputBase-input': {
        color: isDark ? '#ffffff !important' : '#000000 !important',
        fontSize: '0.9rem',
        fontWeight: 500,
      },
      '& .MuiInputBase-input::placeholder': {
        color: isDark ? 'rgba(255, 255, 255, 0.6) !important' : 'rgba(0, 0, 0, 0.6) !important',
        opacity: 0.8,
      },
    };
  };

  // Filter and sort users based on search query and filter type
  const filteredUsers = useMemo(() => {
    let filtered = users.slice();

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter type
    switch (filterType) {
      case 'online':
        filtered = filtered.filter(user => user.isOnline);
        break;
      case 'recent':
        // Sort by last activity (if available)
        filtered = filtered.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
        break;
      default:
        // Sort alphabetically
        filtered = filtered.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
    }

    return filtered;
  }, [users, searchQuery, filterType]);

  const handleContactClick = (user) => {
    if (onContactSelect) {
      onContactSelect(user);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getFilterChipColor = (type) => {
    return filterType === type ? 'primary' : 'default';
  };

  const getOnlineStatusColor = (isOnline) => {
    return isOnline ? '#4caf50' : '#9e9e9e';
  };

  return (
    <Box sx={{ p: 3, pb: 10, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => onNav('chats')}
          sx={{
            mr: 2,
            color: '#1976d2',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Back to Chats
        </Typography>
      </Box>

      {/* Header with action buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<ChatIconMui />}
          onClick={handleOpenNewChat}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          New Chat
        </Button>
        <Button
          variant="outlined"
          startIcon={<GroupIcon />}
          onClick={handleOpenNewGroup}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          New Group
        </Button>
      </Box>

      {/* Title and stats */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Contacts
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {filteredUsers.length} of {users.length}
        </Typography>
      </Box>

      {/* Search bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={getSearchFieldStyles()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{ color: 'text.secondary' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          variant={getFilterChipColor('all')}
          onClick={() => setFilterType('all')}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label="Online"
          variant={getFilterChipColor('online')}
          onClick={() => setFilterType('online')}
          size="small"
          icon={<OnlineIcon sx={{ fontSize: '0.8rem' }} />}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label="Recent"
          variant={getFilterChipColor('recent')}
          onClick={() => setFilterType('recent')}
          size="small"
          icon={<FilterListIcon sx={{ fontSize: '0.8rem' }} />}
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Contacts list */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 6,
            textAlign: 'center'
          }}>
            <PersonAddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
              {searchQuery 
                ? `No contacts match "${searchQuery}"` 
                : 'Start by creating a new chat or group'
              }
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredUsers.map((user, index) => (
              <Fade in={true} timeout={300 + index * 50} key={user.id}>
                <ListItem
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    onClick={() => handleContactClick(user)}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(33, 150, 243, 0.08)',
                        transform: 'translateX(4px)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <OnlineIcon 
                            sx={{ 
                              fontSize: '0.8rem', 
                              color: getOnlineStatusColor(user.isOnline),
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                            }} 
                          />
                        }
                      >
                        <Avatar 
                          src={user.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : undefined}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              border: '2px solid rgba(33, 150, 243, 0.3)',
                              transform: 'scale(1.05)',
                            }
                          }}
                        >
                          {user.username?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {user.username}
                          {user.isOnline && (
                            <Chip
                              label="Online"
                              size="small"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                background: 'rgba(76, 175, 80, 0.1)',
                                color: '#4caf50',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            opacity: 0.8
                          }}
                        >
                          {user.email || 'No email provided'}
                        </Typography>
                      }
                    />
                    <Tooltip title="Start chat" placement="top">
                      <IconButton
                        size="small"
                        sx={{ 
                          opacity: 0,
                          transition: 'all 0.3s ease',
                          '.MuiListItemButton-root:hover &': {
                            opacity: 1,
                          },
                          '&:hover': {
                            background: 'rgba(33, 150, 243, 0.1)',
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        <ChatIconMui fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              </Fade>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Contacts; 