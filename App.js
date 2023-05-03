import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Picker, Button} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AddTodoScreen() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('todos')
      .onSnapshot(querySnapshot => {
        const todos = [];
        querySnapshot.forEach(documentSnapshot => {
          todos.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setTodos(todos);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const category = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        const categories = [];
        querySnapshot.forEach(documentSnapshot => {
          categories.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setCategories(categories);
      });

    return () => category();
  }, []);

  function handleAddTodo() {
    if (text.length > 0) {
      firestore()
        .collection('todos')
        .add({
          text: text,
          completed: false,
          dateCreated: new Date(),
          dateCompleted: null,
          category: category,
        })
        .then(() => {
          setText('');
          setCategory('');
          console.log('Todo added successfully!');
        })
        .catch(error => {
          console.error('Error adding todo:', error);
        });
    }
  }

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
        Add Todo
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Enter your todo"
        value={text}
        onChangeText={setText}
      />

      <Button title="Add" onPress={handleAddTodo} />
      <View style={{marginTop: 20}}>
        {todos.map(todo => (
          <Text key={todo.id}>{todo.text}</Text>
        ))}
      </View>
    </View>
  );
}
