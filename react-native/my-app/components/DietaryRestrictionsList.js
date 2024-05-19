import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getDietaryArray } from '../calls/dietHealthCalls';

let selectedDietArray = [];

const MultiSelectListDiet = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    async function getDietsOnLoad(){
      try{
        const serverDiets = await getDietaryArray();
        setSelectedItems(serverDiets);
      } catch (error){
        console.error('Error loading diets: ', error);
      }
    }
    getDietsOnLoad();
  }, [getDietaryArray]);

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleItem(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 30, marginVertical: 4, color: selectedItems.includes(item) ? 'green' : 'black'}}>{item}</Text>
        {selectedItems.includes(item) && <Text style={{fontSize: 30, fontWeight: 700, marginVertical: 4, color: 'green'}}> ✓</Text>}
      </View>
    </TouchableOpacity>
  );
  selectedDietArray = selectedItems;

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        extraData={selectedItems}
      />
    </View>
  );
};

export { MultiSelectListDiet, selectedDietArray }