import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PanResponder,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Routes } from "../utils/Constants";

/**
* CameraScreen component for capturing and selecting photos. Manages camera permissions, captures photos, allows photo retaking, and accesses the camera roll.
* @function CameraScreen
* @param {Object} navigation - Navigation prop for screen transitions.
* @returns {Object} The Camera screen component.
*/
export default function CameraScreen({ navigation }) {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [captureBackdPhoto, setCapturedBackPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [corners, setCorners] = useState({
    topLeft: { x: 40, y: 110 },
    topRight: { x: 40, y: 110 },
    bottomLeft: { x: 40, y: 110 },
    bottomRight: { x: 40, y: 110 },
  });

  useEffect(() => {
    const createPanResponder = (cornerName) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
          const newCorners = { ...corners };
          newCorners[cornerName] = {
            x: newCorners[cornerName].x + gestureState.dx,
            y: newCorners[cornerName].y + gestureState.dy,
          };
          setCorners(newCorners);
        },
      });

    const topLeftResponder = createPanResponder("topLeft");
    const topRightResponder = createPanResponder("topRight");
    const bottomLeftResponder = createPanResponder("bottomLeft");
    const bottomRightResponder = createPanResponder("bottomRight");
  }, []);

  useEffect(() => {
    console.log("data inside useEffect", capturedPhoto, captureBackdPhoto);
    if (capturedPhoto && captureBackdPhoto) {
      navigation.navigate(Routes.UserCards, {
        imageData: { uri: capturedPhoto, backImageUri: captureBackdPhoto },
      });
    } else if (capturedPhoto) {
      Alert.alert(
        "Capture Back Photo",
        "Please take the back picture of the card",
        [
          {
            text: "Pick Photo",
            onPress: () => openCameraRoll(),

          },
          {
            text: "Take Picture",
            onPress: () => takePicture(),

          },
        ]
      );
    }
  }, [capturedPhoto, captureBackdPhoto]);

  /**
  * Captures a photo using the camera API, then manipulates the image.
  * @async
  * @function takePicture
  * @returns {Promise<void>} Resolves once the photo has been captured.
  */
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const croppedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: photo.width,
              height: photo.height,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      if (capturedPhoto) {
        setCapturedBackPhoto(croppedPhoto.uri)
      } else {
        setCapturedPhoto(croppedPhoto.uri);
      }
    }
  };

  /**
  * Resets the captured photo state, allowing the user to take another photo.
  * @function retakePicture
  */
  const retakePicture = () => {
    setCapturedPhoto(null);
    setCapturedBackPhoto(null);
  };

  /**
  * Requests permission to access the camera roll and allows the user to pick a photo. Displays an alert if access is denied.
  * @async
  * @function openCameraRoll
  * @returns {Promise<void>} Resolves after the user has selected a photo or the action has been cancelled.
  */
  const openCameraRoll = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("This app doesn't have permission to access your camera roll");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedUri = pickerResult.assets[0].uri;
      if (capturedPhoto) {
        setCapturedBackPhoto(selectedUri)
      } else {
        setCapturedPhoto(selectedUri);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
  * Submits the captured photo.
  * @function submitPhoto
  */
  const submitPhoto = () => {
    navigation.navigate("Adjust Borders", {
      imageData: { uri: capturedPhoto, backImageUri: captureBackdPhoto },
    });

    // navigation.navigate("MainTabs", { screen: "Adjust Borders" });
  };

  return (
    <View style={styles.container}>
      {capturedPhoto && captureBackdPhoto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <TouchableOpacity onPress={submitPhoto} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.corner,
              { top: corners.topLeft.y, left: corners.topLeft.x },
            ]}
          // {...topLeftResponder.panHandlers}
          />
          <TouchableOpacity
            style={[
              styles.corner,
              { top: corners.topRight.y, right: corners.topRight.x },
            ]}
          // {...topRightResponder.panHandlers}
          />
          <TouchableOpacity
            style={[
              styles.corner,
              { bottom: corners.bottomLeft.y, left: corners.bottomLeft.x },
            ]}
          // {...bottomLeftResponder.panHandlers}
          />
          <TouchableOpacity
            style={[
              styles.corner,
              { bottom: corners.bottomRight.y, right: corners.bottomRight.x },
            ]}
          // {...bottomRightResponder.panHandlers}
          />
          <TouchableOpacity onPress={retakePicture} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay} />
          <View style={styles.rectangleContainer}>
            <View style={styles.tab}>
              <Text style={styles.tabText}>Front of Card</Text>
            </View>
            <View style={styles.rectangle} />
          </View>
          <View style={styles.cameraFooter}>
            <TouchableOpacity
              onPress={openCameraRoll}
              style={styles.iconButton}
            >
              <MaterialIcons name="insert-photo" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.takePictureButton}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  cameraFooter: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  takePictureButton: {
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    backgroundColor: "#1D9DB9",
    borderRadius: 35,
  },
  cameraRollButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1D9DB9",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraRollButtonText: {
    color: "white",
    fontSize: 16,
  },
  placeholderButton: {
    width: 50,
    height: 50,
    backgroundColor: "#1D9DB9",
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  rectangle: {
    position: "absolute",
    alignSelf: "center",
    height: "70%",
    width: "80%",
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tab: {
    width: "50%",
    backgroundColor: "black",
    padding: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    transform: [{ translateY: 90 }],
  },
  tabText: {
    color: "white",
    textAlign: "center",
  },
  rectangleContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  corner: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "red", // A bright color for visibility
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure it's above other elements
  },
});
