import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCall from './VideoCall';
import AudioCall from './AudioCall';
import GroupSettingsPanel from './GroupSettingsPanel';
import GroupCallRoom from './GroupCallRoom';
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
  Drawer,
  LinearProgress,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert
} from '@mui/material';
import {
  SendRounded as SendIcon,
  AttachFileRounded as AttachFileIcon,
  MicRounded as MicIcon,
  VideocamRounded as VideoIcon,
  MoreVertRounded as MoreVertIcon,
  CallRounded as CallIcon,
  VideoCallRounded as VideoCallIcon,
  GroupRounded as GroupIcon,
  PersonRounded as PersonIcon,
  ChatBubbleRounded as ChatIcon,
  SearchRounded as SearchRoundedIcon,
  DeleteRounded as DeleteIcon,
  DownloadRounded as DownloadIcon,
  EditRounded as EditIcon,
  GifBoxRounded as GifBoxIcon,
  DoneAll,
  Done,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import { useAuth } from '../contexts/AuthContext';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Popover from '@mui/material/Popover';
import { useThemeMode } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DuoIcon from '@mui/icons-material/Duo';
import ChatIconMui from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Contacts from './Contacts';

const Chat = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setThemeMode } = useThemeMode();
  
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const debugSetSelectedRoom = (val, from) => {
    console.log('setSelectedRoom called from', from, 'with', val);
    setSelectedRoom(val);
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Clear search query when component mounts and on user change
  useEffect(() => {
    setSearchQuery('');
    // Clear any stored values
    localStorage.removeItem('searchQuery');
    sessionStorage.removeItem('searchQuery');
  }, []);
  
  // Force clear search query when user changes
  useEffect(() => {
    if (user) {
      setSearchQuery('');
      // Clear any stored values
      localStorage.removeItem('searchQuery');
      sessionStorage.removeItem('searchQuery');
    }
  }, [user]);
  
  // Debug: log search query changes
  useEffect(() => {
    console.log('Search query changed to:', searchQuery);
    if (searchQuery && searchQuery.includes('@')) {
      console.log('Email detected in search query, clearing...');
      setSearchQuery('');
    }
  }, [searchQuery]);
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
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [audioCallOpen, setAudioCallOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [recordMode, setRecordMode] = useState('voice'); // 'voice' or 'video'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState(null); // 'voice' or 'video'
  const fileInputRef = React.useRef();
  // 1. Add state for group avatar
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [callRoomOpen, setCallRoomOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [anchorElEmoji, setAnchorElEmoji] = useState(null);
  const [emojiTargetMessage, setEmojiTargetMessage] = useState(null);
  const emojiList = ['👍','😂','❤️','🔥','🎉','😮','😢','🙏','👏','😡','😍','😎','','🙌','💯','🥳'];
  const [gifDialogOpen, setGifDialogOpen] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [gifResults, setGifResults] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);
  const [readReceipts, setReadReceipts] = useState({}); // messageId -> array of {userId, username, readAt}
  const [uploadError, setUploadError] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalContent, setMediaModalContent] = useState({ type: '', url: '', name: '' });
  const messagesEndRef = React.useRef(null);
  const [mainView, setMainView] = useState('chats'); // 'chats', 'contacts', 'settings'
  const [inputValue, setInputValue] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [profileAvatar, setProfileAvatar] = useState(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState(null);
  const [profileUsername, setProfileUsername] = useState(user?.username || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');
  const [profileSaveMsgColor, setProfileSaveMsgColor] = useState('success.main');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaveMsg, setPasswordSaveMsg] = useState('');
  const [passwordSaveMsgColor, setPasswordSaveMsgColor] = useState('success.main');

  const [profileEditMode, setProfileEditMode] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Save profile handler
  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileSaveMsg('');
    try {
      // Placeholder: implement your API call here
      // Simulate API delay
      await new Promise(res => setTimeout(res, 800));
      setProfileSaveMsg('Profile updated!');
      setProfileSaveMsgColor('success.main');
      // Optionally update user context here
    } catch (e) {
      setProfileSaveMsg('Failed to update profile');
      setProfileSaveMsgColor('error.main');
    }
    setProfileSaving(false);
  };

  // Change password handler
  const handleChangePassword = async () => {
    setPasswordSaving(true);
    setPasswordSaveMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordSaveMsg('Passwords do not match');
      setPasswordSaveMsgColor('error.main');
      setPasswordSaving(false);
      return;
    }
    try {
      // Placeholder: implement your API call here
      await new Promise(res => setTimeout(res, 800));
      setPasswordSaveMsg('Password changed!');
      setPasswordSaveMsgColor('success.main');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordSaveMsg('Failed to change password');
      setPasswordSaveMsgColor('error.main');
    }
    setPasswordSaving(false);
  };

  // Log out handler
  const handleLogout = () => {
    // Placeholder: implement your logout logic here
    if (window.confirm('Are you sure you want to log out?')) {
      // For example, clear auth context and redirect
      window.location.href = '/login';
    }
  };

  // Delete account handler (placeholder)
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Call your API here
      alert('Account deleted (not really, this is a placeholder).');
      setDeleteDialogOpen(false);
      // Optionally redirect or log out
    }
  };

  // Drag-and-drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // File select handler (for both input and drag-drop)
  const handleFileSelect = (file) => {
    setUploadFile(file);
    if (file && file.type.startsWith('image/')) {
      setUploadPreview(URL.createObjectURL(file));
    } else if (file && file.type.startsWith('video/')) {
      setUploadPreview(URL.createObjectURL(file));
    } else {
      setUploadPreview(null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedRoom) return;
    handleFileSelect(file);
  };

  // Upload the file when user confirms
  const handleUploadConfirm = async () => {
    if (!uploadFile || !selectedRoom) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('chatRoomId', selectedRoom.id);
    try {
      const res = await axios.post('http://localhost:8080/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      setMessages(msgs => [...msgs, res.data]);
      setUploadPreview(null);
      setUploadFile(null);
    } catch (err) {
      setUploadError(err?.response?.data?.error || err?.response?.data || 'File upload failed');
      setTimeout(() => setUploadError(''), 5000);
    }
    setUploading(false);
    setUploadProgress(0);
  };

  const handleUploadCancel = () => {
    setUploadPreview(null);
    setUploadFile(null);
    setUploadError('');
  };

  // Define fetchChatRooms with useCallback
  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/chatrooms');
      
      // Fetch the last message for each chat room
      const chatRoomsWithMessages = await Promise.all(
        response.data.map(async (room) => {
          try {
            // Get the last message for this room - get all messages and take the last one
            const messagesResponse = await axios.get(`http://localhost:8080/messages?chatRoomId=${room.id}`);
            const messages = messagesResponse.data;
            
            if (messages.length > 0) {
              const lastMessage = messages[messages.length - 1];
              const isSentByUser = user && (lastMessage.senderId === user.id || lastMessage.sender === user.username || lastMessage.sender === user.email);
              
              // Determine message status
              let messageStatus = null;
              if (isSentByUser) {
                // Check if message has been read
                try {
                  const readReceiptsResponse = await axios.get(`http://localhost:8080/messages/${lastMessage.id}/reads`);
                  const readReceipts = readReceiptsResponse.data;
                  const readCount = readReceipts.length;
                  
                  if (readCount > 1) {
                    messageStatus = 'read'; // Two blue checks
                  } else if (readCount > 0) {
                    messageStatus = 'delivered'; // Two gray checks
                  } else {
                    messageStatus = 'sent'; // One gray check
                  }
                } catch (error) {
                  messageStatus = 'sent'; // Default to sent if can't fetch read receipts
                }
              }
              
              return {
                ...room,
                lastMessage: lastMessage.content,
                lastMessageStatus: messageStatus,
                lastMessageTime: lastMessage.createdAt
              };
            } else {
              return {
                ...room,
                lastMessage: 'No messages yet',
                lastMessageStatus: null,
                lastMessageTime: null
              };
            }
          } catch (error) {
            console.error(`Error fetching last message for room ${room.id}:`, error);
            return {
              ...room,
              lastMessage: 'No messages yet',
              lastMessageStatus: null,
              lastMessageTime: null
            };
          }
        })
      );
      
      setChatRooms(chatRoomsWithMessages);
      if (response.data.length > 0 && !selectedRoom && !isMobile) {
        debugSetSelectedRoom(response.data[0], 'fetchChatRooms');
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  }, [selectedRoom, user]);

  // useEffect after fetchChatRooms definition
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  // Update the useEffect that auto-selects a chat room so it only runs on desktop/tablet
  useEffect(() => {
    if (chatRooms.length > 0 && !selectedRoom && !isMobile) {
      debugSetSelectedRoom(chatRooms[0], 'auto-select chat room');
    }
  }, [chatRooms, selectedRoom, isMobile]);

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

  useEffect(() => {
    if (selectedRoom && messages.length > 0) {
      messages.forEach(async (message) => {
        if (!message.deletedForAll && message.userId !== user?.id) {
          // Mark as read
          try {
            await axios.post(`http://localhost:8080/messages/${message.id}/read`);
          } catch {}
        }
        // Fetch read receipts
        try {
          const res = await axios.get(`http://localhost:8080/messages/${message.id}/reads`);
          setReadReceipts(rr => ({ ...rr, [message.id]: res.data }));
        } catch {}
      });
    }
  }, [selectedRoom, messages, user?.id]);

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
      // Update the chat room's last message and status in the sidebar
      setChatRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === selectedRoom.id 
            ? { 
                ...room, 
                lastMessage: newMessage,
                lastMessageStatus: 'sent', // Initially sent status
                lastMessageTime: new Date().toISOString()
              }
            : room
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to update last message for a specific chat room
  const updateChatRoomLastMessage = async (roomId, messageContent) => {
    setChatRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, lastMessage: messageContent }
          : room
      )
    );
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
    if (!selectedUser || !user) {
      setDialogError('No user selected or not logged in.');
      console.error('handleCreatePrivateChat: selectedUser or user is null', { selectedUser, user });
      return;
    }
    setDialogLoading(true);
    setDialogError('');
    try {
      console.log('Sending /rooms/private request:', { userId: selectedUser.id });
      const res = await axios.post('http://localhost:8080/rooms/private', { userId: selectedUser.id });
      await fetchChatRooms();
      debugSetSelectedRoom({ id: res.data.id, name: res.data.name, type: 'private' }, 'private chat created');
      handleCloseDialog();
    } catch (e) {
      setDialogError('Failed to start chat');
      console.error('handleCreatePrivateChat error:', e);
    } finally {
      setDialogLoading(false);
    }
  };
  // 2. Update handleCreateGroup to allow group with only current user and support avatar
  const handleCreateGroup = async () => {
    if (!groupName.trim() || !user) {
      setDialogError('Group name required or not logged in.');
      console.error('handleCreateGroup: groupName or user is null', { groupName, user });
      return;
    }
    setDialogLoading(true);
    setDialogError('');
    try {
      // Always include current user in group
      let userIds = selectedUsers
        .map(u => typeof u === 'object' && u !== null ? u.id : u)
        .filter(id => typeof id === 'number' && id !== user.id);
      userIds = [user.id, ...userIds];
      // Remove duplicates
      userIds = Array.from(new Set(userIds));
      console.log('Sending /rooms/group request:', { name: groupName, userIds });
      const formData = new FormData();
      formData.append('name', groupName);
      userIds.forEach(id => formData.append('userIds', id));
      if (groupAvatar) formData.append('avatar', groupAvatar);
      // const res = await axios.post('http://localhost:8080/rooms/group', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      const res = await axios.post('http://localhost:8080/chatrooms/group/debug', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchChatRooms();
      debugSetSelectedRoom({ id: res.data.id, name: res.data.name, type: 'group', avatarUrl: res.data.avatarUrl }, 'group chat created');
      handleCloseDialog();
    } catch (e) {
      setDialogError('Failed to create group');
      console.error('handleCreateGroup error:', e);
    } finally {
      setDialogLoading(false);
    }
  };

  // Handle file attachment
  const handleAttachFile = () => {
    fileInputRef.current.click();
  };
  const handleDeleteMessage = async (messageId, forAll = false) => {
    try {
      await axios.delete(`http://localhost:8080/messages/${messageId}?forAll=${forAll}`);
      setMessages(msgs => msgs.filter(m => m.id !== messageId));
    } catch {}
  };

  // Handle tap/long-press for voice/video
  let pressTimer = null;
  const handleRecordButtonDown = () => {
    pressTimer = setTimeout(() => {
      setIsRecording(true);
      setRecordingType(recordMode);
      // TODO: Start recording logic
    }, 400); // Long press threshold
  };
  const handleRecordButtonUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
      if (!isRecording) {
        // Tap: toggle mode
        setRecordMode((prev) => (prev === 'voice' ? 'video' : 'voice'));
      } else {
        // Stop recording
        setIsRecording(false);
        setRecordingType(null);
        // TODO: Stop and send recording
      }
    }
  };

  // 3. Add avatar upload handler
  const handleGroupAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupAvatar(file);
      setGroupAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };
  const handleEditSave = async (messageId) => {
    try {
      await axios.patch(`http://localhost:8080/messages/${messageId}`, { content: editingContent });
      setMessages(msgs => msgs.map(m => m.id === messageId ? { ...m, content: editingContent, editedAt: new Date().toISOString() } : m));
      setEditingMessageId(null);
      setEditingContent('');
    } catch {}
  };
  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };
  const handleOpenEmojiPicker = (event, message) => {
    setAnchorElEmoji(event.currentTarget);
    setEmojiTargetMessage(message);
  };
  const handleCloseEmojiPicker = () => {
    setAnchorElEmoji(null);
    setEmojiTargetMessage(null);
  };
  const handleAddReaction = async (emoji) => {
    if (!emojiTargetMessage) return;
    try {
      await axios.post(`http://localhost:8080/messages/${emojiTargetMessage.id}/reactions?emoji=${encodeURIComponent(emoji)}`);
      setMessages(msgs => msgs.map(m => m.id === emojiTargetMessage.id ? {
        ...m,
        reactions: {
          ...m.reactions,
          [emoji]: m.reactions && m.reactions[emoji] ? [...new Set([...m.reactions[emoji], user?.id])] : [user?.id]
        }
      } : m));
    } catch {}
    handleCloseEmojiPicker();
  };
  const handleRemoveReaction = async (emoji, message) => {
    try {
      await axios.delete(`http://localhost:8080/messages/${message.id}/reactions?emoji=${encodeURIComponent(emoji)}`);
      setMessages(msgs => msgs.map(m => m.id === message.id ? {
        ...m,
        reactions: {
          ...m.reactions,
          [emoji]: m.reactions && m.reactions[emoji] ? m.reactions[emoji].filter(uid => uid !== user?.id) : []
        }
      } : m));
    } catch {}
  };

  const handleOpenGifDialog = () => {
    setGifDialogOpen(true);
    setGifSearch('');
    setGifResults([]);
  };
  const handleCloseGifDialog = () => {
    setGifDialogOpen(false);
    setGifSearch('');
    setGifResults([]);
  };
  const handleGifSearch = async () => {
    if (!gifSearch.trim()) return;
    setGifLoading(true);
    try {
      const apiKey = 'dc6zaTOxFJmzC'; // Giphy public beta key
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(gifSearch)}&api_key=${apiKey}&limit=24`);
      const data = await res.json();
      setGifResults(data.data);
    } catch {}
    setGifLoading(false);
  };
  const handleSendGif = async (gif) => {
    if (!selectedRoom) return;
    try {
      const gifUrl = gif.images.fixed_height.url;
      const response = await axios.post('http://localhost:8080/messages', {
        chatRoomId: selectedRoom.id,
        content: '[GIF]',
        messageType: 'IMAGE',
        fileUrl: gifUrl
      });
      setMessages([...messages, response.data]);
      handleCloseGifDialog();
    } catch {}
  };

  // Add a permanent Saved Messages chat entry
  const handleOpenSavedMessages = async () => {
    if (!user) return;
    try {
      // Try to get or create the self-chat room
      const res = await axios.post('http://localhost:8080/chatrooms/private', { userId: user.id });
      // Ensure the room is in the chat list
      const savedRoom = {
        id: res.data.id,
        name: 'Saved Messages',
        type: 'private',
        avatarUrl: user.avatarUrl
      };
      setChatRooms(prev => {
        // If already present, don't add again
        if (prev.some(r => r.id === savedRoom.id)) return prev;
        return [savedRoom, ...prev];
      });
      debugSetSelectedRoom(savedRoom, 'open saved messages');
    } catch (e) {
      alert('Failed to open Saved Messages');
    }
  };

  // Responsive sidebar width
  const SIDEBAR_WIDTH = 320;

  // Helper to get file extension
  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
  };

  // Helper to render file preview
  const renderFilePreview = (message) => {
    const url = `http://localhost:8080${message.fileUrl}`;
    const ext = getFileExtension(message.fileUrl || message.content);
    if (["jpg","jpeg","png","gif","bmp","webp","tiff","raw","heic"].includes(ext)) {
      return (
        <img
          src={url}
          alt={message.content}
          style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, cursor: 'pointer', width: 'auto', height: 'auto' }}
          onClick={() => handleOpenMediaModal('image', url, message.content)}
        />
      );
    }
    if (["mp4","webm","mov","avi","wmv","flv","mkv","4k","hevc","h265"].includes(ext)) {
      return (
        <video
          src={url}
          controls
          style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, cursor: 'pointer', width: 'auto', height: 'auto' }}
          onClick={() => handleOpenMediaModal('video', url, message.content)}
        />
      );
    }
    if (["mp3","wav","ogg","aac","flac","m4a"].includes(ext)) {
      return <audio src={url} controls style={{ width: '100%', maxWidth: '100%' }} />;
    }
    if (ext === "pdf") {
      return <iframe src={url} style={{ width: '100%', maxWidth: '100%', height: 400, border: 'none' }} title="PDF Preview" />;
    }
    if (["docx","xlsx","pptx"].includes(ext)) {
      const gview = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      return <iframe src={gview} style={{ width: '100%', maxWidth: '100%', height: 400, border: 'none' }} title="Office Preview" />;
    }
    return null; // No preview for this file type
  };

  // Helper to format timestamp
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Open media modal
  const handleOpenMediaModal = (type, url, name) => {
    setMediaModalContent({ type, url, name });
    setMediaModalOpen(true);
  };
  const handleCloseMediaModal = () => {
    setMediaModalOpen(false);
    setMediaModalContent({ type: '', url: '', name: '' });
  };

  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedRoom]);

  console.log('selectedRoom:', selectedRoom, 'mainView:', mainView, 'isMobile:', isMobile);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'black', textAlign: 'center' }}>
        <Box>
          <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            You are not logged in
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Please log in to use Chatly.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Sidebar JSX block
  const sidebarJSX = (
    <Box
      sx={{
        width: isMobile ? '100vw' : 320,
        minWidth: isMobile ? '100vw' : 320,
        maxWidth: isMobile ? '100vw' : 320,
        height: '100%',
        background: theme.palette.mode === 'dark' ? '#232a36' : '#f7fafd',
        borderRight: `1.5px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        boxShadow: 'none',
        transition: 'background 0.4s',
      }}
    >
      {/* Sidebar header: New Chat/Group */}
      <Box sx={{ p: 2, borderBottom: `1.5px solid ${theme.palette.divider}` }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search..."
          value=""
          onChange={e => {
            const value = e.target.value;
            if (!value.includes('@')) {
              setSearchQuery(value);
            }
          }}
          autoComplete="off"
          inputProps={{
            autoComplete: 'off',
            'data-lpignore': 'true',
            'data-form-type': 'other',
            'data-1p-ignore': 'true',
            'data-bwignore': 'true',
            'spellCheck': 'false'
          }}
          sx={{
            background: theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.background.paper,
            '& .MuiInputBase-input': { 
              color: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
              WebkitTextFillColor: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
            },
            '& .MuiInputBase-input::placeholder': { 
              color: theme.palette.mode === 'light' ? '#666 !important' : 'rgba(255, 255, 255, 0.6) !important', 
              opacity: 1,
              WebkitTextFillColor: theme.palette.mode === 'light' ? '#666 !important' : 'rgba(255, 255, 255, 0.6) !important',
            },
            '& .MuiInputAdornment-root': { 
              color: theme.palette.mode === 'light' ? '#666 !important' : '#fff !important' 
            },
            '& input': {
              color: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
              WebkitTextFillColor: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: theme.palette.mode === 'light' ? '#666' : '#fff' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* Chat list always shown in sidebar */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        {chatRooms.map((room) => (
          <Box
            key={room.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.2,
              mb: 0.5,
              borderRadius: 2,
              cursor: 'pointer',
              background: selectedRoom && selectedRoom.id === room.id ? (theme.palette.mode === 'dark' ? '#2c3442' : '#e3eafc') : 'transparent',
              fontWeight: selectedRoom && selectedRoom.id === room.id ? 600 : 400,
              color: theme.palette.text.primary,
              transition: 'background 0.3s',
              '&:hover': {
                background: theme.palette.action.hover,
              },
            }}
            onClick={() => { debugSetSelectedRoom(room, 'chat list click'); setMainView('chats'); }}
          >
            <Avatar src={room.avatarUrl} sx={{ width: 44, height: 44, mr: 1.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{room.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                  {room.lastMessage || 'No messages yet'}
                </Typography>
                {room.lastMessageStatus && (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                    {room.lastMessageStatus === 'read' ? (
                      // Two blue checks for read messages (WhatsApp style)
                      <DoneAll sx={{ 
                        fontSize: 14, 
                        color: '#2196f3', 
                        filter: 'drop-shadow(0 1px 2px rgba(33, 150, 243, 0.3))'
                      }} />
                    ) : room.lastMessageStatus === 'delivered' ? (
                      // Two gray checks for delivered messages (WhatsApp style)
                      <DoneAll sx={{ 
                        fontSize: 14, 
                        color: '#bdbdbd',
                        filter: 'drop-shadow(0 1px 2px rgba(189, 189, 189, 0.3))'
                      }} />
                    ) : room.lastMessageStatus === 'sent' ? (
                      // One gray check for sent messages (WhatsApp style)
                      <DoneAll sx={{ 
                        fontSize: 14, 
                        color: '#bdbdbd',
                        filter: 'drop-shadow(0 1px 2px rgba(189, 189, 189, 0.3))'
                      }} />
                    ) : null}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {/* Bottom navigation bar: only in sidebar */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        borderTop: 'none',
        background: theme.palette.mode === 'dark' ? '#20232a' : '#e9eef6',
        minHeight: 56,
        position: 'sticky',
        bottom: 0,
        zIndex: 300,
        '& > *': {
          flex: '0 0 auto !important',
          minWidth: 'auto !important',
          maxWidth: 'none !important',
          transform: 'none !important',
        }
      }}>
        <IconButton 
          color={mainView === 'contacts' ? 'primary' : 'default'} 
          onClick={() => { setMainView('contacts'); setSelectedRoom(null); setSearchQuery(''); }}
          sx={{ 
            width: 56,
            height: 56,
            flex: '0 0 auto !important',
            minWidth: 'auto !important',
            maxWidth: 'none !important',
            '& svg': {
              width: '32px !important',
              height: '32px !important',
              transform: 'none !important',
            }
          }}
        >
          <GroupIcon fontSize="large" />
        </IconButton>
        <IconButton 
          color={mainView === 'chats' ? 'primary' : 'default'} 
          onClick={() => { setMainView('chats'); setSelectedRoom(null); setSearchQuery(''); }}
          sx={{ 
            width: 56,
            height: 56,
            flex: '0 0 auto !important',
            minWidth: 'auto !important',
            maxWidth: 'none !important',
            '& svg': {
              width: '32px !important',
              height: '32px !important',
              transform: 'none !important',
            }
          }}
        >
          <ChatIconMui fontSize="large" />
        </IconButton>
        <IconButton 
          color={mainView === 'settings' ? 'primary' : 'default'} 
          onClick={() => { setMainView('settings'); setSearchQuery(''); }}
          sx={{ 
            width: 56,
            height: 56,
            flex: '0 0 auto !important',
            minWidth: 'auto !important',
            maxWidth: 'none !important',
            '& svg': {
              width: '32px !important',
              height: '32px !important',
              transform: 'none !important',
            }
          }}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );

  // Chat area JSX block
  const chatAreaJSX = (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme.palette.mode === 'dark' ? '#181c24' : '#fff',
        position: 'relative',
        overflowX: 'hidden',
        maxWidth: '100%',
      }}
    >
      {mainView === 'chats' && selectedRoom && (
        <>
          {/* Header */}
          <Box sx={{ flex: '0 0 auto', px: 3, py: 2, background: theme.palette.mode === 'dark' ? '#232a36' : '#f7fafd', borderBottom: `1.5px solid ${theme.palette.divider}`, position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Mobile back button */}
              {isMobile && (
                <IconButton onClick={() => { debugSetSelectedRoom(null, 'back button'); setMainView('chats'); setSidebarOpen(true); }} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Avatar
                src={selectedRoom?.avatarUrl}
                sx={{ width: 44, height: 44, mr: 2, cursor: 'pointer' }}
                onClick={() => setMainView('settings')}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setMainView('settings')}
              >
                {selectedRoom?.name}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => setVideoCallOpen(true)}><DuoIcon /></IconButton>
              <IconButton onClick={() => setAudioCallOpen(true)}><CallIcon /></IconButton>
              <IconButton><SearchRoundedIcon /></IconButton>
            </Box>
          </Box>
          {/* Message list (scrollable) */}
          <Box sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'scroll',
            px: 0,
            py: 3,
            display: 'block',
            maxWidth: '100%',
            overflowX: 'hidden',
            // Hide scrollbar but keep scrolling
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          }}>
            <Box sx={{ width: '100%', ml: 'auto', mr: '24px', pr: 0, pl: 0 }}>
              {messages.filter(message => !message.deletedForAll).map((message) => {
                const isSent = user && (message.senderId === user.id || message.sender === user.username || message.sender === user.email);
                const preview = renderFilePreview(message);
                // Message status logic
                let markIcon = null;
                if (isSent) {
                  // Example logic: deliveredTo and readBy arrays
                  const deliveredCount = message.deliveredTo ? message.deliveredTo.length : 0;
                  const readCount = message.readBy ? message.readBy.length : 0;
                  if (readCount > 1) {
                    // Two blue checks for read messages (WhatsApp style)
                    markIcon = (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                        <DoneAll sx={{ 
                          fontSize: 16, 
                          color: '#2196f3', 
                          filter: 'drop-shadow(0 1px 2px rgba(33, 150, 243, 0.3))'
                        }} />
                      </Box>
                    );
                  } else if (deliveredCount > 1) {
                    // Two gray checks for delivered messages (WhatsApp style)
                    markIcon = (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                        <DoneAll sx={{ 
                          fontSize: 16, 
                          color: '#bdbdbd',
                          filter: 'drop-shadow(0 1px 2px rgba(189, 189, 189, 0.3))'
                        }} />
                      </Box>
                    );
                  } else {
                    // Two gray checks for sent messages (WhatsApp style) - using DoneAll instead of Done
                    markIcon = (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                        <DoneAll sx={{ 
                          fontSize: 16, 
                          color: '#bdbdbd',
                          filter: 'drop-shadow(0 1px 2px rgba(189, 189, 189, 0.3))'
                        }} />
                      </Box>
                    );
                  }
                }
                return (
                  <Box key={message.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start', mb: 0.5, mr: isSent ? 2 : 0 }}>
                    <Paper elevation={1} sx={{
                      p: 1.5,
                      maxWidth: '100%',
                      borderRadius: isSent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isSent ? '#20b95a' : '#0088cc',
                      color: '#fff',
                      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
                      fontWeight: 400,
                      fontSize: 16,
                      mb: 0.5,
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                      overflowX: 'hidden',
                      transition: 'background 0.4s, color 0.4s',
                    }}>
                      {preview ? (
                        // If preview (image, video, etc.), show with marks and timestamp
                        <Box>
                          {preview}
                          {isSent && (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'flex-end', 
                              mt: 1,
                              gap: 0.5
                            }}>
                              <Typography variant="caption" sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                fontSize: '0.75rem',
                                fontWeight: 400
                              }}>
                                {formatTime(message.createdAt)}
                              </Typography>
                              {markIcon}
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Typography variant="body1" sx={{ color: '#fff', mb: 0, flex: 1 }}>
                            {message.content}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            whiteSpace: 'nowrap'
                          }}>
                            {formatTime(message.createdAt)}
                          </Typography>
                          {isSent && markIcon}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                );
              })}
              <Box ref={messagesEndRef} />
            </Box>
          </Box>
          {/* Input area */}
          <Box sx={{ flex: '0 0 auto', width: '100%', ml: 0, mr: 0, pr: 0, pl: 0, py: 1.5, background: theme.palette.mode === 'dark' ? '#232a36' : '#f7fafd', borderTop: `1.5px solid ${theme.palette.divider}`, position: 'sticky', bottom: 0, zIndex: 120, display: 'flex', minWidth: 0, alignItems: 'center', gap: 1.5, overflowX: 'hidden', maxWidth: '100%' }}>
            <IconButton><AttachFileIcon /></IconButton>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                background: theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.background.paper,
                '& .MuiInputBase-input': { 
                  color: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
                  WebkitTextFillColor: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
                },
                '& .MuiInputBase-input::placeholder': { 
                  color: theme.palette.mode === 'light' ? '#666 !important' : 'rgba(255, 255, 255, 0.6) !important', 
                  opacity: 1,
                  WebkitTextFillColor: theme.palette.mode === 'light' ? '#666 !important' : 'rgba(255, 255, 255, 0.6) !important',
                },
                '& .MuiInputAdornment-root': { 
                  color: theme.palette.mode === 'light' ? '#666 !important' : '#fff !important' 
                },
                '& input': {
                  color: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
                  WebkitTextFillColor: theme.palette.mode === 'light' ? '#000 !important' : '#fff !important',
                },
                maxWidth: '100%'
              }}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <IconButton color="primary" onClick={sendMessage}><SendIcon /></IconButton>
          </Box>
        </>
      )}
      {/* Contacts and Settings views */}
      {mainView === 'contacts' && (
        <Contacts
          users={users}
          handleOpenNewChat={handleOpenNewChat}
          handleOpenNewGroup={handleOpenNewGroup}
          onNav={setMainView}
          mainView={mainView}
        />
      )}
      {mainView === 'settings' && (
        <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 500, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => setMainView('chats')} sx={{ alignSelf: 'flex-start', mb: 1 }}>Back</Button>

          {/* Profile Section */}
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Profile</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={profileAvatarPreview || (user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : undefined)} sx={{ width: 64, height: 64, bgcolor: '#2196f3', fontSize: 32 }}>
                  {user?.username ? user.username[0].toUpperCase() : '?'}
                </Avatar>
                <input accept="image/*" style={{ display: 'none' }} id="avatar-upload" type="file" onChange={e => { const file = e.target.files[0]; if (file) { setProfileAvatar(file); setProfileAvatarPreview(URL.createObjectURL(file)); setProfileEditMode(true); } }} />
                <label htmlFor="avatar-upload">
                  <IconButton size="small" component="span" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </label>
              </Box>
              <Box sx={{ flex: 1 }}>
                {profileEditMode ? (
                  <TextField label="Username" value={profileUsername} onChange={e => setProfileUsername(e.target.value)} fullWidth variant="outlined" sx={{ mb: 1, '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : undefined } }} />
                ) : (
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{user?.username}</Typography>
                )}
                <Typography variant="body2" color="text.secondary">{user?.email || ''}</Typography>
              </Box>
            </Box>
            {profileEditMode ? (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="contained" color="primary" onClick={handleProfileSave} disabled={profileSaving}>{profileSaving ? 'Saving...' : 'Save'}</Button>
                <Button variant="outlined" onClick={() => { setProfileEditMode(false); setProfileAvatar(null); setProfileAvatarPreview(null); setProfileUsername(user?.username || ''); }}>Cancel</Button>
              </Box>
            ) : (
              <Button variant="outlined" onClick={() => setProfileEditMode(true)}>Edit Profile</Button>
            )}
          </Card>

          <Divider />

          {/* Theme Section */}
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Theme</Typography>
            <Switch checked={mode === 'dark'} onChange={() => setThemeMode(mode === 'dark' ? 'light' : 'dark')} />
            <Typography>{mode === 'dark' ? 'Dark' : 'Light'}</Typography>
          </Card>

          <Divider />

          {/* Password Section */}
          <Card sx={{ p: 3 }}>
            <Accordion elevation={0} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Change Password</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField label="Old Password" type={showOldPassword ? 'text' : 'password'} value={oldPassword} onChange={e => setOldPassword(e.target.value)} fullWidth variant="outlined" sx={{ mb: 1, '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : undefined } }} InputProps={{ endAdornment: <IconButton onClick={() => setShowOldPassword(v => !v)}>{showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton> }} />
                <TextField label="New Password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth variant="outlined" sx={{ mb: 1, '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : undefined } }} InputProps={{ endAdornment: <IconButton onClick={() => setShowNewPassword(v => !v)}>{showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton> }} />
                {/* Password strength meter */}
                {newPassword && <Box sx={{ mb: 1 }}><LinearProgress variant="determinate" value={passwordStrength(newPassword)} sx={{ height: 8, borderRadius: 2, background: '#eee' }} /><Typography variant="caption" color="text.secondary">Strength: {passwordStrengthLabel(newPassword)}</Typography></Box>}
                <TextField label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth variant="outlined" sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : undefined } }} InputProps={{ endAdornment: <IconButton onClick={() => setShowConfirmPassword(v => !v)}>{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton> }} />
                <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={passwordSaving} fullWidth>{passwordSaving ? 'Saving...' : 'Change Password'}</Button>
              </AccordionDetails>
            </Accordion>
          </Card>

          <Divider />

          {/* Account Section */}
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Account</Typography>
            <Button variant="outlined" color="error" onClick={handleLogout} fullWidth>Log Out</Button>
            <Button variant="text" color="error" onClick={() => setDeleteDialogOpen(true)} fullWidth>Delete Account</Button>
          </Card>

          {/* Delete Account Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button color="error" onClick={handleDeleteAccount}>Delete</Button>
            </DialogActions>
          </Dialog>

          {/* Feedback Snackbar */}
          <Snackbar open={!!profileSaveMsg} autoHideDuration={3000} onClose={() => setProfileSaveMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setProfileSaveMsg('')} severity={profileSaveMsgColor === 'success.main' ? 'success' : 'error'} sx={{ width: '100%' }}>
              {profileSaveMsg}
            </Alert>
          </Snackbar>
          <Snackbar open={!!passwordSaveMsg} autoHideDuration={3000} onClose={() => setPasswordSaveMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setPasswordSaveMsg('')} severity={passwordSaveMsgColor === 'success.main' ? 'success' : 'error'} sx={{ width: '100%' }}>
              {passwordSaveMsg}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Box>
  );

  // Main render: explicit mobile/desktop switch
  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: '100vh', height: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {isMobile ? (
        selectedRoom ? chatAreaJSX : sidebarJSX
      ) : (
        <Box sx={{ display: 'flex', minWidth: 0, width: '100%', height: '100vh', minHeight: 0, overflowX: 'hidden' }}>
          {sidebarJSX}
          {chatAreaJSX}
        </Box>
      )}
      {/* Dialogs */}
      <Dialog open={newChatMode === 'private'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Start New Chat</Typography>
            <Button variant="outlined" onClick={() => {
              setSelectedUser(user);
              setTimeout(() => {
                console.log('Chat with Myself: userId', user.id);
                handleCreatePrivateChat();
              }, 0);
            }}>
              Chat with Myself
            </Button>
          </Box>
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
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography color="error" variant="body2">{dialogError}</Typography>
            </Box>
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

      {/* 4. In the group creation dialog, add avatar upload and remove min participant restriction */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="group-avatar-upload"
              type="file"
              onChange={handleGroupAvatarChange}
            />
            <label htmlFor="group-avatar-upload">
              <Button variant="outlined" component="span">
                Upload Avatar
              </Button>
            </label>
            {groupAvatarPreview && (
              <Avatar src={groupAvatarPreview} sx={{ ml: 2, width: 48, height: 48 }} />
            )}
          </Box>
          <Autocomplete
            multiple
            options={users.filter(u => u.id !== user?.id)}
            getOptionLabel={(option) => option.username}
            value={selectedUsers}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select members (optional)"
                fullWidth
                margin="normal"
              />
            )}
          />
          {dialogError && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography color="error" variant="body2">{dialogError}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateGroup} 
            disabled={!groupName.trim() || dialogLoading}
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
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mute Notifications</MenuItem>
        <MenuItem onClick={handleMenuClose}>Clear Chat</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete Chat</MenuItem>
      </Menu>

      {/* Video Call Component */}
      <VideoCall
        isOpen={videoCallOpen}
        onClose={() => setVideoCallOpen(false)}
        targetUser={targetUser}
        currentUser={user}
      />

      {/* Audio Call Component */}
      <AudioCall
        isOpen={audioCallOpen}
        onClose={() => setAudioCallOpen(false)}
        targetUser={targetUser}
        currentUser={user}
      />

      <GroupSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        group={selectedRoom}
        currentUser={user}
        onGroupUpdated={updated => {
          debugSetSelectedRoom(prev => ({ ...prev, ...updated }), 'group settings updated');
          fetchChatRooms();
        }}
        onGroupDeleted={id => {
          debugSetSelectedRoom(null, 'group deleted');
          fetchChatRooms();
        }}
      />
      <GroupCallRoom
        open={callRoomOpen}
        onClose={() => setCallRoomOpen(false)}
        group={selectedRoom}
        currentUser={user}
      />

      {/* Media Modal */}
      <Dialog open={mediaModalOpen} onClose={handleCloseMediaModal} maxWidth="md" fullWidth>
        <DialogTitle>{mediaModalContent.name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          {mediaModalContent.type === 'image' && (
            <img src={mediaModalContent.url} alt={mediaModalContent.name} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12 }} />
          )}
          {mediaModalContent.type === 'video' && (
            <video src={mediaModalContent.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMediaModal}>Close</Button>
          <Button href={mediaModalContent.url} download variant="contained">Download</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Password strength: returns 0-100
const passwordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score += 30;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  if (password.length >= 12) score += 10;
  return Math.min(score, 100);
};

// Password strength label
const passwordStrengthLabel = (password) => {
  const score = passwordStrength(password);
  if (score >= 80) return 'Strong';
  if (score >= 50) return 'Medium';
  if (score > 0) return 'Weak';
  return '';
};

export default Chat; 