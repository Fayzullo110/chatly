import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Send as SendIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  Mic as AudioIcon,
  AttachFile as FileIcon,
  Phone as CallIcon,
  VideoCall as VideoCallIcon,
  Help as HelpIcon,
  Assessment as StatsIcon,
  ExpandMore as ExpandMoreIcon,
  Message as MessageIcon,
  AutoAwesome as AutoIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import axios from 'axios';

const TestBotPanel = ({ chatRoomId: propChatRoomId, onMessageSent }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [botStats, setBotStats] = useState('');
  const [commands, setCommands] = useState({});
  const [botRoomId, setBotRoomId] = useState(null);
  const [botUser, setBotUser] = useState(null);

  useEffect(() => {
    fetchBotInfo();
    initializeBot();
    loadCommands();
  }, []);

  const fetchBotInfo = async () => {
    try {
      const res = await axios.get('http://localhost:8080/testbot/info');
      setBotRoomId(res.data.botRoom.id);
      setBotUser(res.data.botUser);
    } catch (err) {
      setError('Failed to fetch bot info: ' + err.message);
    }
  };

  const getActiveRoomId = () => {
    return propChatRoomId || botRoomId;
  };

  const initializeBot = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8080/testbot/initialize');
      setResponse(`✅ ${res.data.message}`);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      setError('Failed to initialize bot: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCommands = async () => {
    try {
      const res = await axios.get('http://localhost:8080/testbot/commands');
      setCommands(res.data);
    } catch (err) {
      console.error('Failed to load commands:', err);
    }
  };

  const sendBotMessage = async (endpoint, params = {}) => {
    try {
      setLoading(true);
      setError('');
      const roomId = getActiveRoomId();
      const res = await axios.post(`http://localhost:8080/testbot/${endpoint}`, null, {
        params: { chatRoomId: roomId, ...params }
      });
      setResponse(`✅ ${res.data.message}`);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBotStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/testbot/stats');
      setBotStats(res.data.stats);
    } catch (err) {
      setError('Failed to get stats: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testFeatures = [
    {
      title: 'Text Messages',
      icon: <MessageIcon />,
      actions: [
        {
          label: 'Send Random Text',
          action: () => sendBotMessage('send/random-text'),
          color: 'primary'
        },
        {
          label: 'Send Custom Text',
          action: () => {
            if (message.trim()) {
              sendBotMessage('send/text', { message: message.trim() });
              setMessage('');
            }
          },
          color: 'secondary'
        }
      ]
    },
    {
      title: 'Media Messages',
      icon: <ImageIcon />,
      actions: [
        {
          label: 'Send Image',
          action: () => sendBotMessage('send/image'),
          color: 'success'
        },
        {
          label: 'Send Video',
          action: () => sendBotMessage('send/video'),
          color: 'info'
        },
        {
          label: 'Send Audio',
          action: () => sendBotMessage('send/audio'),
          color: 'warning'
        },
        {
          label: 'Send File',
          action: () => sendBotMessage('send/file'),
          color: 'error'
        }
      ]
    },
    {
      title: 'Call Simulation',
      icon: <CallIcon />,
      actions: [
        {
          label: 'Simulate Call',
          action: () => sendBotMessage('send/call-started'),
          color: 'primary'
        },
        {
          label: 'Simulate Video Call',
          action: () => sendBotMessage('send/video-call-started'),
          color: 'secondary'
        }
      ]
    },
    {
      title: 'Interactive Features',
      icon: <AutoIcon />,
      actions: [
        {
          label: 'Send Help Message',
          action: () => sendBotMessage('send/interactive'),
          color: 'info'
        },
        {
          label: 'Auto-Respond Test',
          action: () => {
            if (message.trim()) {
              sendBotMessage('auto-respond', { userMessage: message.trim() });
              setMessage('');
            }
          },
          color: 'success'
        }
      ]
    },
    {
      title: 'Bulk Testing',
      icon: <SpeedIcon />,
      actions: [
        {
          label: 'Send 5 Messages',
          action: () => sendBotMessage('bulk-test', { count: 5 }),
          color: 'primary'
        },
        {
          label: 'Send 10 Messages',
          action: () => sendBotMessage('bulk-test', { count: 10 }),
          color: 'secondary'
        },
        {
          label: 'Send 20 Messages',
          action: () => sendBotMessage('bulk-test', { count: 20 }),
          color: 'warning'
        }
      ]
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BotIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          TestBot Control Panel
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {response}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Custom Message Input */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send Custom Message
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (message.trim()) {
                      sendBotMessage('send/text', { message: message.trim() });
                      setMessage('');
                    }
                  }}
                  disabled={loading || !message.trim()}
                  startIcon={<SendIcon />}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Features */}
        {testFeatures.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {feature.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outlined"
                      color={action.color}
                      onClick={action.action}
                      disabled={loading}
                      fullWidth
                      size="small"
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StatsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Bot Statistics
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={getBotStats}
                disabled={loading}
                startIcon={<StatsIcon />}
                sx={{ mb: 2 }}
              >
                Get Statistics
              </Button>
              {botStats && (
                <Box sx={{ 
                  backgroundColor: 'grey.100', 
                  p: 2, 
                  borderRadius: 1,
                  whiteSpace: 'pre-line',
                  fontFamily: 'monospace'
                }}>
                  {botStats}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Commands Reference */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Available Commands
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {commands.commands && Object.entries(commands.commands).map(([key, description]) => (
                  <ListItem key={key}>
                    <ListItemIcon>
                      <Chip label={key} size="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={description} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};

export default TestBotPanel; 