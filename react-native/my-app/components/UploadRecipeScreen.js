import React, {useState} from 'react';
import { SafeAreaView, Pressable, Text, TextInput, View, StyleSheet, ScrollView, Image } from 'react-native';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadNewRecipe } from '../calls/uploadRecipeCalls';

export default function UploadRecipeScreen({ navigation }) {

    const [textRecipeName, setTextRecipeName] = useState('');
    const [textCalories, setTextCalories] = useState('');
    const [textIngredients, setTextIngredients] = useState('');
    const [textDirections, setTextDirections] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = () => {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      };
        launchImageLibrary(options, (response) => {
            if(response.didCancel){
                console.log("user cancelled image selection");
            } else if(response.error){
                console.log("error found: ", response.error);
            } else{
                setSelectedImage(response.uri);
            }
        });
    }

    return (
      <SafeAreaView style={uploadStyles.container}>
      <ScrollView>
        <View style={uploadStyles.container}>
            <Text style={[uploadStyles.inputLabel, {marginTop: 15}]}>
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
                  placeholder="Pepper, rice, ..."
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  multiline={true}
                  onChangeText={value => setTextIngredients(value)}
                  defaultValue={textIngredients}
            />
            <Text style={uploadStyles.inputLabel}>
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
                <Text style={uploadStyles.inputLabel}>
                Photo:
                </Text>
                {selectedImage && (
                    <Image 
                        source={{ uri: selectedImage}}
                        style={uploadStyles.images}
                    />
                )}
                <Pressable onPress={handleImageUpload}>
                    <Text style={uploadStyles.imageSelectLabel}>
                        Select Image
                    </Text>
                </Pressable>
            </View>
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                },
                uploadStyles.newRecipeButton]} 
              onPress={() => uploadNewRecipe(textRecipeName, textCalories, textIngredients, textDirections)}
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
    },
    images: {
      width: 75,
      height: 75,
      resizeMode: 'contain',
      marginVertical: 10,
    },
    newRecipeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      elevation: 3,
      width: 300,
      height: 100,
      marginTop: 20,
      borderWidth: 1,
  },
    buttonText:{
        fontSize: 38,
        fontWeight: '500',
        color: 'white',
    },
    nameBox: {
      padding: 18,
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
      padding: 16,
      margin: 10,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 110,
      height: 60,
      fontSize: 30,
      borderRadius: 5,
    },
    biggerBox: {
      padding: 16,
      margin: 10,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 350,
      height: 120,
      textAlignVertical: 'top',
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 5,
    },
    imageSelectLabel: {
        fontSize: 27,
        fontWeight: '300',
        marginLeft: 10,
        marginTop: 5,
    },
  }
);