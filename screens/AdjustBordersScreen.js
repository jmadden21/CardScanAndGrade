import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import ImagePicker from "react-native-image-crop-picker";
import { Routes } from '../utils/Constants';



const imageWidth = 281;
const imageHeight = 500;

/**
* AdjustBordersScreen component allows users to adjust the borders of an image.
* It supports pan gestures for resizing and moving the borders.
* @function AdjustBordersScreen
* @param {Object} navigation - Navigation prop for screen transitions.
* @returns {Object} The Adjust Borders screen component.
*/
const AdjustBordersScreen = ({ navigation }) => {
  const route = useRoute();
  const [imageUri, setImageUri] = useState("");
  const [backImageUri, setBackImageUri] = useState("");
  const [croppedImageUri, setCroppedImageUri] = useState("");
  const [croppedBackImageUri, setBackCroppedImageUri] = useState("");
  const [card, setCard] = useState();
  console.log("AdjustBordersScreen route ", route, imageUri,);

  useEffect(() => {
    if (route?.params?.card) {
      setCard(route.params.card)
      setImageUri(route.params.card.uri);
      setBackImageUri(route.params.card.backImageUri)
    }
    if (route.params && route.params.imageData || route?.params?.card) {
      setImageUri(route?.params?.card?.uri || route.params.imageData.uri);
      ImagePicker.openCropper({
        path: route?.params?.card?.uri || route.params.imageData.uri,
        width: 300,
        height: 400,
      }).then(image => {
        setCroppedImageUri(image.path);
      });
    }
  }, [route.params]);

  useEffect(() => {
    if (croppedImageUri && route.params.imageData.backImageUri || route?.params?.card) {
      setImageUri(route?.params?.card?.uri || route.params.imageData.backImageUri);
      ImagePicker.openCropper({
        path: route?.params?.card?.uri || route.params.imageData.backImageUri,
        width: 300,
        height: 400,
      }).then(image => {
        setBackCroppedImageUri(image.path);
      });
    }
  }, [croppedImageUri]);
  /**
  * Navigates to the Annotate screen with the adjusted image data.
  * @function nextButton
  */
  const nextButton = async () => {
    if (card) {
      // update
      const newCard = { ...card, uri: croppedImageUri, backImageUri: croppedBackImageUri }
      // update network call

      // navigate
      navigation.navigate(Routes.Home)
    } else {
      navigation.navigate("Annotate", { imageData: { uri: croppedImageUri || imageUri, backImageUri: croppedBackImageUri } });
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: croppedImageUri || imageUri }} style={styles.image} />
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={nextButton} style={styles.next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  resizableSquare: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    zIndex: 1000,
  },
  leftResizer: {
    width: 10,
  },
  rightResizer: {
    width: 10,
  },
  topResizer: {
    height: 10,
  },
  bottomResizer: {
    height: 10,
  },

  resizableEdges: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.5)',
    zIndex: 1000,
  },
  leftEdge: {
    width: 10,
  },
  rightEdge: {
    width: 10,
  },
  topEdge: {
    height: 10,
  },
  bottomEdge: {
    height: 10,
  },

  next: {
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdjustBordersScreen;
