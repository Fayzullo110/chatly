# 🧪 Chatly Testing Guide

## Overview
This guide provides comprehensive testing instructions for the Chatly chat application using the built-in TestBot. The TestBot allows you to test all features without needing multiple users or external tools.

## 🚀 Quick Start

### 1. Start the Application
```bash
# Terminal 1 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 2. Access Test Interface
1. Open your browser and go to `http://localhost:3000`
2. Login or register an account
3. Navigate to `/test` or click "Test" in the navigation menu
4. You'll see the **Chatly Testing Center** with multiple tabs

## 📋 TestBot Features

### TestBot Control Panel
The main testing interface with the following capabilities:

#### Text Messages
- **Send Random Text**: Bot sends random predefined messages
- **Send Custom Text**: Send specific text messages
- **Auto-Response**: Bot responds to user messages intelligently

#### Media Messages
- **Send Image**: Bot sends sample image messages
- **Send Video**: Bot sends sample video messages  
- **Send Audio**: Bot sends sample audio messages
- **Send File**: Bot sends sample document files

#### Call Simulation
- **Simulate Call**: Bot sends call started/ended messages
- **Simulate Video Call**: Bot sends video call messages

#### Bulk Testing
- **Send 5/10/20 Messages**: Test system performance with multiple messages
- **Mixed Content**: Random mix of text, media, and files

#### Interactive Features
- **Help Commands**: Type "help" in chat for bot assistance
- **Auto-Responses**: Bot responds to specific commands

## 🎯 Testing Scenarios

### Scenario 1: Basic Text Messaging
1. Go to **Chat Interface** tab
2. Send a text message from your account
3. Use TestBot to send random text messages
4. Verify messages appear in real-time
5. Test different message lengths and content

**Expected Results:**
- Messages appear immediately
- Proper sender identification
- Correct timestamp display
- Message ordering maintained

### Scenario 2: File Upload & Sharing
1. Use TestBot to send different file types:
   - Click "Send Image"
   - Click "Send Video" 
   - Click "Send Audio"
   - Click "Send File"
2. Upload files from your device using the chat interface
3. Test various file formats and sizes

**Expected Results:**
- File previews display correctly
- Download links work
- File type icons show properly
- Large files handle gracefully

### Scenario 3: Voice & Video Messages
1. Use TestBot to send audio messages
2. Use TestBot to send video messages
3. Test recording your own voice messages
4. Test video message recording

**Expected Results:**
- Audio/video players work
- Playback controls function
- Recording features work
- File sizes are reasonable

### Scenario 4: Call Features
1. Use TestBot to simulate call events:
   - Click "Simulate Call"
   - Click "Simulate Video Call"
2. Test call button functionality in chat
3. Verify call status messages appear

**Expected Results:**
- Call status messages display
- Call buttons respond properly
- Video call interface loads
- Call controls work

### Scenario 5: Bulk Testing
1. Use TestBot bulk testing features:
   - Click "Send 5 Messages"
   - Click "Send 10 Messages" 
   - Click "Send 20 Messages"
2. Monitor system performance
3. Check message ordering and display

**Expected Results:**
- All messages delivered
- Proper ordering maintained
- UI remains responsive
- No memory leaks

### Scenario 6: Interactive Testing
1. Send messages to TestBot in chat:
   - Type "hello" or "hi"
   - Type "send image"
   - Type "send video"
   - Type "send audio"
   - Type "send file"
   - Type "help"
2. Test auto-response functionality

**Expected Results:**
- Bot responds appropriately
- Commands work as expected
- Help messages are helpful
- Auto-responses are relevant

## 🔧 API Testing

### TestBot Endpoints
All TestBot functionality is available via REST API:

```bash
# Initialize bot
POST http://localhost:8080/testbot/initialize

# Send text message
POST http://localhost:8080/testbot/send/text?chatRoomId=1&message=Hello

# Send random text
POST http://localhost:8080/testbot/send/random-text?chatRoomId=1

# Send image
POST http://localhost:8080/testbot/send/image?chatRoomId=1

# Send video
POST http://localhost:8080/testbot/send/video?chatRoomId=1

# Send audio
POST http://localhost:8080/testbot/send/audio?chatRoomId=1

# Send file
POST http://localhost:8080/testbot/send/file?chatRoomId=1

# Simulate call
POST http://localhost:8080/testbot/send/call-started?chatRoomId=1

# Simulate video call
POST http://localhost:8080/testbot/send/video-call-started?chatRoomId=1

# Send interactive message
POST http://localhost:8080/testbot/send/interactive?chatRoomId=1

# Auto-respond to message
POST http://localhost:8080/testbot/auto-respond?chatRoomId=1&userMessage=hello

# Bulk test
POST http://localhost:8080/testbot/bulk-test?chatRoomId=1&count=10

# Get bot statistics
GET http://localhost:8080/testbot/stats

# Get available commands
GET http://localhost:8080/testbot/commands
```

### Manual API Testing with curl
```bash
# Initialize bot
curl -X POST http://localhost:8080/testbot/initialize

# Send a text message
curl -X POST "http://localhost:8080/testbot/send/text?chatRoomId=1&message=Test%20message"

# Send an image
curl -X POST http://localhost:8080/testbot/send/image?chatRoomId=1

# Get bot stats
curl -X GET http://localhost:8080/testbot/stats
```

## 🎮 Chat Commands

You can interact with TestBot directly in the chat by typing these commands:

| Command | Action |
|---------|--------|
| `hello` or `hi` | Bot responds with greeting |
| `send image` | Bot sends a sample image |
| `send video` | Bot sends a sample video |
| `send audio` | Bot sends a sample audio message |
| `send file` | Bot sends a sample document |
| `call` | Bot simulates a call |
| `video call` | Bot simulates a video call |
| `help` | Bot shows available commands |

## 📊 Performance Testing

### Load Testing
1. Use bulk testing to send 20+ messages
2. Monitor browser performance
3. Check memory usage
4. Test with multiple browser tabs

### Stress Testing
1. Send messages rapidly
2. Upload large files
3. Test with slow network (dev tools)
4. Test with multiple users

## 🐛 Bug Reporting

When testing, note the following:

### Information to Include
- **Test Scenario**: Which scenario you were testing
- **Steps to Reproduce**: Exact steps taken
- **Expected Result**: What should happen
- **Actual Result**: What actually happened
- **Browser/OS**: Your browser and operating system
- **Console Errors**: Any errors in browser console
- **Network Tab**: Failed requests in Network tab

### Common Issues to Check
- [ ] Messages not appearing in real-time
- [ ] File uploads failing
- [ ] Video/audio not playing
- [ ] Call buttons not working
- [ ] UI not responsive
- [ ] Memory leaks
- [ ] Network errors

## 🔍 Debugging Tips

### Browser Developer Tools
1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Monitor API requests
3. **Performance Tab**: Check for memory leaks
4. **Application Tab**: Check localStorage/sessionStorage

### Backend Logs
Monitor the Spring Boot console for:
- Database errors
- File upload issues
- WebSocket connection problems
- Authentication errors

### Common Debugging Commands
```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Check database
curl http://localhost:8080/h2-console

# Monitor logs
tail -f backend/logs/application.log
```

## ✅ Test Checklist

### Core Features
- [ ] User registration and login
- [ ] Text messaging
- [ ] File upload and sharing
- [ ] Image/video/audio messages
- [ ] Real-time updates
- [ ] Message history

### Advanced Features
- [ ] Voice calls
- [ ] Video calls
- [ ] Message reactions
- [ ] User profiles
- [ ] Settings
- [ ] Theme switching

### Performance
- [ ] Fast message delivery
- [ ] Smooth scrolling
- [ ] Responsive UI
- [ ] Memory efficiency
- [ ] Network optimization

### Security
- [ ] Authentication required
- [ ] File upload validation
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input sanitization

## 🎉 Success Criteria

A successful test run should demonstrate:
- ✅ All features work as expected
- ✅ UI is responsive and intuitive
- ✅ Real-time updates work properly
- ✅ File handling is robust
- ✅ Call features function correctly
- ✅ No critical errors or crashes
- ✅ Performance is acceptable

## 📞 Support

If you encounter issues during testing:
1. Check this guide first
2. Review browser console for errors
3. Check backend logs
4. Try refreshing the page
5. Clear browser cache if needed

Happy Testing! 🚀 