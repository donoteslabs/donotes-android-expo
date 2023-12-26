import * as React from 'react';
import { SafeAreaView, useWindowDimensions ,StyleSheet, StatusBar  ,ScrollView, View, Text} from 'react-native';
import { FAB , Card} from 'react-native-paper';
import { Appbar ,Icon,Button, TouchableRipple,
  ActivityIndicator, } from 'react-native-paper';

  import HTML from "react-native-render-html";
  import { WebView } from 'react-native-webview';



  function Note({noteName, noteContent, setNoteName, setNoteContent, clientId, setLocation, themes, setTitleText, setTitleBack, activeNote, socket, sessionId, init, setInit}) {
    
    
  const tagsStyles = {
    p: {
      color: themes.colors.onBackground, // Set the default text color to white for <p> tags
    },
    // You can add more tag styles as needed
  };
  const [scrollViewHeight, setScrollViewHeight] = React.useState(0);
  const [toolbarHeight, setToolbarHeight] = React.useState(0)

  const handleScrollViewLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    console.log(height);
    const newHeight = height - 1200;
    setScrollViewHeight(height);
  };
  React.useEffect(()=>{
    
    setTitleText('Loading...')
  }, [])
    React.useEffect(()=>{
      setTitleText(noteName);
    }, [noteName])
    React.useEffect(()=>{
      setTitleBack('home')
      setTitleText('Loading...')
      setInit(false);
      setNoteContent('Loading...');
      setTitleText(noteName);
        // Fetch note content whe
        const fetchNote = {
            type: 'request',
            sessionId,
            clientId: clientId,
            noteId: activeNote,
            fetchNoteData: 'fetch',
        };
        // Check if socket is available before sending the message
        if (socket) {
            socket.send(JSON.stringify(fetchNote));
        }

        // Add any cleanup code if needed
      
    }, [activeNote])
const styles = StyleSheet.create({
    fab: {
      backgroundColor: themes.colors.primary,
      opacity: 0.9,
      position: 'absolute',
      margin: 16,
      right: 15,
      bottom: 15,
    },
    upBtn: {
      backgroundColor: themes.colors.secondary,
      opacity: 0.9,
      position: 'absolute',
      margin: 16,
      left: 15,
      bottom: 15,
    },
      container: {
        width: '90%',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        marginTop: 15,
        marginBottom: 45,
      },
      container2: {
        flex: 1,
        flexDirection: 'column',
      },
      webview: {
        flex: 1,
      },
      card: {
        width: 155,
        height: 155,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
      },
      title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
      },
      root: {
        height:'100%',
        flex: 1,
        marginTop: 10,
      },
      editor: {
        height: scrollViewHeight,
        flex: 1,
        padding: 0,
        borderWidth: 1,
      },
      toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1, // Set a higher zIndex to ensure the toolbar is above the editor
      },
    })
    const contentWidth = useWindowDimensions().width;

return(
    <>
    <SafeAreaView style={styles.toolbar}>

    </SafeAreaView>
      {noteContent !== 'Loading...' && 

    <ScrollView style={{width: '100%', flex: 1,height: '100%', padding: 15, backgroundColor: themes.colors.background}} 
        onLayout={handleScrollViewLayout} >
      
      <HTML source={{ html: noteContent }} baseFontStyle={{fontSize: 30,}} 
        tagsStyles={tagsStyles}/>
    </ScrollView>}
    
    <FAB onPress={()=>{setLocation('home')}} 
    style={styles.upBtn}
    icon="home"
    color="white"
    />
    
  <FAB
  icon="pen"
  color="white"
  label="Edit note"
  style={styles.fab}
  onPress={()=>{setLocation('edit'); setTitleBack('note')}} 
/>
  </>
  )
}
export default Note;