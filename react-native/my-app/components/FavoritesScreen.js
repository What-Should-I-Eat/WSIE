import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function FavoritesScreen({ navigation }) {

    return (
        <ScrollView>
        <View style={FavoritesStyles.container}>
            <Text style={FavoritesStyles.instructions}>
               Here is where your favorited recipes will appear!
            </Text>
      </View>
      </ScrollView>
    );
  }
  const FavoritesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
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