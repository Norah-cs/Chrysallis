import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, Phone, Users, MessageSquare, X } from 'lucide-react';
import { FormData } from '../../types';

interface VideoChatRoomProps {
  roomId: string;
  userData: FormData;
  onLeave: () => void;
}

interface PeerConnection {
  [key: string]: RTCPeerConnection;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

export const VideoChatRoom: React.FC<VideoChatRoomProps> = ({ roomId, userData, onLeave }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [isWaitingForMatch, setIsWaitingForMatch] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const peerConnections = useRef<PeerConnection>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      forceNew: true, // Force a new connection
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
      upgrade: true, // Allow upgrade from polling to websocket
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server with socket ID:', newSocket.id);
      setIsConnected(true);
      
      // Join room with user data for matching
      const joinData = {
        roomId,
        userData: {
          name: userData.name,
          email: userData.email,
          techInterest: userData.techInterest,
          practiceGoals: userData.practiceGoals,
          university: userData.university,
          year: userData.year
        }
      };
      console.log('📤 Sending join-room event:', joinData);
      newSocket.emit('join-room', joinData);
    });

    newSocket.on('reconnect', () => {
      console.log('🔄 Reconnected to server with socket ID:', newSocket.id);
      // Rejoin room after reconnection
      const joinData = {
        roomId,
        userData: {
          name: userData.name,
          email: userData.email,
          techInterest: userData.techInterest,
          practiceGoals: userData.practiceGoals,
          university: userData.university,
          year: userData.year
        }
      };
      console.log('📤 Re-sending join-room event after reconnect:', joinData);
      newSocket.emit('join-room', joinData);
    });

    newSocket.on('user-matched', (matchedUserData) => {
      console.log('🎉 USER MATCHED EVENT RECEIVED:', matchedUserData);
      console.log('Current socket ID:', newSocket.id);
      setMatchedUser(matchedUserData);
      setIsWaitingForMatch(false);
      
      // Start WebRTC connection with the matched user (with delay to ensure local stream is ready)
      setTimeout(() => {
        console.log('🔗 Starting peer connection after match...');
        initiatePeerConnection(matchedUserData.id);
      }, 1000); // Increased delay to ensure everything is ready
    });

    newSocket.on('user-left', (userId) => {
      console.log('User left:', userId);
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
    });

    newSocket.on('offer', async (data) => {
      console.log('📥 Received offer from:', data.userId);
      console.log('📥 Offer details:', {
        type: data.offer.type,
        sdp: data.offer.sdp?.substring(0, 100) + '...'
      });
      await handleOffer(data.userId, data.offer);
    });

    newSocket.on('answer', async (data) => {
      console.log('📥 Received answer from:', data.userId);
      console.log('📥 Answer details:', {
        type: data.answer.type,
        sdp: data.answer.sdp?.substring(0, 100) + '...'
      });
      await handleAnswer(data.userId, data.answer);
    });

    newSocket.on('ice-candidate', async (data) => {
      console.log('🧊 Received ICE candidate from:', data.userId);
      console.log('🧊 ICE candidate details:', {
        candidate: data.candidate.candidate,
        sdpMLineIndex: data.candidate.sdpMLineIndex,
        sdpMid: data.candidate.sdpMid
      });
      await handleIceCandidate(data.userId, data.candidate);
    });

    newSocket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('❌ Connection error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type
      });
      setIsConnected(false);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Initialize local media stream
    initializeLocalStream();

    return () => {
      newSocket.disconnect();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle remote streams when they change
  useEffect(() => {
    console.log('📹 Remote streams changed:', Object.keys(remoteStreams));
    Object.entries(remoteStreams).forEach(([userId, stream]) => {
      console.log(`📹 Processing remote stream for user ${userId}:`, {
        streamId: stream?.id,
        active: stream?.active,
        trackCount: stream?.getTracks().length
      });
      
      const videoElement = remoteVideoRefs.current[userId];
      if (videoElement && stream) {
        videoElement.srcObject = stream;
        console.log('📹 Remote stream updated for user:', userId);
        
        // Force play the video
        videoElement.play().then(() => {
          console.log('📹 Remote video started playing for user:', userId);
        }).catch(err => {
          console.error('❌ Error playing remote video for user:', userId, err);
        });
      } else {
        console.log(`📹 Video element for user ${userId}:`, {
          elementExists: !!videoElement,
          streamExists: !!stream
        });
      }
    });
  }, [remoteStreams]);

  const initializeLocalStream = async () => {
    try {
      console.log('🎥 Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('✅ Camera and microphone access granted');
      setLocalStream(stream);
      
      // Set up local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('📹 Local video stream set');
        
        // Ensure video plays
        localVideoRef.current.onloadedmetadata = () => {
          console.log('📹 Local video metadata loaded');
          localVideoRef.current?.play().catch(console.error);
        };
      }
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      alert('Please allow camera and microphone access to use video chat');
    }
  };

  const createPeerConnection = (userId: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks if available
    if (localStream) {
      console.log('📹 Adding local stream tracks to peer connection');
      localStream.getTracks().forEach(track => {
        console.log(`Adding track: ${track.kind} (enabled: ${track.enabled})`);
        peerConnection.addTrack(track, localStream);
      });
    } else {
      console.log('⚠️ Local stream not available when creating peer connection');
    }

    peerConnection.ontrack = (event) => {
      console.log('📹 Received remote stream from:', userId);
      console.log('📹 Remote stream details:', {
        streamId: event.streams[0]?.id,
        trackCount: event.streams[0]?.getTracks().length,
        videoTracks: event.streams[0]?.getVideoTracks().length,
        audioTracks: event.streams[0]?.getAudioTracks().length
      });
      
      const remoteStream = event.streams[0];
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: remoteStream
      }));
      
      // Ensure the video element gets the stream with multiple attempts
      const assignStream = (attempt = 0) => {
        const videoElement = remoteVideoRefs.current[userId];
        if (videoElement && remoteStream) {
          videoElement.srcObject = remoteStream;
          console.log('📹 Remote video stream assigned to video element');
          
          // Force play the video
          videoElement.play().then(() => {
            console.log('📹 Remote video started playing');
          }).catch(err => {
            console.error('❌ Error playing remote video:', err);
          });
        } else if (attempt < 10) {
          console.log(`📹 Video element not ready, retrying in 200ms (attempt ${attempt + 1})`);
          setTimeout(() => assignStream(attempt + 1), 200);
        } else {
          console.error('❌ Video element not available after 10 attempts');
        }
      };
      
      assignStream();
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('🧊 Sending ICE candidate to:', userId);
        socket.emit('ice-candidate', {
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`🔗 Peer connection state with ${userId}:`, peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed') {
        console.log('❌ Peer connection failed, attempting to restart...');
        // Attempt to restart the connection
        setTimeout(() => {
          if (socket && matchedUser) {
            initiatePeerConnection(userId);
          }
        }, 2000);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(`🧊 ICE connection state with ${userId}:`, peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === 'failed') {
        console.log('❌ ICE connection failed, attempting to restart...');
        // Attempt to restart ICE gathering
        peerConnection.restartIce();
      }
    };

    return peerConnection;
  };

  const initiatePeerConnection = async (userId: string) => {
    console.log('🔗 Initiating peer connection with:', userId);
    
    // Check if local stream is available
    if (!localStream) {
      console.log('⚠️ Local stream not available, waiting...');
      setTimeout(() => {
        initiatePeerConnection(userId);
      }, 1000);
      return;
    }
    
    // Check if socket is available
    if (!socket) {
      console.log('⚠️ Socket not available, waiting...');
      setTimeout(() => {
        initiatePeerConnection(userId);
      }, 1000);
      return;
    }
    
    const peerConnection = createPeerConnection(userId);
    peerConnections.current[userId] = peerConnection;

    try {
      // Create and send offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerConnection.setLocalDescription(offer);
      
      console.log('📤 Sending offer to:', userId);
      console.log('📤 Offer details:', {
        type: offer.type,
        sdp: offer.sdp?.substring(0, 100) + '...'
      });
      socket.emit('offer', {
        targetUserId: userId,
        offer: offer
      });
    } catch (error) {
      console.error('❌ Error creating offer:', error);
      // Retry after a delay
      setTimeout(() => {
        if (socket && matchedUser) {
          console.log('🔄 Retrying peer connection...');
          initiatePeerConnection(userId);
        }
      }, 2000);
    }
  };

  const handleOffer = async (userId: string, offer: RTCSessionDescriptionInit) => {
    console.log('📥 Received offer from:', userId);
    
    // Check if local stream is available
    if (!localStream) {
      console.log('⚠️ Local stream not available when handling offer, waiting...');
      setTimeout(() => {
        handleOffer(userId, offer);
      }, 1000);
      return;
    }
    
    // Check if socket is available
    if (!socket) {
      console.log('⚠️ Socket not available when handling offer, waiting...');
      setTimeout(() => {
        handleOffer(userId, offer);
      }, 1000);
      return;
    }
    
    const peerConnection = createPeerConnection(userId);
    peerConnections.current[userId] = peerConnection;

    try {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerConnection.setLocalDescription(answer);

      console.log('📤 Sending answer to:', userId);
      console.log('📤 Answer details:', {
        type: answer.type,
        sdp: answer.sdp?.substring(0, 100) + '...'
      });
      socket.emit('answer', {
        targetUserId: userId,
        answer: answer
      });
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  };

  const handleAnswer = async (userId: string, answer: RTCSessionDescriptionInit) => {
    console.log('📥 Received answer from:', userId);
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(answer);
        console.log('✅ Answer processed successfully');
      } catch (error) {
        console.error('❌ Error handling answer:', error);
      }
    }
  };

  const handleIceCandidate = async (userId: string, candidate: RTCIceCandidateInit) => {
    console.log('📥 Received ICE candidate from:', userId);
    const peerConnection = peerConnections.current[userId];
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(candidate);
        console.log('✅ ICE candidate added successfully');
      } catch (error) {
        console.error('❌ Error handling ICE candidate:', error);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: userData.name,
        message: newMessage.trim(),
        timestamp: new Date()
      };
      
      socket.emit('chat-message', message);
      setNewMessage('');
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onLeave();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex">
      {/* Video Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <h2 className="text-white font-semibold">
              {isWaitingForMatch ? 'Finding your perfect match...' : `Chatting with ${matchedUser?.name}`}
            </h2>
            {!isConnected && (
              <span className="text-red-400 text-sm">(Disconnected)</span>
            )}
          </div>
          <button
            onClick={handleLeave}
            className="text-white hover:text-red-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          {isWaitingForMatch ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Finding Your Match</h3>
                <p className="text-gray-300">We're looking for someone with similar interests...</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-400">Your interests: {userData.techInterest}</div>
                  <div className="text-sm text-gray-400">Your goals: {userData.practiceGoals.join(', ')}</div>
                </div>
                {!isConnected && (
                  <div className="mt-6">
                    <p className="text-red-400 mb-3">Connection lost. Please refresh the page to reconnect.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
              </div>

              {/* Remote Videos */}
              {Object.entries(remoteStreams).map(([userId, stream]) => (
                <div key={userId} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current[userId] = el;
                        // Force stream assignment
                        if (stream) {
                          el.srcObject = stream;
                          console.log('📹 Remote video stream set for user:', userId);
                          // Force play
                          el.play().catch(err => console.error('❌ Error playing remote video:', err));
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    muted={false}
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      console.log('📹 Remote video metadata loaded for user:', userId);
                    }}
                    onCanPlay={() => {
                      console.log('📹 Remote video can play for user:', userId);
                    }}
                    onError={(e) => {
                      console.error('❌ Remote video error for user:', userId, e);
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {matchedUser?.name || 'Remote User'}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show local video even while waiting for match */}
          {isWaitingForMatch && localStream && (
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-500">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                You
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLeave}
            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === userData.name ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === userData.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm font-medium mb-1">{message.sender}</div>
                <div className="text-sm">{message.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChatRoom;
