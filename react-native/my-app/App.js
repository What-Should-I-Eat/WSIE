import React, {useEffect,useState} from 'react';
import {NavigationContainer, useIsFocused, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {requestLogin, loggedInUser, onLogin, onGuestLogin} from './calls/loginCalls';

import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import NewUserScreen from './components/NewUserScreen';
import VerificationCodeScreen from './components/VerificationCodeScreen';
import RecipeSearchScreen from './components/RecipeSearchScreen';
import DietaryRestrictionsScreen from './components/DietaryRestrictionsScreen';
import DietsScreen from './components/DietsScreen';
import AllergiesScreen from './components/AllergiesScreen';
import FavoritesScreen from './components/FavoritesScreen';
import IndividualRecipeScreen from './components/IndividualRecipeScreen';
import IndividualFavoritesScreen from './components/IndividualFavoritesScreen';
import UploadRecipeScreen from './components/UploadRecipeScreen';
import FloatingNavBar from "./components/FloatingNavBar";
import WelcomeScreen from "./components/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const appTitle = "WSIE";
  const backButton = "Back";

  const [currentRouteName, setCurrentRouteName] = useState('');

  const onNavigationStateChange = (state) => {
      const routeName = state?.routes[state.index]?.name;
      setCurrentRouteName(routeName);
  };

  const shouldShowNavBar = currentRouteName !== 'LoginScreen';

  return(
    <NavigationContainer onStateChange={onNavigationStateChange}>
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
                },
              }}
    
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={
              {
                title: "Forgot Password",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="NewUserScreen" 
            component={NewUserScreen} 
            options={
              {
                title: "New WSIE User",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }
            }
          />
           <Stack.Screen 
            name="VerificationCodeScreen" 
            component={VerificationCodeScreen} 
            options={
              {
                title: "Verify Account",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="RecipeSearchScreen" 
            component={RecipeSearchScreen} 
            options={
              {
                title: "Recipe Search",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="DietaryRestrictionsScreen" 
            component={DietaryRestrictionsScreen} 
            options={
              {
                title: "Update Preferences",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="DietsScreen" 
            component={DietsScreen} 
            options={
              {
                title: "Update Diets",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="AllergiesScreen" 
            component={AllergiesScreen} 
            options={
              {
                title: "Update Allergies",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="FavoritesScreen" 
            component={FavoritesScreen} 
            options={
              {
                title: "Favorites",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="IndividualRecipeScreen" 
            component={IndividualRecipeScreen} 
            options={
              {
                title: "Recipe View",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="IndividualFavoritesScreen" 
            component={IndividualFavoritesScreen} 
            options={
              {
                title: "Recipe View",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
           <Stack.Screen 
            name="UploadRecipeScreen" 
            component={UploadRecipeScreen} 
            options={
              {
                title: "Upload Recipe",
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                },
                headerBackTitle: backButton
              }}
          />
            <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                options={
                    {
                        title: "Welcome",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 25,                
                        },
                    headerBackTitle: backButton
                  }}
            />
        </Stack.Navigator>        
        {shouldShowNavBar && <FloatingNavBar />}
      </NavigationContainer>
    );
}