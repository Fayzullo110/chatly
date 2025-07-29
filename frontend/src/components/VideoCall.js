import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './VideoCall.css';

const VideoCall = ({ isOpen, onClose, targetUser, currentUser }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();
  const stompClientRef = useRef();
  
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (isOpen) {
      initializeWebSocket();
      initializeMedia();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);

  const initializeWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      
      client.subscribe('/topic/call', (message) => {
        const data = JSON.parse(message.body);
        handleSignalingMessage(data);
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    client.activate();
    stompClientRef.current = client;
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const startCall = async () => {
    if (!targetUser) return;
    
    setCallStatus('calling');
    setIsCallActive(true);
    
    try {
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;
      
      // Add local stream
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      
      // Handle incoming streams
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            from: currentUser.username,
            to: targetUser.username
          });
        }
      };
      
      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      sendSignalingMessage({
        type: 'offer',
        offer: offer,
        from: currentUser.username,
        to: targetUser.username
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('idle');
      setIsCallActive(false);
    }
  };

  const answerCall = async (offer) => {
    try {
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;
      
      // Add local stream
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      
      // Handle incoming streams
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            from: currentUser.username,
            to: targetUser.username
          });
        }
      };
      
      // Set remote description and create answer
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      sendSignalingMessage({
        type: 'answer',
        answer: answer,
        from: currentUser.username,
        to: targetUser.username
      });
      
      setCallStatus('connected');
      setIsCallActive(true);
      
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setCallStatus('idle');
    
    sendSignalingMessage({
      type: 'end-call',
      from: currentUser.username,
      to: targetUser.username
    });
    
    onClose();
  };

  const handleSignalingMessage = async (data) => {
    if (!peerConnectionRef.current && data.type === 'offer') {
      setIsIncomingCall(true);
      setCallStatus('incoming');
      return;
    }
    
    switch (data.type) {
      case 'offer':
        if (isIncomingCall) {
          await answerCall(data.offer);
          setIsIncomingCall(false);
        }
        break;
        
      case 'answer':
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          setCallStatus('connected');
        }
        break;
        
      case 'ice-candidate':
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        break;
        
      case 'end-call':
        endCall();
        break;
        
      default:
        console.log('Unknown signaling message type:', data.type);
    }
  };

  const sendSignalingMessage = (message) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/call.' + message.type,
        body: JSON.stringify(message)
      });
    }
  };

  const cleanup = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="video-call-overlay">
      <div className="video-call-container">
        <div className="video-call-header">
          <h3>Video Call with {targetUser?.username}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="video-call-content">
          {callStatus === 'idle' && (
            <div className="call-controls">
              <button className="start-call-btn" onClick={startCall}>
                Start Video Call
              </button>
            </div>
          )}
          
          {callStatus === 'calling' && (
            <div className="call-status">
              <p>Calling {targetUser?.username}...</p>
              <button className="end-call-btn" onClick={endCall}>
                Cancel Call
              </button>
            </div>
          )}
          
          {callStatus === 'incoming' && (
            <div className="call-status">
              <p>Incoming call from {targetUser?.username}</p>
              <button className="answer-call-btn" onClick={() => answerCall()}>
                Answer
              </button>
              <button className="reject-call-btn" onClick={endCall}>
                Reject
              </button>
            </div>
          )}
          
          {callStatus === 'connected' && (
            <div className="video-streams">
              <div className="remote-video-container">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="remote-video"
                />
                <div className="remote-video-label">{targetUser?.username}</div>
              </div>
              
              <div className="local-video-container">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="local-video"
                />
                <div className="local-video-label">You</div>
              </div>
              
              <div className="call-controls">
                <button className="end-call-btn" onClick={endCall}>
                  End Call
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 