import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function AllergiesScreen({ navigation }) {
  
  const [colorGluten, setColorGluten] = useState('white');
  const [colorDairy, setColorDairy] = useState('white');
  const [colorEggs, setColorEggs] = useState('white');
  const [colorSoy, setColorSoy] = useState('white');
  const [colorWheat, setColorWheat] = useState('white');
  const [colorFish, setColorFish] = useState('white');
  const [colorShellfish, setColorShellfish] = useState('white');
  const [colorTreenuts, setColorTreenuts] = useState('white');
  const [colorPeanuts, setColorPeanuts] = useState('white');
  const [colorSesame, setColorSesame] = useState('white');
  const [colorLowSugar, setColorLowSugar] = useState('white');
  const [colorAlcoholFree, setColorAlcoholFree] = useState('white');
  
  const toggleColor = (chosenPressable, chosenSetter) => {
    chosenSetter(chosenPressable === 'white' ? 'blue' : 'white');
  }

    return (
        <ScrollView>
        <View style={AllergiesStyles.container}>
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorGluten, setColorGluten)}
            >
              <Text style={AllergiesStyles.buttonText}>Gluten</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorDairy, setColorDairy)}
            >
              <Text style={AllergiesStyles.buttonText}>Dairy</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorEggs, setColorEggs)}
            >
              <Text style={AllergiesStyles.buttonText}>Eggs</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorSoy, setColorSoy)}
            >
              <Text style={AllergiesStyles.buttonText}>Soy</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorWheat, setColorWheat)}
            >
              <Text style={AllergiesStyles.buttonText}>Wheat</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorFish, setColorFish)}
            >
              <Text style={AllergiesStyles.buttonText}>Fish</Text>
            </Pressable>
            
            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorShellfish, setColorShellfish)}
            >
              <Text style={AllergiesStyles.buttonText}>Shellfish</Text>
            </Pressable>

            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorTreenuts, setColorTreenuts)}
            >
              <Text style={AllergiesStyles.buttonText}>Tree Nuts</Text>
            </Pressable>

            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorPeanuts, setColorPeanuts)}
            >
              <Text style={AllergiesStyles.buttonText}>Peanuts</Text>
            </Pressable>

            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorSesame, setColorSesame)}
            >
              <Text style={AllergiesStyles.buttonText}>Sesame</Text>
            </Pressable>

            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorLowSugar, setColorLowSugar)}
            >
              <Text style={AllergiesStyles.buttonText}>Low Sugar</Text>
            </Pressable>

            <Pressable style={AllergiesStyles.updateButton} 
                onPress={toggleColor(colorAlcoholFree, setColorAlcoholFree)}
            >
              <Text style={AllergiesStyles.buttonText}>Alcohol Free</Text>
            </Pressable>

      </View>
      </ScrollView>
    );
  }
  const AllergiesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    updateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 30,     
        backgroundColor: '#3cdfff' 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 30,
        textAlign: 'center'
    },
  }
);