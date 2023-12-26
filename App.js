import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { TouchableOpacity,StyleSheet, Text, View , Animated} from 'react-native';
import { Appearance, useColorScheme , DrawerLayoutAndroid} from 'react-native';
import {Dialog, Portal, Button,
  MD3LightTheme,
  ActivityIndicator,
  Drawer,
  Modal,
  ProgressBar,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';

import Note from './pages/Note';
import WebSocketComponent from './Server/Websocket';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { SafeAreaView } from 'react-native-safe-area-context';

import TermsAndConditions from './pages/Terms';
import NavBar from './Components/Navbar';
import Home from './pages/Home';
import TinyMCEEditor from './pages/MyWeb';
import SideBar from './Components/Sidebar';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}
export default function App() {
  
  const drawer = React.useRef(null);
  //Theming
  let colorScheme = useColorScheme();
  const [DefaultTheme, setDefaultTheme] = React.useState(MD3LightTheme);
  //Detect device theme on init
  React.useEffect(()=> {
    if(colorScheme === 'dark') {
      setDefaultTheme(MD3DarkTheme);
    }else {
      setDefaultTheme(MD3LightTheme);
    }
  }, [colorScheme]);
  //Prepare theme package
  const themes = {
    ...DefaultTheme,
    
    colors: {
      ...DefaultTheme.colors,
      primary: '#5271FF',
      onPrimary: '#394fb2',
      secondary: '#36d7b7',
    },
    
  };
  //Styles

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themes.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: themes.colors.onBackground,
    },
    sidebar: {
      flex: 1,
      backgroundColor: '#333',
      padding: 20,
    },
    sidebarItem: {
      marginBottom: 10,
    },
    activeText: {
      color: 'white',
      fontWeight: 'bold',
    },
    inactiveText: {
      color: '#999',
    },
  });
  const [username, setUsername] = React.useState('there');
  const [location, setLocation] = React.useState('login');
  const [showTitle, setShowTitle] = React.useState(false);
  const [titleText, setTitleText] = React.useState('Home');
  const [titleBack, setTitleBack] = React.useState('home');
  const [sessionId, setSessionId] = React.useState(null);
  const [socket, setSocket] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState('Notice');
  const [dialogTitle, setDialogTitle] = React.useState('Notice');
  const [profilePic, setProfilePic] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [homeLoaded, setHomeLoaded] = React.useState(false);
  const [loaderVisible, setloaderVisible] = React.useState(true);
  const [activeNote, setActiveNote] = React.useState(null);
  const [nN, sNN] = React.useState([]);
  const [nP, sNP] = React.useState([]);
  const [fP, sFP] = React.useState([]);
  const [noteName, setNoteName] = React.useState(null);
  const [noteContent, setNoteContent] = React.useState(null);
  const [nID, sNID] = React.useState([]);
  const [fId, sFID] = React.useState([]);
  const [num, setNum] = React.useState(0);
  const [clientId, setClientId] = React.useState(null);
  const [fN, sFN] = React.useState([]);
  const [init, setInit] = React.useState(false);
  const showLoader = () => setloaderVisible(true);
  const hideLoader = () => setloaderVisible(false);
  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <SideBar themes={themes} username={username} profilePic={profilePic} Logout={Logout} setDefaultTheme={setDefaultTheme} DefaultTheme={DefaultTheme}/>
    </View>
  );
  function mainCloseDrawer() {
    drawer.current.closeDrawer()
  }
  //Log out
  async function Logout() {

    const generateSessionId = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    //Set SessionId to null
    
    const newSession = generateSessionId();
    await save('sessionId', newSession); 
    console.log('New id')
    console.log(newSession);
    setLoggedIn(false);
    setUsername('there');
    mainCloseDrawer();
    setProfilePic(null);
    setLocation('login')
    setShowTitle(false);
    setSessionId(newSession);
    
    const messageObject = {
      type: 'signout',
      sessionId: sessionId,
    };
    

    sFID([]);
    sFN([]);
    sFP([]);
    sNID([]);
    sNN([]);
    sNP([]);
    setNoteName(null);
    setNoteContent(null);
    setActiveNote(null);

    socket.send(JSON.stringify(messageObject));
    
  }
  const showDialog = () => setDialogVisible(true)

  const hideDialog = () => setDialogVisible(false);
  
  const [activeItem, setActiveItem] = React.useState('Home');

  // Function to handle sidebar item clicks
  const handleItemClick = (item) => {
    setActiveItem(item);
    // Perform navigation or other actions based on the clicked item
    // For simplicity, just log the clicked item for now
    console.log(`Clicked on ${item}`);
  };
  function mainOpenDrawer() {
    drawer.current.openDrawer()
  }
  //Set SessionId
  const [attempt, setAttempt] = React.useState(0);
  
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSession = await getValueFor('sessionId');
        console.log(fetchedSession);
        if (fetchedSession !== null) {
          setSessionId(fetchedSession);
        } else {
          const newAttempt = attempt + 1;
          setAttempt(newAttempt);
          const newSession = generateSessionId();
          await save('sessionId', newSession);
          setSessionId(newSession);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  
  const containerStyle = {
    backgroundColor: themes.colors.background, 
    padding: 20,
  width: '100%',
  height: 100,
  alignItems: 'center', // Center horizontally
  justifyContent: 'center',
};
const loaderView = {
  
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 20,
}
const checkFalse = false;
  return (
    
    <PaperProvider theme={themes}>
    
    <ProgressBar progress={progress} animatedValue={progress} color={themes.colors.secondary} />
    <Portal>
      <Modal dismissable={checkFalse} visible={loaderVisible} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={containerStyle}>
          <View style={loaderView}>
            <ActivityIndicator animating={true} color={themes.colors.primary} />
            <Text style={{color: themes.colors.onBackground}}>Loading</Text>
          </View>
        </View>
      </Modal>
    </Portal>
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition='right'
      renderNavigationView={navigationView}>
    {showTitle && <NavBar mainOpenDrawer={mainOpenDrawer} themes={themes} loggedIn={loggedIn} setLoggedIn={setLoggedIn} titleText={titleText} titleBack={titleBack} setLocation={setLocation}/>}
    <WebSocketComponent setNoteName={setNoteName} setNoteContent={setNoteContent}  setClientId={setClientId} clientId={clientId} setNum={setNum} setInit={setInit} setHomeLoaded={setHomeLoaded} sFID={sFID} sFN={sFN} sFP={sFP} sNID={sNID} sNN={sNN} sNP={sNP} setLoaderVisible={setloaderVisible} setProfilePic={setProfilePic} setUsername={setUsername} sessionId={sessionId} setLoggedIn={setLoggedIn} setLocation={setLocation} setDialogMessage={setDialogMessage} setDialogTitle={setDialogTitle} showDialog={showDialog} setDialogVisible={setDialogVisible} socket={socket} setSocket={setSocket} sessionId={sessionId}/>
       
    {location == 'edit' && 
      <View style={{flex: 1, height: 800}}>
        <TinyMCEEditor setNoteContent={setNoteContent} noteContent={noteContent} themes={themes} DefaultTheme={DefaultTheme} socket={socket} sessionId={sessionId} clientId={clientId} activeNote={activeNote}/>

      </View>
      }
      {location !== 'edit' && 
      <View style={styles.container}>
        
        {/** Dialog */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Content>
              <Text style={{color: themes.colors.onBackground}}>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {/**End dialog */}
        {location == 'home' && <Home socket={socket} num={num} sessionId={sessionId} setActiveNote={setActiveNote} loaded={homeLoaded} fID={fId} fN={fN} fP={fP} nID={nID} nN={nN} nP={nP}  loggedIn={loggedIn} themes={themes} titleText={titleText} setTitleText={setTitleText} setShowTitle={setShowTitle} setTitleBack={setTitleBack} setLocation={setLocation}/>}
        {location == 'note' && <Note setLocation={setLocation} noteName={noteName} noteContent={noteContent} setNoteName={setNoteName} setNoteContent={setNoteContent} clientId={clientId} setInit={setInit} init={init} sessionId={sessionId} socket={socket} activeNote={activeNote} setActiveNote={setActiveNote} loggedIn={loggedIn} themes={themes} titleText={titleText} setTitleText={setTitleText} setShowTitle={setShowTitle} setTitleBack={setTitleBack} />}
        {location == 'login' && <Login setloaderVisible={setloaderVisible} loggedIn={loggedIn} sessionId={sessionId} socket={socket} themes={themes} setTitleText={setTitleText}  themes={themes} setLocation={setLocation} setShowTitle={setShowTitle} /> }
        {location == 'signup' && <SignUp setloaderVisible={setloaderVisible} loggedIn={loggedIn} sessionId={sessionId} socket={socket} themes={themes} setTitleText={setTitleText} setLocation={setLocation} setShowTitle={setShowTitle} setTitleBack={setTitleBack}/> }
        {location == 'terms' && <TermsAndConditions themes={themes} showTitle={showTitle} setShowTitle={setShowTitle} setTitleText={setTitleText}/>} 
        
      </View>
      }
      <StatusBar style="auto" />
      </DrawerLayoutAndroid>
    </PaperProvider>
  );
}

