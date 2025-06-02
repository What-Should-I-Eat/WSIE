import React from "react";
// import Icon from 'react-native-ico-material-design';
// import Icon from 'react-native-ico-modern-ui';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { View, Text, Pressable, StyleSheet } from "react-native";
import { loggedInUser } from "../calls/loginCalls";
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";


var iconHeight = 26
var iconWidth = 26

export default function Home({ navigation }) {
  state = {
    screenText: 'Press a Button!'
  }

  changeText = (text) => {
    console.log(text + ' has been pressed!')
    this.setState({
      screenText: text
    })
  }

    return(
      <View style={styles.containerHome}>
        
        <View>
          <Text style={{fontSize:30, color:'Black'}}>{this.state.screenText}</Text>
        </View>
        
        {/*<View style={styles.NavContainer}>*/}
        {/*  <View style={styles.NavBar}>*/}
        {/*      <Pressable*/}
        {/*          title="Account"*/}
        {/*          onPress={() => navigation.navigate("LoginScreen")}*/}
        {/*          style={styles.IconBehave}*/}
        {/*          android_ripple={{borderless:true, radius:50}}*/}
        {/*      >*/}
        {/*          <FontAwesome name="user-circle" size={iconHeight} color='#448aff'/>*/}
        {/*      </Pressable>*/}
        {/*      <Pressable*/}
        {/*          title="Go to Recipe Search"*/}
        {/*          onPress={() => navigation.navigate("RecipeSearchScreen")}*/}
        {/*          style={styles.IconBehave}*/}
        {/*          android_ripple={{borderless:true, radius:50}}*/}
        {/*      >*/}
        {/*          <FontAwesome name="search" size={iconHeight} color='#448aff'/>*/}
        {/*      </Pressable>*/}
        {/*    <Pressable*/}
        {/*      title="Dietary Restrictions"*/}
        {/*      onPress={() => navigation.navigate("DietaryRestrictionsScreen")}*/}
        {/*      style={styles.IconBehave}*/}
        {/*      android_ripple={{borderless:true, radius:50}}*/}
        {/*    >*/}
        {/*      <FontAwesome6 name="bowl-food" size={iconHeight} color='#448aff'/>*/}
        {/*    </Pressable>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    );
  }
  // export default function Home({ navigation }) {
  // return (
  //   <View style={styles.containerHome}>
  //     <Text style={styles.userInfo}>Welcome,{"\n"}{loggedInUser}!</Text>
  //     <Pressable
  //       title="Go to Dietary Restrictions"
  //       onPress={() => {navigation.navigate("DietaryRestrictionsScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //       styles.goToButton, styles.goToDietaryRestrictions]}
  //     >
  //       <Text style={[styles.buttonText, styles.buttonTextRestrictions]}
  //         >Update Dietary Restrictions</Text>
  //     </Pressable>
  //     <Pressable
  //       title="Go to Recipe Search"
  //       onPress={() => navigation.navigate("RecipeSearchScreen")}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>Search Recipes</Text>
  //     </Pressable>
  //     <Pressable
  //       title="Go to Favorites"
  //       onPress={() => {navigation.navigate("FavoritesScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>View Favorites</Text>
  //       </Pressable>
  //     <Pressable
  //       title="Go to Upload Recipe"
  //       onPress={() => {navigation.navigate("UploadRecipeScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>Upload Recipe</Text>
  //       </Pressable>
  //     <Pressable
  //       title="Logout"
  //       onPress={() => navigation.navigate("LoginScreen")}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? '#FF0000' : 'black',
  //         },
  //         styles.goToButton, styles.goToLogin]}
  //     >
  //       <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
  //       </Pressable>
  //   </View>
  // );
// }
const styles = StyleSheet.create({
  containerHome: {
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: appBackgroundColor,
    },
    NavContainer: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 20,
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
    userInfo: {
      fontSize: 40,
      marginTop: -20,
      marginBottom: 15,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    goToButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        elevation: 3,
        width: 325,
        height: 120,
        margin: 12,        
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '500',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
    },
    logoutText:{
      color: 'white',
    },
    goToLogin: {
        width: 250,
        height: 80,
    },
    goToDietaryRestrictions: {
      width: 325,
      height: 120,
    },
    buttonTextRestrictions:{
      fontSize: 37,
  },
});