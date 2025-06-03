import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";

export default function GuestWelcomeScreen({ navigation }) {

    return (
        <SafeAreaView style={guestStyles.container}>
            <View style={guestStyles.content}>
                <Text style={guestStyles.welcomeText}>Welcome</Text>
                <Text style={guestStyles.statusText}>You are logged in</Text>
                <Text style={guestStyles.roleText}>Your role is "guest"</Text>

                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? blueClicked : '#E74C3C',
                        },
                        guestStyles.logoutButton
                    ]}
                    onPress={() => {
                        navigation.navigate("LoginScreen");
                    }}
                >
                    <Text style={guestStyles.buttonText}>Logout</Text>
                </Pressable>
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
});