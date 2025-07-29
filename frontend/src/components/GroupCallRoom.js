import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Avatar, TextField, IconButton, Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, Tabs, Tab, Tooltip } from '@mui/material';
import { Videocam, Mic, Chat, Description, UploadFile, VideocamOff, MicOff } from '@mui/icons-material';

const SIGNAL_SERVER = 'ws://localhost:8080/ws';

const GroupCallRoom = ({ open, onClose, group, currentUser }) => {
  const [tab, setTab] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [notepad, setNotepad] = useState('');
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const wsRef = useRef(null);
  const peerConnections = useRef({});
  const localVideoRef = useRef();

  // --- WebRTC setup ---
  useEffect(() => {
    if (!open) return;
    let ws;
    let isMounted = true;
    // 1. Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      // 2. Connect to signaling server
      ws = new WebSocket(SIGNAL_SERVER);
      wsRef.current = ws;
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join', roomId: group.id, userId: currentUser.id, username: currentUser.username }));
      };
      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'offer' && msg.from !== currentUser.id) {
          const pc = createPeerConnection(msg.from);
          await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', to: msg.from, from: currentUser.id, answer, roomId: group.id }));
        } else if (msg.type === 'answer' && msg.from !== currentUser.id) {
          const pc = peerConnections.current[msg.from];
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
        } else if (msg.type === 'ice-candidate' && msg.from !== currentUser.id) {
          const pc = peerConnections.current[msg.from];
          if (pc) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } else if (msg.type === 'join' && msg.userId !== currentUser.id) {
          // New user joined, create offer
          const pc = createPeerConnection(msg.userId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', to: msg.userId, from: currentUser.id, offer, roomId: group.id }));
        } else if (msg.type === 'leave' && msg.userId !== currentUser.id) {
          removePeer(msg.userId);
        } else if (msg.type === 'chat' && msg.roomId === group.id) {
          setChatMessages(prev => [...prev, msg]);
        } else if (msg.type === 'notepad' && msg.roomId === group.id) {
          setNotepad(msg.text);
        } else if (msg.type === 'file' && msg.roomId === group.id) {
          setFiles(prev => [...prev, msg.file]);
        }
      };
      ws.onclose = () => {};
    });
    // Cleanup
    return () => {
      isMounted = false;
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      setPeers({});
      setStreams({});
      if (wsRef.current) wsRef.current.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, [open, group?.id]);

  // Helper: create peer connection
  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peerConnections.current[peerId] = pc;
    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }
    pc.onicecandidate = (e) => {
      if (e.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'ice-candidate', to: peerId, from: currentUser.id, candidate: e.candidate, roomId: group.id }));
      }
    };
    pc.ontrack = (e) => {
      setStreams(prev => ({ ...prev, [peerId]: e.streams[0] }));
    };
    setPeers(prev => ({ ...prev, [peerId]: true }));
    return pc;
  };

  // Remove peer
  const removePeer = (peerId) => {
    if (peerConnections.current[peerId]) {
      peerConnections.current[peerId].close();
      delete peerConnections.current[peerId];
    }
    setPeers(prev => { const p = { ...prev }; delete p[peerId]; return p; });
    setStreams(prev => { const s = { ...prev }; delete s[peerId]; return s; });
  };

  // Mute/camera controls
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = !muted; });
      setMuted(m => !m);
    }
  };
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = !cameraOff; });
      setCameraOff(c => !c);
    }
  };

  // Send chat message
  const sendChatMessage = () => {
    if (wsRef.current && message.trim()) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        roomId: group.id,
        userId: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        text: message
      }));
      setMessage('');
    }
  };

  // Send notepad update
  const sendNotepadUpdate = (text) => {
    setNotepad(text);
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'notepad',
        roomId: group.id,
        userId: currentUser.id,
        text
      }));
    }
  };

  // Send file info (metadata only, not actual file upload)
  const sendFileInfo = (file) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'file',
        roomId: group.id,
        userId: currentUser.id,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedBy: currentUser.username,
          uploadedAt: new Date().toISOString()
        }
      }));
    }
  };

  // --- UI rendering ---
  const renderVideoGrid = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 2 }}>
      <Paper sx={{ width: 180, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 1, border: '2px solid #43e97b' }}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: 120, height: 90, borderRadius: 8, background: '#222' }} />
        <Typography variant="body2">You</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Tooltip title={muted ? 'Unmute' : 'Mute'}><IconButton onClick={toggleMute}>{muted ? <MicOff /> : <Mic />}</IconButton></Tooltip>
          <Tooltip title={cameraOff ? 'Turn Camera On' : 'Turn Camera Off'}><IconButton onClick={toggleCamera}>{cameraOff ? <VideocamOff /> : <Videocam />}</IconButton></Tooltip>
        </Box>
      </Paper>
      {Object.entries(streams).map(([peerId, stream]) => (
        <Paper key={peerId} sx={{ width: 180, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 1 }}>
          <video autoPlay playsInline ref={el => { if (el && stream) el.srcObject = stream; }} style={{ width: 120, height: 90, borderRadius: 8, background: '#222' }} />
          <Typography variant="body2">{peerId}</Typography>
        </Paper>
      ))}
    </Box>
  );

  // Placeholder for chat
  const renderChat = () => (
    <Box>
      <List sx={{ maxHeight: 200, overflow: 'auto' }}>
        {chatMessages.map((msg, i) => (
          <ListItem key={i}>
            <ListItemAvatar><Avatar src={msg.avatarUrl} /></ListItemAvatar>
            <ListItemText primary={msg.username} secondary={msg.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <TextField fullWidth value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
        <Button onClick={sendChatMessage}>Send</Button>
      </Box>
    </Box>
  );

  // Placeholder for file upload
  const renderFiles = () => (
    <Box>
      <Button component="label" startIcon={<UploadFile />}>
        Upload File
        <input type="file" hidden onChange={e => {
          const newFiles = Array.from(e.target.files);
          newFiles.forEach(sendFileInfo);
          setFiles(prev => [...prev, ...newFiles.map(f => ({ name: f.name, size: f.size, type: f.type, uploadedBy: currentUser.username, uploadedAt: new Date().toISOString() }))]);
        }} />
      </Button>
      <List>
        {files.map((file, i) => (
          <ListItem key={i}><ListItemText primary={file.name} secondary={`By ${file.uploadedBy} at ${file.uploadedAt}`} /></ListItem>
        ))}
      </List>
    </Box>
  );

  // Placeholder for collaborative notepad
  const renderNotepad = () => (
    <TextField
      label="Collaborative Notepad"
      multiline
      minRows={6}
      fullWidth
      value={notepad}
      onChange={e => sendNotepadUpdate(e.target.value)}
      sx={{ mt: 2 }}
    />
  );

  return (
    <Box sx={{ display: open ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.85)', zIndex: 2000, p: 4, overflow: 'auto' }}>
      <Paper sx={{ maxWidth: 900, mx: 'auto', p: 3, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Group Call Room: {group?.name}</Typography>
        {renderVideoGrid()}
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab icon={<Chat />} label="Chat" />
          <Tab icon={<Mic />} label="Voice" />
          <Tab icon={<Description />} label="Notepad" />
          <Tab icon={<UploadFile />} label="Files" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        {tab === 0 && (
          <Box>
            {renderChat()}
          </Box>
        )}
        {tab === 1 && <Typography sx={{ color: 'gray' }}>Voice chat coming soon...</Typography>}
        {tab === 2 && (
          <TextField
            label="Collaborative Notepad"
            multiline
            minRows={6}
            fullWidth
            value={notepad}
            onChange={e => sendNotepadUpdate(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
        {tab === 3 && (
          <Box>
            <Button component="label" startIcon={<UploadFile />}>
              Upload File
              <input type="file" hidden onChange={e => {
                const newFiles = Array.from(e.target.files);
                newFiles.forEach(sendFileInfo);
                setFiles(prev => [...prev, ...newFiles.map(f => ({ name: f.name, size: f.size, type: f.type, uploadedBy: currentUser.username, uploadedAt: new Date().toISOString() }))]);
              }} />
            </Button>
            <List>
              {files.map((file, i) => (
                <ListItem key={i}><ListItemText primary={file.name} secondary={`By ${file.uploadedBy} at ${file.uploadedAt}`} /></ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button onClick={onClose} variant="contained">Leave Room</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GroupCallRoom; 