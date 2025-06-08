import React, {useState} from 'react';
import { SafeAreaView, Pressable, Text, TextInput, View, StyleSheet, ScrollView, Image } from 'react-native';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked, navBarPadding } from "../calls/styleSheets";
import * as ImagePicker from 'expo-image-picker';
import { uploadNewRecipe } from '../calls/uploadRecipeCalls';

export default function UploadRecipeScreen({ navigation }) {

    const [textRecipeName, setTextRecipeName] = useState('');
    const [textCalories, setTextCalories] = useState('');
    const [textIngredients, setTextIngredients] = useState('');
    const [textDirections, setTextDirections] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [trimmedImageFileName, setTrimmedImageFileName] = useState('');

    const handleImageUpload = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        selectionLimit: 1,
      });
      if(!result.canceled){
        setSelectedImage(result.assets[0].uri);
        trimFileText(result.assets[0].uri);
      }
    }
    const trimFileText = (inputtedFileName) => {
      const trimmedName = inputtedFileName.length > 15 ? "..." + inputtedFileName.substring(inputtedFileName.length - 15) : inputtedFileName;
      setTrimmedImageFileName(trimmedName);
    }

    return (
      <SafeAreaView style={uploadStyles.container}>
      <ScrollView>
        <View style={uploadStyles.container}>
            <Text style={[uploadStyles.inputLabel, {marginTop: 10}]}>
              Recipe Name:
            </Text>
            <TextInput
                style={uploadStyles.nameBox}
                placeholder="My new recipe"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setTextRecipeName(value)}
                defaultValue={textRecipeName}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={uploadStyles.inputLabel}>
                Calories:
                </Text>
                <TextInput
                    style={uploadStyles.calorieBox}
                    placeholder="330"
                    placeholderTextColor={"#8c8c8c"}
                    autoCapitalize="none"
                    onChangeText={value => setTextCalories(value)}
                    defaultValue={textCalories}
                />
            </View>
            <Text style={uploadStyles.inputLabel}>
              Ingredients:
            </Text>
            <TextInput
                  style={uploadStyles.biggerBox}
                  placeholder="Peppers, rice, spinach..."
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  multiline={true}
                  onChangeText={value => setTextIngredients(value)}
                  defaultValue={textIngredients}
            />
            <Text style={[uploadStyles.inputLabel, {marginTop: -2}]}>
              Directions:
            </Text>
            <TextInput
                  style={uploadStyles.biggerBox}
                  placeholder="First pre-heat oven to 350°F..."
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  multiline={true}
                  onChangeText={value => setTextDirections(value)}
                  defaultValue={textDirections}
            />
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[{marginRight: 10}, uploadStyles.inputLabel]}>
                Image:
                </Text>
                <Pressable onPress={handleImageUpload}>
                  <View style={uploadStyles.imageSelectLabelBox}>
                  <Text style={uploadStyles.imageSelectLabel}>
                        Select Photo
                    </Text>
                  </View>
                </Pressable>
            </View>
            {!selectedImage && (
              <View style={{height: 70}}></View>
            )}
            {selectedImage && (
              <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                 <Image 
                    source={{ uri: selectedImage}}
                    style={uploadStyles.images}
                  />
                  <View style={uploadStyles.imageUriLabel}>
                    <Text style={{fontSize: 20, color: "#2B5FFF"}}>{trimmedImageFileName}</Text>
                  </View>
              </View>
            )}
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                },
                uploadStyles.newRecipeButton]} 
              onPress={() => uploadNewRecipe(textRecipeName, textCalories, textIngredients, textDirections, selectedImage)}
              >
              <Text style={uploadStyles.buttonText}>
              Upload Recipe</Text>
            </Pressable>
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const uploadStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
      paddingBottom: navBarPadding
    },
    images: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
      marginRight: 10
    },
    newRecipeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      elevation: 3,
      width: 300,
      height: 100,
      marginTop: 7,
      borderWidth: 1,
  },
    buttonText:{
        fontSize: 38,
        fontWeight: '500',
        color: 'white',
    },
    nameBox: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      margin: 10,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 300,
      height: 60,
      fontSize: 30,
      borderRadius: 5,
    },
    calorieBox: {
      padding: 10,
      margin: 5,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 105,
      height: 50,
      fontSize: 27,
      borderRadius: 5,
    },
    biggerBox: {
      padding: 10,
      margin: 10,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 350,
      height: 120,
      textAlignVertical: 'top',
      fontSize: 28,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 3,
    },
    imageSelectLabel: {
        fontSize: 25,
        fontWeight: '400',
        margin: 5,
        color: '#3E3E3E'
    },
    imageSelectLabelBox: {
      borderWidth: 1, 
      marginTop: 8,
      borderRadius: 3,
      borderColor: '#646464',
      backgroundColor: '#E6E6E6'
    },
    imageUriLabel: {
      width: 200,
      height: 30,
    }
  }
);