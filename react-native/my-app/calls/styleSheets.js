import { View, Pressable, StyleSheet } from 'react-native';


/*
Navigation Bar Stlye Sheet
*/
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
/*
Common buttons used throughout application
*/
const buttons = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        width: 290,
        margin: 5,
    },
    buttonColumn: {
        flexDirection: 'column',
        // justifyContent: 'space-between',
        margin:10
    },
    buttonStd: {
        flex: 1,  
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        margin: 5,
        borderWidth: 1,
    },
    emptyButtonStd: {
        // flex: 1,  
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    loginButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 140,
        height: 66,
        marginBottom: 20,
    },
    forgotPasswordButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 290,
        height: 66,
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -10,
    },
    newUserButton: {
        flex: 1,  
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        margin: 5,
        borderWidth: 1,
  },
    buttonText:{
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    },
    buttonTextSmall:{
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    }
})

/*
Constants utilized through out application
*/
const iconHeight = 26;
const iconColor = '#448aff'
const navBarPadding = iconHeight + NavBar.IconBehave.padding + 40 //Key constant to controlling padding between nav bar and screen containers
const appBackgroundColor = "#fafafa";
const mainIndigoButtonBackground = "#4c4b63";
const blueClicked = "#5386e4";

/**
 * Exporting constants
 */
export { appBackgroundColor,iconHeight,iconColor,navBarPadding, mainIndigoButtonBackground, blueClicked }
/**
 * Stylesheets
 */
export {NavBar,buttons}