import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Button,
  Alert,
  Chip
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Chat as ChatIcon,
  Videocam as VideoIcon,
  Phone as PhoneIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import TestBotPanel from './TestBotPanel';
import Chat from './Chat';

const TestPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [chatRoomId, setChatRoomId] = useState(1); // Default chat room
  const [refreshChat, setRefreshChat] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMessageSent = () => {
    // Trigger chat refresh when bot sends a message
    setRefreshChat(prev => prev + 1);
  };

  const testScenarios = [
    {
      title: "Basic Text Messaging",
      description: "Test sending and receiving text messages",
      steps: [
        "1. Go to 'Chat Interface' tab",
        "2. Send a text message",
        "3. Use TestBot to send random text messages",
        "4. Verify messages appear in real-time"
      ]
    },
    {
      title: "File Upload & Sharing",
      description: "Test file upload and sharing capabilities",
      steps: [
        "1. Use TestBot to send different file types",
        "2. Upload files from your device",
        "3. Test image, video, audio, and document files",
        "4. Verify file previews and downloads"
      ]
    },
    {
      title: "Voice & Video Messages",
      description: "Test audio and video message features",
      steps: [
        "1. Use TestBot to send audio messages",
        "2. Use TestBot to send video messages",
        "3. Record and send your own voice messages",
        "4. Test video message recording"
      ]
    },
    {
      title: "Call Features",
      description: "Test voice and video calling",
      steps: [
        "1. Use TestBot to simulate call events",
        "2. Test call button functionality",
        "3. Verify call status messages",
        "4. Test video call simulation"
      ]
    },
    {
      title: "Bulk Testing",
      description: "Test system performance with multiple messages",
      steps: [
        "1. Use TestBot bulk testing features",
        "2. Send 5, 10, or 20 messages at once",
        "3. Monitor system performance",
        "4. Check message ordering and display"
      ]
    },
    {
      title: "Interactive Testing",
      description: "Test bot auto-responses and interactions",
      steps: [
        "1. Send messages to TestBot",
        "2. Try commands like 'send image', 'send video'",
        "3. Test auto-response functionality",
        "4. Use help commands"
      ]
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🧪 Flamegram Testing Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive testing interface for all chat features
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<BotIcon />} 
            label="TestBot Control" 
            iconPosition="start"
          />
          <Tab 
            icon={<ChatIcon />} 
            label="Chat Interface" 
            iconPosition="start"
          />
          <Tab 
            icon={<VideoIcon />} 
            label="Video Call Test" 
            iconPosition="start"
          />
          <Tab 
            icon={<PhoneIcon />} 
            label="Audio Call Test" 
            iconPosition="start"
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="Test Scenarios" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* TestBot Control Panel */}
      {activeTab === 0 && (
        <TestBotPanel 
          chatRoomId={chatRoomId} 
          onMessageSent={handleMessageSent}
        />
      )}

      {/* Chat Interface */}
      {activeTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Chat Room ID:</strong> {chatRoomId} | 
              Use the TestBot Control panel to send test messages to this chat.
            </Typography>
          </Alert>
          <Chat 
            key={refreshChat} // Force refresh when messages are sent
            selectedChatRoom={chatRoomId}
            isTestMode={true}
          />
        </Box>
      )}

      {/* Video Call Test */}
      {activeTab === 2 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            📹 Video Call Testing
          </Typography>
          <Typography variant="body1" paragraph>
            Video call testing interface will be implemented here.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // Simulate video call
              console.log('Video call test initiated');
            }}
          >
            Start Video Call Test
          </Button>
        </Paper>
      )}

      {/* Audio Call Test */}
      {activeTab === 3 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            📞 Audio Call Testing
          </Typography>
          <Typography variant="body1" paragraph>
            Audio call testing interface will be implemented here.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => {
              // Simulate audio call
              console.log('Audio call test initiated');
            }}
          >
            Start Audio Call Test
          </Button>
        </Paper>
      )}

      {/* Test Scenarios */}
      {activeTab === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            📋 Testing Scenarios & Guidelines
          </Typography>
          
          <Grid container spacing={3}>
            {testScenarios.map((scenario, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      label={`Scenario ${index + 1}`} 
                      color="primary" 
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="h6">
                      {scenario.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {scenario.description}
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {scenario.steps.map((step, stepIndex) => (
                      <Typography 
                        key={stepIndex} 
                        component="li" 
                        variant="body2"
                        sx={{ mb: 0.5 }}
                      >
                        {step}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Quick Test Commands
            </Typography>
            <Typography variant="body2" paragraph>
              You can also test by typing these commands in the chat:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="send image" color="primary" />
              <Chip label="send video" color="primary" />
              <Chip label="send audio" color="primary" />
              <Chip label="send file" color="primary" />
              <Chip label="help" color="secondary" />
              <Chip label="hello" color="secondary" />
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default TestPage; 