import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [text, onChangeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [todoArray, setTodoArray] = useState([]);
  const storeData = async value => {
    let currentData = await getData();
    try {
      if (!currentData) {
        currentData = [];
      }
      currentData.push(value);
      const jsonValue = JSON.stringify(currentData);
      currentData && setTodoArray(currentData);
      console.log('abcd', todoArray);
      await AsyncStorage.setItem('todo_list_data', jsonValue);
    } catch (e) {
      console.log(error);
      // saving error
    }
  };

  const updateData = async value => {
    try {
      value && setTodoArray(value);
      const jsonValue = JSON.stringify(value);
      // console.log('abcd', todoArray);
      setLoading(false)
      await AsyncStorage.setItem('todo_list_data', jsonValue);
    } catch (e) {
      console.log(error);
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todo_list_data');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  // if(loading){
  //   return <ActivityIndicator />
  // }
  return (
    <View>
      <Text style={styles.heading}>ToDo List</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />

      <Button
        title="add"
        onPress={() => {
          storeData({title: text, isDone: false, id: guidGenerator()});
        }}></Button>
      <Button
        title="get"
        onPress={() => {
          getData().then(response => {
            // console.log('abcd', response);
          });
        }}></Button>
      {todoArray.length > 0 ? (
        <FlatList
          data={todoArray}
          renderItem={({item}) =>
            !item.isDone ? (
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 24, color: 'yellow'}}>
                  {item.title}
                </Text>
                <Button
                  title="done"
                  onPress={() => {
                    setLoading(true);
                    let tempData = todoArray
                    var foundIndex = tempData.findIndex(x => x.id == item.id);
                    if(foundIndex){
                      tempData[foundIndex].isDone = true;
                      tempData[foundIndex].id = guidGenerator();
                      updateData(tempData).then(()=>{

                      });
                    }
                    // done function
                  }}></Button>
              </View>
            ) : null
          }
          keyExtractor={(item ,key) => item?.id? item.id: key}
        />
      ) : null}
      <Text>Done:-</Text>
      {todoArray.length > 0 ? (
        <FlatList
          data={todoArray}
          renderItem={({item}) =>
            item.isDone ? (
              <Text style={{fontSize: 24, color: 'yellow'}}>{item.title}</Text>
            ) : null
          }
          keyExtractor={item => item.id}
        />
      ) : null}
      <View></View>
    </View>
  );
};

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

const styles = StyleSheet.create({
  heading: {
    color: 'yellow',
    paddingTop: 50,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default App;
