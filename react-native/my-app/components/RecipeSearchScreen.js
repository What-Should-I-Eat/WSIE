import React, {useState} from 'react';
import { Image, Pressable, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RecipeSearchScreen({ navigation }) {

    const [textInput, setInputText] = useState('');
    const [showStuff, setShowStuff] = useState(false);

    return (
        <SafeAreaView style={RecipeSearchStyles.container}>
        <ScrollView>
        <View style={RecipeSearchStyles.container}>
            <Text style={RecipeSearchStyles.instructions}>
               Search for your favorite recipe below:
            </Text>
            <View style={RecipeSearchStyles.searchArea}>
              <TextInput
                  style={RecipeSearchStyles.inputBox}
                  placeholder="Search recipe..."
                  placeholderTextColor={"#8c8c8c"}
                  placeholderFon
                  onChangeText={value => setInputText(value)}
                  defaultValue={textInput}
              />
              <Pressable style={RecipeSearchStyles.searchButton} 
                  onPress={() => setShowStuff(true)}
              ><Text><Icon name="search" size={40} color="black" /></Text>
              </Pressable>
            </View>


            {showStuff && <View style={RecipeSearchStyles.resultsArea}>
              <View style={RecipeSearchStyles.singleRecipeDiv}>
                <Image 
                style={RecipeSearchStyles.images}
                source={require('../assets/zucchini-pasta-10.jpeg')}/>
                <View style={RecipeSearchStyles.textResults}>
                  <Text style={RecipeSearchStyles.foodTitle}>
                    Zucchini Pasta
                  </Text>
                  <Text style={RecipeSearchStyles.foodDescription}>
                    Zucchini pasta is a vegan spin on traditional Italian cuisine...
                  </Text>
                </View>
              </View>
              <View style={RecipeSearchStyles.divider}/>

              <View style={RecipeSearchStyles.singleRecipeDiv}>
                <Image 
                style={RecipeSearchStyles.images}
                source={require('../assets/instant-pot-mango-chicken.webp')}/>
                <View style={RecipeSearchStyles.textResults}>
                  <Text style={RecipeSearchStyles.foodTitle}>
                    Mango Chicken Curry
                  </Text>
                  <Text style={RecipeSearchStyles.foodDescription}>
                    Mango chicken curry is a popular dish among many areas of southern Asia...
                  </Text>
                  </View>
              </View>
              <View style={RecipeSearchStyles.divider}/>

              <View style={RecipeSearchStyles.singleRecipeDiv}>
                <Image 
                style={RecipeSearchStyles.images}
                source={require('../assets/strawberry-cake.webp')}/>
                <View style={RecipeSearchStyles.textResults}>
                  <Text style={RecipeSearchStyles.foodTitle}>
                    Strawberry Cake
                  </Text>
                  <Text style={RecipeSearchStyles.foodDescription}>
                    Strawberry cake is a fantastic dessert option for any festivity...
                  </Text>
                </View>
              </View>
              <View style={RecipeSearchStyles.divider}/>

              <View style={RecipeSearchStyles.singleRecipeDiv}>
                <Image 
                style={RecipeSearchStyles.images}
                source={require('../assets/fruit-salad.webp')}/>
                <View style={RecipeSearchStyles.textResults}>
                  <Text style={RecipeSearchStyles.foodTitle}>
                    Fruit Salad
                  </Text>
                  <Text style={RecipeSearchStyles.foodDescription}>
                    Fruit salad is a great choice for summertime BBQs...
                  </Text>
                </View>
              </View>
              <View style={RecipeSearchStyles.divider}/>
              <View style={RecipeSearchStyles.singleRecipeDiv}>
                <Image 
                style={RecipeSearchStyles.images}
                source={require('../assets/Glazed-Pork-Chops.jpeg')}/>
                <View style={RecipeSearchStyles.textResults}>
                  <Text style={RecipeSearchStyles.foodTitle}>
                    Glazed Pork Chops
                  </Text>
                  <Text style={RecipeSearchStyles.foodDescription}>
                    These sweet and spicy pork chops offer a mixture of flavors...
                  </Text>
                </View>
              </View>
              <View style={RecipeSearchStyles.divider}/>
              
              
              
            </View>}

      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const RecipeSearchStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
      height: 'max'
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 75,
        height: 75,
        margin: 5,     
        backgroundColor: '#3cdfff' 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    inputBox: {
      padding: 18,
      margin: 2,
      position: 'relative',
      top: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 300,
      height: 75,
      fontSize: 30,
      borderRadius: 5,
    },
    searchArea:{
      alignContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 15
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        margin: 10,
        marginTop: 30
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 15,
        textAlign: 'center'
    },
    resultsArea: {

    },
    images: {
      width: 130,
      height: 130,
      resizeMode: 'contain',
      marginRight: 5
    },
    foodTitle: {
      fontSize: 27,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    foodDescription: {
      fontSize: 18,
      fontWeight: '200',
      width: 220,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: "row",
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
      marginVertical: 10,
      alignContent: "center",
      alignItems: "center",
    },
    textResults: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: 200,
      marginLeft: 15
    }
  }
);