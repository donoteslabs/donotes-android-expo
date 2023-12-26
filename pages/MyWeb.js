import React, { Component, useRef, useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import {decode as atob, encode as btoa} from 'base-64'
import { compress, decompress } from 'lzutf8';

import {
  MD3DarkTheme,
} from 'react-native-paper';



function compressText(text) {
  return compress(text, { outputEncoding: 'StorageBinaryString' });
}


export default function TinyMCEEditor({
  DefaultTheme,
  themes,
  noteContent,
  activeNote,
  socket,
  sessionId,
  clientId,
  setNoteContent,
}) {
  const webViewRef = useRef(null);
  const [init, setInit] = useState(false);
  const [darkMode, setDarkMode] = useState('');
  const [initContent, setInitContent] = useState('');
  useEffect(()=>{
    setInitContent(noteContent);
  }, [])

  useEffect(()=>{
    if(DefaultTheme === MD3DarkTheme) {
      setDarkMode('skin: "oxide-dark",content_css: "dark",');
      sendJs(noteContent);
      setInit(false);
    }else {
      setDarkMode('');
        sendJs(noteContent);
        setInit(false);
    }
  } , [DefaultTheme])
useEffect(()=>{
  
  sendJs(noteContent);
}, [init])
useEffect(() => {
  console.log('changed');
  sendJs(noteContent);
}, [noteContent]);

  function sendJs(content) {
    const injected = `
      changeContent('${content}');
    `;
    webViewRef.current.injectJavaScript(injected);
  }
  

  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js" integrity="sha512-6JR4bbn8rCKvrkdoTJd/VFyXAN4CE9XMtgykPWgKiHjou56YDJxWsi90hAeMTYxNwUnKSQu9JPc3SQUg+aGCHw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>  <title>TinyMCE Dynamic Content</title>
</head>
<body style="background: ${themes.colors.background} ; margin: 0">

  <textarea id="myTextarea">${initContent}</textarea>

  <script>
  
  function initCheck() {
    
    window.ReactNativeWebView.postMessage(JSON.stringify({init: true}));
  }
    tinymce.init({
      selector: '#myTextarea',
      
      init_instance_callback: initCheck,
      height: '100vh',
      ${darkMode}
      mobile: {
    menubar: true
  },
  promotion: false,

      fixed_toolbar_container: "#editor-toolbar",
      toolbar_location: "bottom",
      contextmenu: false,
      plugins: 'advlist autolink lists link image charmap print preview anchor',
      toolbar: false,
      menubar: true,
      setup: function(editor) {
        editor.on('change input', function () {
          const text = btoa(editor.getContent());
    window.ReactNativeWebView.postMessage(JSON.stringify({text}));
        });
      },
    });

    function changeContent(content) {
      // Get the TinyMCE instance
      var editor = tinymce.get('myTextarea');

      // Check if the editor instance exists
      if (editor) {
        // Set new content
        
        let bookmark = tinymce.activeEditor.selection.getBookmark();
        window.ReactNativeWebView.postMessage(JSON.stringify({cursor: cursorPosition}));

        editor.setContent(content);
        tinymce.activeEditor.selection.moveToBookmark(bookmark);


      }
    }
  </script>

</body>
</html>

  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        
        source={{ html }}
        onMessage={(event) => {
          const eventData = JSON.parse(event.nativeEvent.data);
          
          if(eventData.init) {
            if(eventData.init === true) {
              setInit(true);
            }
          }else {
            if(eventData.text) {
              const content = atob(eventData.text);
              console.log(init);
              if(init){
                setNoteContent(content);
                if(content == '') {
                  newContent = '==';
                   b64c = newContent;
               }else {
                  newContent = content;
                   b64c = compressText(newContent);
               }
       
       
               
               const updateNote = {
                   type: 'note-write',
                   sessionId,
                   clientId,
                   noteId: activeNote,
                   content: b64c,
                   //cursorPosition: caretPosition,
               };
               console.log(updateNote);
               if (socket) {
                  socket.send(JSON.stringify(updateNote));
               }
              }else {
                alert('Initialisation error');
              }
  

            }
          }

        }}
      />
    </View>
  );
}
