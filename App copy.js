import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    firestore()
      .collection('todos')
      .get()
      .then(res => {
        //console.log('>>> Response', res.docs);
        const tempData = [];
        res.docs.map(doc => {
          const tempTodo = {
            id: doc.id, // docs icinde id yoktu ve id ye maplenne items larin .id si diyerek ulasildigini gorduk
            ...doc.data(), // doc.data da diger bilgiler vardi ikisini birlestirip bir abje yaptik
          };
          /*
          ! doc.data() metodu, belirli bir dokümanın alanlarını ve değerlerini bir obje olarak döndürür. Bu nedenle, tempTodo nesnesine verileri eklemek için doc.data() metodunu kullanmalısınız.
          */
          //console.log('>>> DOC Response', doc.data());
          tempData.push(tempTodo);
        });
        console.log('>>> Temp Data', tempData);
        setTodos(tempData);
      })
      .catch(err => console.log('>>>Error', err));
  }, []);

  useEffect(() => {
    firestore()
      .collection('todos')
      .add({
        text: 'Yeni todo',
        completed: false,
        dateCreated: new Date(),
        dateCompleted: null,
      })
      .then(docRef => {
        console.log('Yeni doküman başarıyla eklendi:', docRef.id);
      })
      .catch(error => {
        console.error('Doküman eklenirken bir hata oluştu:', error);
      });
  }, []);

  if (todos === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={100} />
      </View>
    );
  }
  return (
    <SafeAreaView>
      {todos?.length === 0 ? (
        <View>
          <Text>There is no shaved todo</Text>
        </View>
      ) : (
        <View>
          {todos?.map(todo => (
            <View key={todo?.id}>
              <Text>{todo?.text}</Text>
            </View>
          ))}
        </View>
      )}
      <View>
        <Text>App</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
