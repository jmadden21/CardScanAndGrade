import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { firebase, firestore } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUser(currentUser);
          setName(userData.name);
          setEmail(currentUser.email);
          setImage(userData.profilePicture);
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updateProfile = async () => {
    if (user) {
      await firestore.collection('users').doc(user.uid).set({
        name,
        profilePicture: image,
      }, { merge: true });
      alert('Profile updated successfully!');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an image" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
