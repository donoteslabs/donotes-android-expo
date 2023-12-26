import * as React from 'react';
import { Image, StyleSheet, Text , View} from 'react-native';
import { Avatar, Divider , Button, Icon, MD3LightTheme,
  MD3DarkTheme} from 'react-native-paper';
import { IconButton,Drawer, Badge } from 'react-native-paper';

function SideBar({themes, username, profilePic, Logout, setDefaultTheme, DefaultTheme}) {
    
const styles = StyleSheet.create({
    username: {
        width: '90%',
        backgroundColor: themes.colors.surfaceVariant,
        textAlign: 'left',
        padding: 15,
        flex: 1,
        height: 80,
        maxHeight: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 55, 
    },
    usernameBox: {
        color: themes.colors.onBackground,
    },
    
    container: {
        flex: 1,
        marginTop: 105,
        marginBottom: 25,
        width: '100%',
        alignItems: 'center', // Center items horizontally
        justifyContent: 'space-between', // Center items vertically
      },
    btn1: {
        width: '100%',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    item: {
      margin: 16,
    },
    button: {
      opacity: 0.6,
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    label: {
      flex: 1,
    },
    tinyLogo: {
        backgroundColor: themes.colors.background,
        width: 54,
        height: 54,
        borderRadius: 27,
    }
});
return(
    
    <View style={styles.container}>
      <View style={styles.username}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: profilePic,
        }}
      />
        <Text style={styles.usernameBox}>{username}</Text>
        <IconButton icon="shield-account-outline" onPress={()=>{}} />
      </View>
      <View style={{marginTop: 15, width: '100%'}}>
      <View style={styles.item}>
        <Button contentStyle={{
        flexDirection: 'row', // Align icon and text horizontally
        justifyContent: 'flex-start', // Align icon to the start (left)
        alignItems: 'center', // Center items vertically
      }} icon="bell" style={styles.btn1} mode='contained' textColor='white' onPress={()=>{}}>Notifications</Button>
        <Badge style={styles.badge}>
            200
        </Badge>
      </View>
      </View>
      <Button mode="contained" onPress={()=>{
        if(DefaultTheme === MD3LightTheme) {
          setDefaultTheme(MD3DarkTheme)

        }else {
          
        setDefaultTheme(MD3LightTheme);
        }
        }} textColor='white' >
        {DefaultTheme === MD3DarkTheme ? 'Light mode' : 'Dark mode'}
      </Button>
      <Button icon="logout" style={{width: '90%'}} 
      contentStyle={{
        flexDirection: 'row', // Align icon and text horizontally
        justifyContent: 'flex-start', // Align icon to the start (left)
        alignItems: 'center', // Center items vertically
      }} mode='outlined' textColor={themes.colors.onBackground} onPress={()=>{Logout()}}>Logout</Button>
    </View>
)
}
export default SideBar;