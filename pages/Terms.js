import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';

const TermsAndConditions = ({themes, setShowTitle, setTitleText}) => {
  useEffect(()=>{
    setShowTitle(true);
    setTitleText('Terms & Conditions');
  }, [])
const styles = StyleSheet.create({
  text: {
    color: themes.colors.onBackground,
  },
    container: {
      margin: 10,
    },
    heading: {
      color: themes.colors.secondary,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    bold: {
      fontWeight: 'bold',
    },
    link: {
      color: themes.colors.tertiary,
      textDecorationLine: 'underline',
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}><Text style={styles.bold}>Terms and Conditions for DoNotes App</Text></Text>
      <Text style={styles.heading}><Text style={styles.bold}>1. Introduction</Text></Text>
      <Text style={styles.text}>Welcome to DoNotes, a live collaborative note-taking app provided by [DoNotes]. By accessing and using this app, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our app.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>2. User Accounts</Text></Text>
      <Text style={styles.text}>To access live collaborative note-taking features, users must create an account. During account creation, users provide accurate and complete information. Users are responsible for maintaining the confidentiality of their account information.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>3. Data Privacy</Text></Text>
      <Text style={styles.text}>User notes are stored on a MySQL database hosted on Namecheap. While every effort is made to ensure data integrity, users are encouraged to report any vulnerabilities or concerns regarding data privacy to <Text style={styles.link} onPress={() => { Linking.openURL('mailto:info@donotes.app'); }}>info@donotes.app</Text>.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>4. User Responsibilities</Text></Text>
      <Text style={styles.text}>Users agree not to upload, share, or engage in the creation of content that is sexual, indecent, or illegal. Any abusive behavior or misuse of the system may result in the termination of the user's account, subject to a 3-strike system. Users must adhere to a code of conduct that prohibits attempts to hack the system, abuse facilities, or utilize services for image/video hosting or distribution.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>5. Intellectual Property</Text></Text>
      <Text style={styles.text}>Users retain ownership of the notes they create on the app. By using the app, users grant [DoNotes] a non-exclusive, royalty-free license to use, reproduce, modify, and display the content solely for the purpose of operating and improving the app.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>6. Code of Conduct</Text></Text>
      <Text style={styles.text}>Users must not engage in any activities that may compromise the security or integrity of the app. Any attempt to hack, reverse engineer, or otherwise interfere with the app's functionality is strictly prohibited. Users should report any security vulnerabilities to <Text style={styles.link} onPress={() => { Linking.openURL('mailto:info@donotes.app'); }}>info@donotes.app</Text>.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>7. Termination of Accounts</Text></Text>
      <Text style={styles.text}>Accounts may be terminated if users violate any of the terms outlined herein or engage in offensive behavior on a 3-strike basis. Account termination at the user's request is not guaranteed and is subject to review.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>8. Updates and Changes</Text></Text>
      <Text style={styles.text}>Users must accept all new terms to continue using the app. New terms will be communicated via email and a pop-up upon login. Continued use of the app constitutes acceptance of the updated terms.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>9. Liability and Disclaimers</Text></Text>
      <Text style={styles.text}>[DoNotes] is not liable for any data loss. While every effort is made to ensure the app's proper functioning, users experiencing issues due to misconduct or other reasons should contact the support team at <Text style={styles.link} onPress={() => { Linking.openURL('mailto:info@donotes.app'); }}>info@donotes.app</Text>. [DoNotes] will not modify user content except upon the user's request or during support issues that require data adjustments.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>10. Dispute Resolution</Text></Text>
      <Text style={styles.text}>In the event of disputes, [DoNotes] encourages users to engage in informal resolution. If resolution cannot be achieved informally, [DoNotes] reserves the right to pursue other dispute resolution mechanisms as deemed appropriate.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>11. Governing Law</Text></Text>
      <Text style={styles.text}>These terms are governed by the laws of the United Kingdom. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of the United Kingdom.</Text>
      <Text style={styles.heading}><Text style={styles.bold}>12. Contact Information</Text></Text>
      <Text style={styles.text}>For support, inquiries, and reporting issues, users can contact the support team at <Text style={styles.link} onPress={() => { Linking.openURL('mailto:info@donotes.app'); }}>info@donotes.app</Text>.</Text>
    </ScrollView>
  );
};


export default TermsAndConditions;
