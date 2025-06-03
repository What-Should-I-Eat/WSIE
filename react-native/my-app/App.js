import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import NewUserScreen from './components/NewUserScreen';
import VerificationCodeScreen from './components/VerificationCodeScreen';
import Home from './components/Home';
import RecipeSearchScreen from './components/RecipeSearchScreen';
import DietaryRestrictionsScreen from './components/DietaryRestrictionsScreen';
import DietsScreen from './components/DietsScreen';
import AllergiesScreen from './components/AllergiesScreen';
import FavoritesScreen from './components/FavoritesScreen';
import IndividualRecipeScreen from './components/IndividualRecipeScreen';
import IndividualFavoritesScreen from './components/IndividualFavoritesScreen';
import UploadRecipeScreen from './components/UploadRecipeScreen';
import FloatingNavBar from "./components/FloatingNavBar";
import GuestWelcomeScreen from "./components/GuestWelcomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const appTitle = "WSIE";
  const backButton = "Back";
  return(
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={
                    {
                        title: "Home",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 25,
                        },
                        headerBackTitle: 'Logout'
                    }}
            />
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
              }}
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
                name="GuestWelcomeScreen"
                component={GuestWelcomeScreen}
                options={
                    {
                        title: "Guest Mode",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 25,
                        },
                        headerBackTitle: backButton
                    }}
            />
        </Stack.Navigator>
          <FloatingNavBar />
      </NavigationContainer>
    );
}