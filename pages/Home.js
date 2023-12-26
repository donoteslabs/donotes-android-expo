import * as React from 'react';
import { StyleSheet ,ScrollView, View, Text, RefreshControl  } from 'react-native';
import { FAB , Card} from 'react-native-paper';
import { Appbar ,Icon,Button, TouchableRipple,
  ActivityIndicator, } from 'react-native-paper';

function Home({themes, setShowTitle, setTitleBack, setTitleText, setLocation, loggedIn,loaded, setActiveNote,
  nP,
  fID,
  num,
  socket,
  fN,
  fP,
  sessionId,
  nID,
  nN,
}) {
  const [folderParent, setFolderParent] = React.useState('root');
  const [upParent, setUpParent] = React.useState('root');
  const [refreshing, setRefreshing] = React.useState(false);
  React.useEffect(()=>{
    console.log(loggedIn);
    if(loggedIn === false) {
      setLocation('login');
    }
  }, [])
  React.useEffect(()=>{
    setTitleText('Home')
    setTitleBack(false);
    setShowTitle(true);
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    
    
    const requestMessage2 = JSON.stringify({ type: 'request', sessionId: sessionId, folders: 'fetch' });
    socket.send(requestMessage2);
    const requestMessage3 = JSON.stringify({ type: 'request', sessionId: sessionId, notes: 'fetch' });
    socket.send(requestMessage3);
  };
  React.useEffect(()=>{
    setRefreshing(false);
  }, [num])
  const getParentById = (id) => {
    const index = fID.indexOf(id);
  
    if (index !== -1) {
      return fP[index];
    }
  
    return 'root'; // Return default if the ID is not found
  };

  const getFolders = (parentId) => {
    const matchingEntries = fP.reduce((acc, parent, index) => {
      if (parent === parentId || (parentId === 'root' && parent === 'root')) {
        acc.push({ id: fID[index], name: fN[index], parent });
      }
      return acc;
    }, []);

    return matchingEntries;
  };

  const renderFolders = (parentId) => {
    console.log('Hi' + getParentById(parentId))
    React.useEffect(()=>{
      setUpParent(getParentById(parentId));

    }, [parentId])
    const matchingEntries = getFolders(parentId);
    if (matchingEntries.length === 0) {
      return null;
    }

    return (
        <>
        {matchingEntries.map(({ id, name, parent }) => (
          
  
    <Card style={styles.card} key={id} >
      
      <TouchableRipple
          onPress={() => {setFolderParent(id); setUpParent(parent); setTitleText(name)}}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.card}
        >
    <Card.Content>
      <Icon source="folder" size={50} color="#edc74c" />
      <Text variant="bodyMedium" style={{color: themes.colors.onBackground}}>{name}</Text>
    </Card.Content>
  </TouchableRipple>
  </Card>
        ))}
      </>

      

    );
  };
  const getNotes = (parentId) => {
    const matchingEntries = nP.reduce((acc, parent, index) => {
      if (parent === parentId || (parentId === 'root' && parent === 'root')) {
        acc.push({ id: nID[index], name: nN[index], parent });
      }
      return acc;
    }, []);

    return matchingEntries;
  };
  const renderNotes = (parentId) => {
    const matchingEntries = getNotes(parentId);
    if (matchingEntries.length === 0) {
      return null;
    }

    return (
        <>
        {matchingEntries.map(({ id, name, parent }) => (
          
  
    <Card style={styles.card} key={id} >
      
      <TouchableRipple
          onPress={() => {setActiveNote(id); setLocation('note')}}
          rippleColor="rgba(0, 0, 0, .32)"
          style={styles.card}
        >
    <Card.Content>
      <Icon source="note-text" size={50} color={themes.colors.primary} />
      <Text variant="bodyMedium"  style={{color: themes.colors.onBackground}}>{name}</Text>
    </Card.Content>
  </TouchableRipple>
  </Card>
        ))}
      </>

      

    );
  };

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
    card: {
      width: 155,
      height: 155,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    }
  })
  
return(
  <>
  <ScrollView style={{width: '100%'}} contentStyle={{justifyContent: 'center'}}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#0000ff']} // Set the color of the refresh indicator
    />
  }>
  <View style={styles.container}>
    {!loaded && 
  <View style={{width: '100%'}}><ActivityIndicator animating={true} color={themes.colors.primary} /></View>}
  {renderFolders(folderParent)}
  {renderNotes(folderParent)}
  </View>

  </ScrollView>
  {folderParent !== 'root' &&
  <FAB onPress={()=>{setFolderParent(upParent)}} 
  style={styles.upBtn}
  icon="arrow-up"
  color="white"
  />}
  {/** 
  <FAB
  icon="pen"
  color="white"
  label="New"
  style={styles.fab}
  onPress={() => console.log('Pressed')}
/>*/}
</>
)
}
export default Home;