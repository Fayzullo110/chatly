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
  Button,
  CircularProgress,
  Autocomplete,
  useTheme,
  useMediaQuery,
  Drawer
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
  InsertDriveFile as FileIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { user, token } = useAuth();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
  const [newChatMode, setNewChatMode] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Fetch chat rooms on component mount
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // Fetch messages when room is selected
  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      if (isMobile) {
        setSidebarOpen(false); // Close sidebar on mobile when room is selected
      }
    }
  }, [selectedRoom, isMobile]);

  // Fetch group members when right panel is opened and selectedRoom is a group
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (showRightPanel && selectedRoom && selectedRoom.type === 'group') {
        try {
          const res = await axios.get(`http://localhost:8080/rooms/${selectedRoom.id}/members`);
          setGroupMembers(res.data);
        } catch (e) {
          setGroupMembers([]);
        }
      }
    };
    fetchGroupMembers();
  }, [showRightPanel, selectedRoom]);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/chatrooms');
      setChatRooms(response.data);
      if (response.data.length > 0 && !selectedRoom) {
        setSelectedRoom(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await axios.get(`http://localhost:8080/messages?chatRoomId=${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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

  // Fetch users for dialogs
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/users');
      setUsers(res.data);
    } catch (e) {
      setDialogError('Failed to load users');
    }
  };

  // Open New Chat dialog
  const handleOpenNewChat = () => {
    setNewChatMode('private');
    setDialogError('');
    setSelectedUser(null);
    fetchUsers();
  };
  // Open New Group dialog
  const handleOpenNewGroup = () => {
    setNewChatMode('group');
    setDialogError('');
    setSelectedUsers([]);
    setGroupName('');
    fetchUsers();
  };
  // Close dialog
  const handleCloseDialog = () => {
    setNewChatMode(null);
    setDialogError('');
    setSelectedUser(null);
    setSelectedUsers([]);
    setGroupName('');
  };

  // Create or find private chat
  const handleCreatePrivateChat = async () => {
    if (!selectedUser) return;
    setDialogLoading(true);
    setDialogError('');
    try {
      const res = await axios.post('http://localhost:8080/rooms/private', { userId: selectedUser.id });
      await fetchChatRooms();
      setSelectedRoom({ id: res.data.id, name: res.data.name, type: 'private' });
      handleCloseDialog();
    } catch (e) {
      setDialogError('Failed to start chat');
    } finally {
      setDialogLoading(false);
    }
  };
  // Create group chat
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    setDialogLoading(true);
    setDialogError('');
    try {
      const res = await axios.post('http://localhost:8080/rooms/group', {
        name: groupName,
        userIds: selectedUsers.map(u => u.id)
      });
      await fetchChatRooms();
      setSelectedRoom({ id: res.data.id, name: res.data.name, type: 'group' });
      handleCloseDialog();
    } catch (e) {
      setDialogError('Failed to create group');
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Box className="modern-chat-bg" sx={{
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: theme.palette.text.primary,
      py: 0,
      pb: isMobile ? '70px' : 0 // Space for mobile nav
    }}>
      <Container maxWidth={false} disableGutters sx={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
        
        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            PaperProps={{
              sx: {
                width: '100%',
                background: 'rgba(33,150,243,0.18)',
                backdropFilter: 'blur(18px)',
                borderRight: '1.5px solid rgba(255,255,255,0.35)',
                color: 'white'
              }
            }}
          >
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={handleOpenNewChat}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 16px 0 rgba(33,150,243,0.12)',
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1,
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
                  onClick={handleOpenNewGroup}
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 16px 0 rgba(33,150,243,0.12)',
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1,
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
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 12,
                                minWidth: 20,
                                height: 20,
                                borderRadius: 10,
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                                boxShadow: '0 4px 12px #2196f344',
                              }}
                            >
                              {chat.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              }}
                            >
                              {chat.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: 14,
                              }}
                            >
                              {chat.lastMessage || 'No messages yet'}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Drawer>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
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
                onClick={handleOpenNewChat}
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
                onClick={handleOpenNewGroup}
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
                              color: 'white',
                              fontWeight: 600,
                              fontSize: 12,
                              minWidth: 20,
                              height: 20,
                              borderRadius: 10,
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                              boxShadow: '0 4px 12px #2196f344',
                            }}
                          >
                            {chat.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            }}
                          >
                            {chat.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 14,
                            }}
                          >
                            {chat.lastMessage || 'No messages yet'}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Chat Header */}
          <Box sx={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(18px)',
            borderBottom: '1.5px solid rgba(255,255,255,0.25)',
            p: isMobile ? 1.5 : 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: 'white'
          }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {selectedRoom ? (
              <>
                <Avatar
                  sx={{
                    width: isMobile ? 40 : 48,
                    height: isMobile ? 40 : 48,
                    background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                    boxShadow: '0 4px 12px #2196f344',
                  }}
                >
                  {selectedRoom.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, color: 'white' }}>
                    {selectedRoom.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {selectedRoom.type === 'group' ? 'Group Chat' : 'Private Chat'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    sx={{
                      color: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <CallIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <VideoCallIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      color: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, color: 'white' }}>
                Select a chat to start messaging
              </Typography>
            )}
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: isMobile ? 1 : 2,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            {selectedRoom ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.userId === user?.id ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: isMobile ? '80%' : '60%',
                        background: message.userId === user?.id 
                          ? 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)'
                          : 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        p: isMobile ? 1.5 : 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontWeight: 500, mb: 0.5 }}>
                        {message.userId === user?.id ? 'You' : message.username}
                      </Typography>
                      <Typography sx={{ color: 'white', lineHeight: 1.5 }}>
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          display: 'block', 
                          mt: 1,
                          fontSize: '12px'
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'white',
                textAlign: 'center'
              }}>
                <Box>
                  <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 1 }}>
                    Welcome to Chatly
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Select a chat from the sidebar to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Message Input */}
          {selectedRoom && (
            <Box sx={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(18px)',
              borderTop: '1.5px solid rgba(255,255,255,0.25)',
              p: isMobile ? 1.5 : 2,
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <IconButton
                  sx={{
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      color: 'white',
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid rgba(255,255,255,0.5)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.6)',
                        opacity: 1
                      }
                    }
                  }}
                />
                <IconButton
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    color: 'white',
                    background: 'linear-gradient(135deg, #2196f3 60%, #4facfe 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976d2 60%, #4facfe 100%)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* Dialogs */}
      <Dialog open={newChatMode === 'private'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={users.filter(u => u.id !== user?.id)}
            getOptionLabel={(option) => option.username}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select user"
                fullWidth
                margin="normal"
              />
            )}
          />
          {dialogError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {dialogError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreatePrivateChat} 
            disabled={!selectedUser || dialogLoading}
            variant="contained"
          >
            {dialogLoading ? 'Creating...' : 'Start Chat'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newChatMode === 'group'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <Autocomplete
            multiple
            options={users.filter(u => u.id !== user?.id)}
            getOptionLabel={(option) => option.username}
            value={selectedUsers}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select members"
                fullWidth
                margin="normal"
              />
            )}
          />
          {dialogError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {dialogError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateGroup} 
            disabled={!groupName.trim() || selectedUsers.length === 0 || dialogLoading}
            variant="contained"
          >
            {dialogLoading ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mute Notifications</MenuItem>
        <MenuItem onClick={handleMenuClose}>Clear Chat</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete Chat</MenuItem>
      </Menu>
    </Box>
  );
};

export default Chat; 