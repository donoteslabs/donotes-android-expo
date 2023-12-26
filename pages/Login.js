
import * as React from 'react';
import { View, AppRegistry ,  TouchableWithoutFeedback, Keyboard } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Surface,Divider, Text , TextInput, Button ,TouchableRipple } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Login = ({themes, setLocation, socket, sessionId, loggedIn, setloaderVisible}) => {
  React.useEffect(()=>{
    if(loggedIn === true) {
      setLocation('home');
    }
  }, [loggedIn]);
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const passwordInputRef = React.useRef(); 
  const styles = StyleSheet.create({
    surface: {
      padding: 8,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      
      fontSize:30,
      marginBottom: 20, 
    }
  });
  
  function handleSignIn() {
        setloaderVisible(true);
    if (socket && userName.trim() !== '' && password.trim() !== '') {
        const fetch = userName + password;
        const messageObject = {
          type: 'signin',
          sessionId: sessionId,
          credentials: {
            method: 'signin',
            username: userName,
            fetch,
          },
        };
        console.log('Sending to server:', messageObject);
        socket.send(JSON.stringify(messageObject));
      }
}
  return(
    <Surface style={styles.surface} elevation={0} theme={themes}>
      <Text style={styles.title}>
        Sign in to DoNotes
      </Text>
      
      <Button icon="google" mode="outlined" textColor={themes.colors.onBackground} style={{
        width: '100%',
        
        marginTop: 10,
        marginBottom: 10,
      }} 
      onPress={() => {}}>
        Sign in with Google
      </Button>
      <TextInput
      mode='outlined'
        label="Username"
        value={userName}
        onChangeText={userName => setUserName(userName)}
        returnKeyType="go" 
        onSubmitEditing={() => passwordInputRef.current.focus()} // Move to the password input
        style={
          {
            width: '100%',
          }
        }
      />
      <TextInput
      mode='outlined'
      ref={passwordInputRef} // Set the ref for the password input

        label="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={password => setPassword(password)}
        onSubmitEditing={() => handleSignIn()}
        style={
          {
            marginTop: 5,
            width: '100%',
          }
        }
      />
      <Divider/>
      <Button mode="contained"  onPress={() => {handleSignIn()}} style={{width: '100%', marginTop: 10}} textColor={themes.colors.background}>
        Sign in
      </Button>
      <Text style={{marginTop: 15}}>
        Don't have an account? 
            <Text style={{color: themes.colors.secondary}} onPress={() => {setLocation('signup')}}> Sign up</Text>
      </Text>
    </Surface>
  );
}
  export default Login;
  
  
