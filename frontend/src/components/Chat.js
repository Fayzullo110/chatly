import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Badge,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  Fab,
  Tooltip,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  VideoCall as VideoCallIcon,
  Call as CallIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Mic as MicIcon,
  Gif as GifIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  PhotoLibrary as PhotoLibraryIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  // Mock user for profile section
  const user = {
    avatarUrl: '', // or a real URL if available
    name: 'Your Name',
    online: true
  };

  // Mock data for demonstration
  const mockChats = [
    { id: 1, name: 'John Doe', type: 'private', avatar: null, lastMessage: 'Hey, how are you?', timestamp: '2:30 PM', unread: 2 },
    { id: 2, name: 'Alice Smith', type: 'private', avatar: null, lastMessage: 'Thanks for the help!', timestamp: '1:45 PM', unread: 0 },
    { id: 3, name: 'Project Team', type: 'group', avatar: null, lastMessage: 'Meeting at 3 PM', timestamp: '12:20 PM', unread: 5 },
    { id: 4, name: 'Friends Group', type: 'group', avatar: null, lastMessage: 'Who wants pizza?', timestamp: '11:15 AM', unread: 0 }
  ];

  const mockMessages = [
    { id: 1, sender: 'John Doe', content: 'Hey, how are you?', timestamp: '2:30 PM', type: 'text' },
    { id: 2, sender: 'You', content: 'I\'m good, thanks! How about you?', timestamp: '2:32 PM', type: 'text' },
    { id: 3, sender: 'John Doe', content: 'Great! Want to grab coffee later?', timestamp: '2:35 PM', type: 'text' }
  ];

  // Fetch chat rooms on component mount
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // Fetch messages when room is selected
  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/chatrooms');
      setChatRooms(response.data);
      if (response.data.length > 0 && !selectedRoom) {
        setSelectedRoom(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      // Use mock data for now
      setChatRooms(mockChats);
      if (mockChats.length > 0 && !selectedRoom) {
        setSelectedRoom(mockChats[0]);
      }
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await axios.get(`http://localhost:8080/messages?chatRoomId=${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Use mock data for now
      setMessages(mockMessages);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const response = await axios.post('http://localhost:8080/messages', {
        chatRoomId: selectedRoom.id,
        content: newMessage
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Add to mock messages for now
      const newMsg = {
        id: Date.now(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const response = await axios.post('http://localhost:8080/chatrooms', {
        name: newRoomName
      });
      
      setChatRooms([...chatRooms, response.data]);
      setNewRoomName('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredChats = chatRooms.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="modern-chat-bg" sx={{
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: theme.palette.text.primary,
      py: 0
    }}>
      <Container maxWidth={false} disableGutters sx={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
        
        {/* Sidebar */}
        <Box sx={{
          width: 320,
          background: 'rgba(33,150,243,0.18)',
          backdropFilter: 'blur(18px)',
          borderRight: '1.5px solid rgba(255,255,255,0.35)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          color: 'white',
          p: 2,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2
        }}>
          
          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(33,150,243,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                borderRadius: 8,
                background: 'rgba(255,255,255,0.22)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 2px 12px 0 rgba(33,150,243,0.10)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  color: '#1976d2',
                  background: 'transparent',
                  transition: 'border-color 0.2s',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.25)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196f3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                    boxShadow: '0 0 0 2px #2196f355',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(33,150,243,0.7)',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* New Chat/Group Buttons */}
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                flex: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px 0 rgba(33,150,243,0.12)',
                fontWeight: 600,
                fontSize: 16,
                py: 1.5,
                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 60%, #4facfe 100%)',
                  boxShadow: '0 6px 24px #2196f344',
                  transform: 'scale(1.04)',
                },
              }}
            >
              NEW CHAT
            </Button>
            <Button
              variant="contained"
              startIcon={<GroupIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                flex: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px 0 rgba(33,150,243,0.12)',
                fontWeight: 600,
                fontSize: 16,
                py: 1.5,
                transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 60%, #4facfe 100%)',
                  boxShadow: '0 6px 24px #2196f344',
                  transform: 'scale(1.04)',
                },
              }}
            >
              NEW GROUP
            </Button>
          </Box>

          {/* Chat List */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {filteredChats.map((chat) => (
                <ListItem key={chat.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    selected={selectedRoom?.id === chat.id}
                    onClick={() => setSelectedRoom(chat)}
                    sx={{
                      borderRadius: 3,
                      background: selectedRoom?.id === chat.id ? 'rgba(255,255,255,0.22)' : 'transparent',
                      transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                      boxShadow: selectedRoom?.id === chat.id ? '0 2px 12px #2196f344' : 'none',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.12)',
                        transform: 'scale(1.03)',
                        boxShadow: '0 4px 18px #2196f344',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={chat.unread}
                        color="error"
                        invisible={chat.unread === 0}
                        sx={{
                          '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #f44336 60%, #ff7961 100%)',
                            color: '#fff',
                            boxShadow: '0 0 8px #f44336aa',
                            animation: chat.unread ? 'pulse-badge 1.2s infinite' : 'none',
                          }
                        }}
                      >
                        <Avatar
                          src={chat.avatarUrl || undefined}
                          sx={{
                            width: 48,
                            height: 48,
                            border: '3px solid #2196f3',
                            boxShadow: chat.unread ? '0 0 0 4px #2196f355' : 'none',
                            background: '#fff',
                            color: '#2196f3',
                            fontSize: 24,
                            objectFit: 'cover',
                          }}
                        >
                          {!chat.avatarUrl && (chat.type === 'group' ? <GroupIcon /> : <PersonIcon />)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={chat.name}
                      secondary={chat.lastMessage}
                      primaryTypographyProps={{ 
                        color: 'white',
                        fontWeight: chat.unread > 0 ? 600 : 400
                      }}
                      secondaryTypographyProps={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.875rem'
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {chat.timestamp}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Profile Section */}
          <Box sx={{
            p: 2,
            borderTop: '1.5px solid rgba(255,255,255,0.22)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.18)',
            boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
            backdropFilter: 'blur(12px)',
            m: 2,
            position: 'relative',
          }}>
            <Avatar
              src={user.avatarUrl || undefined}
              sx={{
                width: 48,
                height: 48,
                border: '3px solid #2196f3',
                background: '#fff',
                color: '#2196f3',
                fontSize: 24,
                objectFit: 'cover',
              }}
            >
              {!user.avatarUrl && <AccountCircleIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                Your Name
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Online
              </Typography>
            </Box>
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Main Chat Area */}
        <Box sx={{
          flex: 1,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          zIndex: 1
        }}>
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <Box sx={{
                p: 2,
                borderBottom: '1.5px solid rgba(33,150,243,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(255,255,255,0.85)',
                boxShadow: '0 4px 24px 0 rgba(33,150,243,0.08)',
                borderRadius: '0 0 24px 24px',
                zIndex: 3,
                position: 'relative',
              }}>
                <Avatar
                  src={selectedRoom.avatarUrl || undefined}
                  sx={{
                    width: 48,
                    height: 48,
                    border: '3px solid #2196f3',
                    boxShadow: '0 0 0 4px #2196f355',
                    background: '#fff',
                    color: '#2196f3',
                    fontSize: 24,
                    objectFit: 'cover',
                  }}
                >
                  {!selectedRoom.avatarUrl && (selectedRoom.type === 'group' ? <GroupIcon /> : <PersonIcon />)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                    {selectedRoom.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {selectedRoom.type === 'group' ? 'Group • 5 members' : 'Online'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Video Call">
                    <IconButton
                      sx={{
                        color: '#2196f3',
                        fontSize: 28,
                        borderRadius: '50%',
                        transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                        '&:hover': {
                          background: 'rgba(33,150,243,0.08)',
                          color: '#1976d2',
                          boxShadow: '0 2px 8px #2196f344',
                        },
                        mx: 0.5
                      }}
                    >
                      <VideoCallIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Voice Call">
                    <IconButton
                      sx={{
                        color: '#2196f3',
                        fontSize: 28,
                        borderRadius: '50%',
                        transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                        '&:hover': {
                          background: 'rgba(33,150,243,0.08)',
                          color: '#1976d2',
                          boxShadow: '0 2px 8px #2196f344',
                        },
                        mx: 0.5
                      }}
                    >
                      <CallIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {selectedRoom.type === 'group' && (
                    <Tooltip title="Add Member">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="More">
                    <IconButton 
                      onClick={handleMenuOpen}
                      sx={{ color: '#666' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2,
                background: 'rgba(248,250,252,0.8)'
              }}>
                {messages.map((message) => (
                  <Box key={message.id} sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                    animation: 'bubbleIn 0.4s cubic-bezier(.4,2,.6,1)',
                  }}>
                    <Box sx={{
                      maxWidth: '70%',
                      background: message.sender === 'You' ? 'linear-gradient(135deg, #2196f3 80%, #fff 100%)' : 'rgba(255,255,255,0.85)',
                      color: message.sender === 'You' ? 'white' : '#1976d2',
                      p: 2,
                      borderRadius: 18,
                      boxShadow: '0 2px 16px rgba(33,150,243,0.10)',
                      position: 'relative',
                      border: message.sender === 'You' ? '1.5px solid #2196f3' : '1.5px solid #e3f2fd',
                      fontWeight: 500,
                      transition: 'box-shadow 0.18s cubic-bezier(.4,2,.6,1)',
                      '&:hover': {
                        boxShadow: '0 4px 24px #2196f344',
                      },
                    }}>
                      {message.sender !== 'You' && (
                        <Typography variant="caption" sx={{ 
                          color: '#666',
                          display: 'block',
                          mb: 0.5,
                          fontWeight: 500
                        }}>
                          {message.sender}
                        </Typography>
                      )}
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: message.sender === 'You' ? 'rgba(255,255,255,0.7)' : '#999',
                        display: 'block',
                        mt: 0.5,
                        textAlign: 'right'
                      }}>
                        {message.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Message Input */}
              <Box sx={{
                p: 2,
                borderTop: '1.5px solid rgba(33,150,243,0.10)',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                borderRadius: '24px',
                m: 2,
                position: 'relative',
              }}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <Tooltip title="Attach File">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <AttachFileIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Photo">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <ImageIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Video">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <VideoIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="GIF">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <GifIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Tooltip title="Record Voice">
                      <IconButton
                        sx={{
                          color: '#2196f3',
                          fontSize: 28,
                          borderRadius: '50%',
                          transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.08)',
                            color: '#1976d2',
                            boxShadow: '0 2px 8px #2196f344',
                          },
                          mx: 0.5
                        }}
                      >
                        <MicIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Fab
                      color="primary"
                      size="medium"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        background: 'linear-gradient(135deg, #2196f3 80%, #fff 100%)',
                        color: '#1976d2',
                        boxShadow: '0 4px 24px 0 rgba(33,150,243,0.18)',
                        '&:hover': { background: 'linear-gradient(135deg, #1976d2 80%, #fff 100%)', transform: 'scale(1.08)' },
                        transition: 'all 0.2s cubic-bezier(.4,2,.6,1)'
                      }}
                    >
                      <SendIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <ChatIcon sx={{ fontSize: 80, color: '#ccc' }} />
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Info Panel */}
        {showRightPanel && selectedRoom && (
          <Box sx={{ 
            width: 300, 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid rgba(0,0,0,0.1)',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
              {selectedRoom.name}
            </Typography>
            
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="Info" />
              <Tab label="Members" />
              <Tab label="Media" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Group information and settings
                </Typography>
                <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                  Edit Group
                </Button>
                <Button variant="outlined" fullWidth color="error">
                  Leave Group
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Group members
                </Typography>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196f3' }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">Member {i}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Shared media
                </Typography>
                <Grid container spacing={1}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid item xs={4} key={i}>
                      <Box sx={{ 
                        width: '100%', 
                        height: 80, 
                        background: '#f0f0f0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ImageIcon sx={{ color: '#ccc' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Create Room Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Chat Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={createRoom} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Theme</MenuItem>
        <MenuItem onClick={handleMenuClose}>Notifications</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Chat; 