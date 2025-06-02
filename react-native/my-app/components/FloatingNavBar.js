import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

var iconHeight = 26;
var iconWidth = 26;

export default function FloatingNavBar() {
    const navigation = useNavigation();

    return (
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <Pressable
                    title="Home"
                    onPress={() => navigation.navigate("Home")}
                    style={styles.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="home" size={iconHeight} color='#448aff'/>
                </Pressable>
                <Pressable
                    title="Account"
                    onPress={() => navigation.navigate("LoginScreen")}
                    style={styles.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="user-circle" size={iconHeight} color='#448aff'/>
                </Pressable>
                <Pressable
                    title="Go to Recipe Search"
                    onPress={() => navigation.navigate("RecipeSearchScreen")}
                    style={styles.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome name="search" size={iconHeight} color='#448aff'/>
                </Pressable>
                <Pressable
                    title="Dietary Restrictions"
                    onPress={() => navigation.navigate("DietaryRestrictionsScreen")}
                    style={styles.IconBehave}
                    android_ripple={{borderless:true, radius:50}}
                >
                    <FontAwesome6 name="bowl-food" size={iconHeight} color='#448aff'/>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 20,
        left: 0,
        right: 0,
        zIndex: 1000,
        pointerEvents: 'box-none',
    },
    NavBar: {
        flexDirection:'row',
        backgroundColor: '#eee',
        width: '90%',
        justifyContent: 'space-evenly',
        borderRadius: 40
    },
    IconBehave: {
        padding: 14
    },
});