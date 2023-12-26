import * as React from 'react';
import { Appbar } from 'react-native-paper';

const NavBar = ({titleText, titleBack, setLocation, loggedIn, themes, mainOpenDrawer}) => (
  <Appbar.Header style={{backgroundColor: themes.colors.surfaceVariant}}>
    {titleBack && 
    <Appbar.BackAction onPress={() => {setLocation(titleBack)}} />
  }
    <Appbar.Content title={titleText} />
    
    {loggedIn && <Appbar.Action icon="dots-vertical" onPress={() => {mainOpenDrawer()}} />}
  </Appbar.Header>
);

export default NavBar;