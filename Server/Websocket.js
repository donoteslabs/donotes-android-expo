import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { compress, decompress } from 'lzutf8';

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

function decompressText(compressedText) {
  if(compressedText != null) {
    return decompress(compressedText, { inputEncoding: 'StorageBinaryString' });
  }
}
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
function WebSocketComponent({parentSocket,setNoteName, setNoteContent, setInit, clientId, setClientId, setSocket, setDialogMessage, showDialog,activeNote, setNum,setHomeLoaded ,setDialogTitle,sFID,sFN, sFP, sNID, sNN, sNP, setLoaderVisible ,sessionId, setLoggedIn, setUsername, setProfilePic}) {
  const [singleId, setSingleId] = useState(generateSessionId());



  useEffect(()=>{
    console.log(singleId);
  }, [singleId]);useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSession = await getValueFor('sessionId');
        const newClient = generateSessionId();
        setSingleId(newClient);
        setClientId(newClient);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    
    setInterval(()=>{
      if(parentSocket) {
      
      if (parentSocket.readyState === WebSocket.OPEN) {
        parentSocket.send(JSON.stringify({type: 'heartbeat'}));
      }else {
        setupWebSocket();
      }
    }
    }, 500)
    if(sessionId) {
    let socket = new WebSocket('wss://ws-server.donotes.app');
    let reconnectInterval;
    
    const setupWebSocket = () => {
      // WebSocket Event Handlers
      socket.onopen = () => {
        setSocket(socket);
        console.log('WebSocket connection opened');
        const initialisationMessage = JSON.stringify({ type: 'initialisation', sessionId: sessionId, clientId: singleId , activeNote: null });
        console.log(initialisationMessage);
        socket.send(initialisationMessage);

        // Start sending heartbeats when the connection is open
        sendHeartbeat();
        
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
      }
      };

      socket.onmessage = (event) => {
        setLoaderVisible(false);
        console.log('WebSocket message received:', event.data);
        
    generateRandomNumber = () => { 
      const min = 1; 
      const max = 100; 
      const randomNumber = 
          Math.floor(Math.random() * (max - min + 1)) + min; 
      return randomNumber;
  }; 
        const eventData = JSON.parse(event.data);
        
        const code = eventData.code;
        const msg = eventData.msg;
        if(code) {
            if(code === '4' || code ==='1') {
                setLoggedIn(true);
                const requestMessage = JSON.stringify({ type: 'request', sessionId: sessionId, userName: 'fetch' });
                socket.send(requestMessage);
                const requestMessage2 = JSON.stringify({ type: 'request', sessionId: sessionId, folders: 'fetch' });
                socket.send(requestMessage2);
                const requestMessage3 = JSON.stringify({ type: 'request', sessionId: sessionId, notes: 'fetch' });
                socket.send(requestMessage3);
              
                const requestMessage4 = JSON.stringify({ type: 'request', sessionId: sessionId, profilePic: 'fetch' });
                socket.send(requestMessage4);


            }else if(code === '2') {
                setDialogTitle('Log in')
                setDialogMessage(msg);
                showDialog();
            }else if(code === '16') {
              if(eventData.userName) {
                setUsername(eventData.userName);
              }
            }else if(code === '36') {
              if(eventData.pic) {
                setProfilePic(eventData.pic);
              }
            }else if (code === '25' ) {
              setHomeLoaded(true);
              const newNum = generateRandomNumber();
              setNum(newNum);
              const count = eventData.count - 1;
              
              if(eventData.folders_name) {
              const foldersId = Object.values(eventData.folders_id);
              sFID([...foldersId]);
              }
              if(eventData.folders_name) {
              const foldersName = Object.values(eventData.folders_name);
              sFN([...foldersName]);
              }
              if(eventData.folders_parent) {
                const foldersParent = Object.values(eventData.folders_parent);
                sFP([...foldersParent]);
  
              }
              
              
            }else if (code === '26' ) {
              const count = eventData.count - 1;
              
              if(eventData.notes_name) {
              const notesId = Object.values(eventData.notes_id);
              sNID([...notesId]);
              }
              if(eventData.notes_name) {
              const notesName = Object.values(eventData.notes_name);
              sNN([...notesName]);
              }
              if(eventData.notes_parent) {
                const notesParent = Object.values(eventData.notes_parent);
                sNP([...notesParent]);
  
              }
              
              
            }else if(code === '27') {
              const noteName = eventData.name;
              setNoteName(noteName);
              console.log(noteName);
              const noteText= decompressText(eventData.text);
              setNoteContent(noteText);
              console.log(noteText);
              setInit(true);
            }
            else if(code === '28') {
              const content = decompressText(eventData.content);
              setNoteContent(content);
            }
            else {
                if(msg) {
                    console.log(msg);
                    showDialog();
                    setDialogMessage(msg);
                }
            }
        }
        
        // Handle incoming messages from the WebSocket server
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        if (event.wasClean) {
          console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.error('Connection died');
          // Set up a reconnect interval only if it doesn't already exist
          if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
              console.log('Attempting to reconnect...');
              setupWebSocket(); // Reattempt to set up the WebSocket
            }, 2000);
          }
        }
      };
    };

    const sendHeartbeat = () => {
      
      socket.send(JSON.stringify({type: 'heartbeat'}));
      // Send a heartbeat message to the server at regular intervals
      const heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({type: 'heartbeat'}));
        }else {
          setupWebSocket();
        }
      }, 5000); // Adjust the interval based on your requirements

      // Clean up the heartbeat interval when the connection is closed
      socket.onclose = () => {
        clearInterval(heartbeatInterval)
      };
    };

    setupWebSocket();

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }
  }, [sessionId]);

  return <></>; // You can customize the return if needed
}

export default WebSocketComponent;
