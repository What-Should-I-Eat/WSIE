import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView,Image} from 'react-native';
import {appBackgroundColor, mainIndigoButtonBackground, blueClicked, navBarPadding} from "../calls/styleSheets";
import {loggedInUser, onLogout} from "../calls/loginCalls";
import {buttons} from '../calls/styleSheets';

export default function WelcomeScreen({navigation}) {

    return (
        <SafeAreaView style={guestStyles.container}>
                <View style={guestStyles.content}>
                    <Image
                        source={require('../assets/man-user-circle-icon.png')}
                        style={guestStyles.images}
                    />
                    <Text style={guestStyles.welcomeText}>{loggedInUser}</Text>
                    <View style={buttons.buttonColumn}>
                        <View style={buttons.buttonRow}>
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed ? blueClicked : '#4567b7',
                                    },
                                    buttons.newUserButton
                                ]}
                                onPress={() => {
                                    navigation.navigate("DietsScreen");
                                }}
                            >
                                <Text style={guestStyles.buttonText}>Dietary Restrictions</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                                    },
                                    buttons.newUserButton
                                ]}
                                onPress={() => {
                                    navigation.navigate("AllergiesScreen");
                                }}
                            >
                                <Text style={guestStyles.buttonText}>Food Allergies</Text>
                            </Pressable>
                        </View>
                        <View style={buttons.buttonRow}>
                            {/* <View style= {buttons.emptyButtonStd}/>                       */}
                            <Pressable
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: pressed ? blueClicked : '#E74C3C',
                                    },
                                    buttons.buttonStd
                                ]}
                                onPress={() => {
                                    onLogout();
                                    navigation.navigate("LoginScreen");
                                }}
                            >
                            
                                <Text style={guestStyles.buttonText}>Logout</Text>
                            </Pressable>
                            {/* <View style= {buttons.emptyButtonStd}/>                                                 */}
                            
                        </View>
                    </View>
                </View>
        </SafeAreaView>
    );
}

const guestStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appBackgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: navBarPadding
    },
    content: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 15,
    },
    statusText: {
        fontSize: 24,
        marginBottom: 10,
    },
    roleText: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 40,
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 140,
        height: 50,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    images: {
        width: 300,
        height: 300,
        
        resizeMode: 'contain',
        marginVertical: 10,
      },
});