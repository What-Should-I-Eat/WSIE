import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { NavBar,iconColor,iconHeight} from '../calls/styleSheets';
import { View, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {loggedInUser, requestLogin} from "../calls/loginCalls";

// var iconHeight = 26;


export default function FloatingNavBar() {
    const navigation = useNavigation();
        
    const handleAccountPress = () => {
        if (!requestLogin) {
            navigation.navigate("WelcomeScreen");
        } else {
            navigation.navigate("LoginScreen");
        }
    };
    return (
        <View style={NavBar.Container}>
            <View style={NavBar.Format}>
                <Pressable
                    title="Account"
                    onPress={handleAccountPress}
                    style={NavBar.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="user-circle" size={iconHeight} color={iconColor}/>
                </Pressable>
                <Pressable
                    title="FavoritesScreen"
                    onPress={() => navigation.navigate("FavoritesScreen")}
                    style={NavBar.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="heart" size={iconHeight} color={iconColor}/>
                </Pressable>
                <Pressable
                    title="Go to Recipe Search"
                    onPress={() => navigation.navigate("RecipeSearchScreen")}
                    style={NavBar.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="search" size={iconHeight} color={iconColor}/>
                </Pressable>
                <Pressable
                    title="Dietary Restrictions"
                    onPress={() => navigation.navigate("DietaryRestrictionsScreen")}
                    style={NavBar.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome6 name="bowl-food" size={iconHeight} color={iconColor}/>
                </Pressable>
            </View>
        </View>
    );
}