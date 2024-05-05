import React, {useState} from 'react';
import { Image, Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function FavoritesScreen({ navigation }) {

    return (
      <ScrollView>
        <View style={FavoritesStyles.container}>
          <Text style={FavoritesStyles.instructions}>
            Favorited Recipes
          </Text>

          <View style={FavoritesStyles.singleRecipeDiv}>
            <Text style={FavoritesStyles.foodTitle}>
              Zucchini Pasta
            </Text>
            <Image 
            style={FavoritesStyles.images}
            source={require('../assets/zucchini-pasta-10.jpeg')}/>
            <Text style={FavoritesStyles.foodDescription}>
              Zucchini pasta is a vegan spin on traditional Italian cuisine...
            </Text>
          </View>
          <View style={FavoritesStyles.divider}/>

          <View style={FavoritesStyles.singleRecipeDiv}>
            <Text style={FavoritesStyles.foodTitle}>
              Mango Chicken Curry
            </Text>
            <Image 
            style={FavoritesStyles.images}
            source={require('../assets/instant-pot-mango-chicken.webp')}/>
            <Text style={FavoritesStyles.foodDescription}>
              Mango chicken curry is a popular dish among many areas of southern Asia...
            </Text>
          </View>
          <View style={FavoritesStyles.divider}/>

          <View style={FavoritesStyles.singleRecipeDiv}>
            <Text style={FavoritesStyles.foodTitle}>
              Strawberry Cake
            </Text>
            <Image 
            style={FavoritesStyles.images}
            source={require('../assets/strawberry-cake.webp')}/>
            <Text style={FavoritesStyles.foodDescription}>
              Strawberry cake is a fantastic dessert option for any festivity...
            </Text>
          </View>
          <View style={FavoritesStyles.divider}/>

          <View style={FavoritesStyles.singleRecipeDiv}>
            <Text style={FavoritesStyles.foodTitle}>
              Fruit Salad
            </Text>
            <Image 
            style={FavoritesStyles.images}
            source={require('../assets/fruit-salad.webp')}/>
            <Text style={FavoritesStyles.foodDescription}>
              Fruit salad is a great choice for summertime BBQs...
            </Text>
          </View>
          <View style={FavoritesStyles.divider}/>

          <View style={FavoritesStyles.singleRecipeDiv}>
            <Text style={FavoritesStyles.foodTitle}>
              Glazed Pork Chops
            </Text>
            <Image 
            style={FavoritesStyles.images}
            source={require('../assets/Glazed-Pork-Chops.jpeg')}/>
            <Text style={FavoritesStyles.foodDescription}>
              These sweet and spicy pork chops offer a mixture of flavors...
            </Text>
          </View>
          <View style={FavoritesStyles.divider}/>


        </View>
      </ScrollView>
    );
  }
  const FavoritesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
    },
    instructions: {
        fontSize: 35,
        fontWeight: '600',
        width: 350,
        color: 'green',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center'
    },
    images: {
      width: 300,
      height: 200,
      resizeMode: 'contain'
    },
    foodTitle: {
      fontSize: 30,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    foodDescription: {
      fontSize: 20,
      fontWeight: '200',
      width: 300,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
      marginVertical: 10
    }
  }
);