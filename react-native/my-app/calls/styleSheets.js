import { View, Pressable, StyleSheet } from 'react-native';

const NavBar = StyleSheet.create({
    Container: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
    },
    Format: {
        flexDirection:'row',
        backgroundColor: '#eee',
        width: '90%',
        justifyContent: 'space-evenly',
        borderRadius: 40
    },
    IconBehave: {
        padding:14
    },
});

const iconHeight = 26;
const iconColor = '#448aff'
const navBarPadding = iconHeight + NavBar.IconBehave.padding + 40
const appBackgroundColor = "#fafafa";
const mainIndigoButtonBackground = "#4c4b63";
const blueClicked = "#5386e4";

export { appBackgroundColor,iconHeight,iconColor, NavBar, navBarPadding, mainIndigoButtonBackground, blueClicked }