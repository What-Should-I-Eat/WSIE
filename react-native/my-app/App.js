// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import NewUserScreen from './components/NewUserScreen';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  const appTitle = "WSIE";
  return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={
              {
                title: appTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={
              {
                title: appTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={
              {
                title: appTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
           <Stack.Screen 
            name="NewUserScreen" 
            component={NewUserScreen} 
            options={
              {
                title: appTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
         {/* <Stack.Screen 
            name="AddFilmScreen" 
            component={AddFilmScreen} 
            options={
              {
                title: courseTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
          <Stack.Screen 
            name="UpdateFilmScreen" 
            component={UpdateFilmScreen} 
            options={
              {
                title: courseTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
}