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
           <Stack.Screen 
            name="VerificationCodeScreen" 
            component={VerificationCodeScreen} 
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
            name="RecipeSearchScreen" 
            component={RecipeSearchScreen} 
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
            name="DietaryRestrictionsScreen" 
            component={DietaryRestrictionsScreen} 
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
            name="DietsScreen" 
            component={DietsScreen} 
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
            name="AllergiesScreen" 
            component={AllergiesScreen} 
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
            name="FavoritesScreen" 
            component={FavoritesScreen} 
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
            name="IndividualRecipeScreen" 
            component={IndividualRecipeScreen} 
            options={
              {
                title: appTitle,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 25,
                }
              }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}