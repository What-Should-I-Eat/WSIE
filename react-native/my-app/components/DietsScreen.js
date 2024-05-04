import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function DietsScreen({ navigation }) {
  
  const [colorLowCarb, setColorLowCarb] = useState('white');
  const [colorLowFat, setColorLowFat] = useState('white');
  const [colorLowSodium, setColorLowSodium] = useState('white');
  const [colorBalanced, setColorBalanced] = useState('white');
  const [colorHighFiber, setColorHighFiber] = useState('white');
  const [colorHighProtein, setColorHighProtein] = useState('white');
  const [colorVegan, setColorVegan] = useState('white');
  const [colorVegetarian, setColorVegetarian] = useState('white');
  const [colorPaleo, setColorPaleo] = useState('white');
  const [colorKeto, setColorKeto] = useState('white');
  const [colorKosher, setColorKosher] = useState('white');
  const [colorHalal, setColorHalal] = useState('white');
  const [colorPescatarian, setColorPescatarian] = useState('white');
  const [colorRedMeat, setColorRedMeat] = useState('white');
  const [colorFodmap, setColorFodmap] = useState('white');
  
  const toggleColor = (chosenPressable, chosenSetter) => {
    chosenSetter(chosenPressable === 'white' ? 'blue' : 'white');
  }

    return (
        <ScrollView>
        <View style={DietsStyles.container}>
            <Text style={DietsStyles.instructions}>
               Update dietary restrictions below:
            </Text>
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorLowCarb, setColorLowCarb)}
            >
              <Text style={DietsStyles.buttonText}>Low Carb</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorLowFat, setColorLowFat)}
            >
              <Text style={DietsStyles.buttonText}>Low Fat</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorLowSodium, setColorLowSodium)}
            >
              <Text style={DietsStyles.buttonText}>Low Sodium</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorBalanced, setColorBalanced)}
            >
              <Text style={DietsStyles.buttonText}>Balanced</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorHighFiber, setColorHighFiber)}
            >
              <Text style={DietsStyles.buttonText}>High Fiber</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorHighProtein, setColorHighProtein)}
            >
              <Text style={DietsStyles.buttonText}>High Protein</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorVegan, setColorVegan)}
            >
              <Text style={DietsStyles.buttonText}>Vegan</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorVegetarian, setColorVegetarian)}
            >
              <Text style={DietsStyles.buttonText}>Vegetarian</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorPaleo, setColorPaleo)}
            >
              <Text style={DietsStyles.buttonText}>Paleo</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorKeto, setColorKeto)}
            >
              <Text style={DietsStyles.buttonText}>Keto</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorKosher, setColorKosher)}
            >
              <Text style={DietsStyles.buttonText}>Kosher</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorHalal, setColorHalal)}
            >
              <Text style={DietsStyles.buttonText}>Halal</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorPescatarian, setColorPescatarian)}
            >
              <Text style={DietsStyles.buttonText}>Pescatarian</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorRedMeat, setColorRedMeat)}
            >
              <Text style={DietsStyles.buttonText}>Red Meat Free</Text>
            </Pressable>
            
            <Pressable style={DietsStyles.updateButton} 
                onPress={toggleColor(colorFodmap, setColorFodmap)}
            >
              <Text style={DietsStyles.buttonText}>Low Fodmap</Text>
            </Pressable>
            
      </View>
      </ScrollView>
    );
  }
  const DietsStyles = StyleSheet.create({
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