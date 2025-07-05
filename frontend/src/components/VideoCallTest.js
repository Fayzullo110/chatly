import React, { useState } from 'react';
import VideoCall from './VideoCall';
import { Box, Button, Typography, Container, Paper } from '@mui/material';

const VideoCallTest = () => {
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [testUser] = useState({ username: 'TestUser' });
  const [currentUser] = useState({ username: 'CurrentUser' });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Video Call Test
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          This is a test page to demonstrate the video calling functionality.
          Click the button below to start a video call.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setVideoCallOpen(true)}
            sx={{ minWidth: 200 }}
          >
            Start Video Call Test
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          <strong>Instructions:</strong>
          <br />
          1. Click "Start Video Call Test" to open the video call interface
          <br />
          2. Allow camera and microphone permissions when prompted
          <br />
          3. You'll see your local video feed
          <br />
          4. To test with another user, open this page in a different browser/incognito window
          <br />
          5. Both users need to be on the same page to establish a connection
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          <strong>Note:</strong> This is a peer-to-peer connection using WebRTC.
          For production use, you would need a TURN server for users behind NAT/firewalls.
        </Typography>
      </Paper>

      <VideoCall
        isOpen={videoCallOpen}
        onClose={() => setVideoCallOpen(false)}
        targetUser={testUser}
        currentUser={currentUser}
      />
    </Container>
  );
};

export default VideoCallTest; 