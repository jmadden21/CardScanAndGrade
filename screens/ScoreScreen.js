import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getAuth, getIdToken } from "firebase/auth";
import RNPickerSelect from "react-native-picker-select";
import { useCollections } from "../hooks/useCollections";
import { Routes } from "../utils/Constants";

/**
* ScoreScreen component handles the uploading and grading of card images. It manages the image upload, grading process, and card information retrieval.
* @function ScoreScreen
* @param {Object} navigation - Navigation prop for screen transitions.
* @returns {Object} The Score screen component.
*/
export default function ScoreScreen({ navigation }) {
  const route = useRoute();
  const [imageUri, setImageUri] = useState("");
  const [backImageUri, setBackImageUri] = useState("");
  const [presignedFrontUrl, setPresignedFrontUrl] = useState(""); // State to store presigned upload URL
  const [objectFrontUrl, setObjectFrontUrl] = useState(""); // State to store the object URL
  const [cardId, setCardId] = useState(null); // State to store the generated cardID
  const [loading, setLoading] = useState(false); // State to track loading state
  const [cardInfo, setCardInfo] = useState({ cardNumber: '111', year: '2020', edgeScore: '11', cornerScore: '200', frontCenteringScore: "222" }); // State to store card info
  const [editMode, setEditMode] = useState(false); // State to store edit mode status

  //Populating the drop down for adding to collections
  const { collections, loadingCollections } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState();

  //Used a modal to make it less cluttered
  const [modalVisible, setModalVisible] = useState(false);
  console.log("=======", imageUri, "\n====", backImageUri);

  useEffect(() => {
    if (route.params) {
      if (route.params.imageData.uri) {
        setImageUri(route.params.imageData.uri);
      }
      if (route.params.imageData.backImageUri) {
        setBackImageUri(route.params.imageData.backImageUri);
      }
    }
  }, [route.params]);

  /**
  * Fetches presigned upload URL and uploads the image to the server.
  * @async
  * @function fetchPresignedUrl
  * @returns {Promise<void>} A promise that resolves when the image is uploaded.
  */
  // UseEffect for uploading
  useEffect(() => {
    // Function to fetch presigned upload URL
    async function fetchPresignedUrl() {
      try {
        setLoading(true); // Set loading state to true while fetching
        const auth = getAuth(); // Get the auth instance
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser); // Get ID token from current user
          const response = await fetch(
            "https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/uploadUrl",
            {
              headers: {
                Authorization: `Bearer ${idToken}`, // Use ID token in Authorization header
              },
            }
          );
          const data = await response.json();
          console.log("Front Url: " + data.frontUrl);
          setPresignedFrontUrl(data.frontUrl);

          // Upload front image
          await fetch(data.frontUrl, {
            method: "PUT",
            body: imageUri,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });
          console.log("Url to Object: " + data.frontUrl.split("?")[0]);
          setObjectFrontUrl(data.frontUrl.split("?")[0]); // Extract object URL
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }
        setLoading(false); // Reset loading state after fetching and uploading
      } catch (error) {
        console.error(
          "Error fetching/presigned URL or uploading image:",
          error
        );
        setLoading(false); // Reset loading state after error
      }
    }

    fetchPresignedUrl(); // Call the function to fetch presigned upload URL
  }, []);

  /**
  * Submits the card for grading after uploading the image.
  * @async
  * @function submitCardForGrading
  * @returns {Promise<void>} A promise that resolves when the card is submitted for grading.
  */
  // UseEffect for submitting for grading
  useEffect(() => {
    async function submitCardForGrading() {
      try {
        setLoading(true);

        const auth = getAuth();
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser);

          // Prepare the request body with the object URL(s)
          const requestBody = {
            frontUrl: objectFrontUrl,
            // When we have a back image, include its URL in the request body as well
            // backImageUrl: objectBackUrl,
          };

          // Make the POST request to submit the card for grading
          const response = await fetch(
            "https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/cards",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            const responseData = await response.json();
            // Upon successful grading initiation, you'll receive the card ID
            setCardId(responseData.cardId);
            // navigation.navigate(Routes.Grading, { data: { cardId: responseData.cardId } })
            console.log(
              "Card submitted for grading. Card ID:",
              responseData.cardId
            );
          } else {
            // navigation.navigate(Routes.Grading, { data: { error: "Something went wrong" } })

            console.error(
              "Failed to submit card for grading:",
              response.status
            );
          }
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }

        setLoading(false); // Reset loading state after submitting
      } catch (error) {
        console.error("Error submitting card for grading:", error);
        setLoading(false); // Reset loading state after error
      }
    }

    if (objectFrontUrl) {
      submitCardForGrading(); // Call the function to submit the card for grading once the object URL is available
    }
  }, [objectFrontUrl]); // Run this effect when objectFrontUrl changes

  /**
  * Fetches information of a single card based on the card ID.
  * @async
  * @function fetchCardInfo
  * @returns {Promise<void>} A promise that resolves when the card information is fetched.
  */
  // UseEffect for information of a single card
  useEffect(() => {
    // Function to fetch card information
    async function fetchCardInfo() {
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser);
          const response = await fetch(
            `https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/cards/${cardId}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          const data = await response.json();
          console.log(data);
          setCardInfo(data);
          // Handle the received card information as needed
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching card information:", error);
      }
    }

    if (cardId) {
      fetchCardInfo();
    }
  }, [cardId]);

  /**
  * Handles the exit button click, navigating back to the Annotate screen.
  * @function handleExitButtonClick
  */
  const handleExitButtonClick = () => {
    navigation.navigate("Annotate");
  };
  const handleFlipButtonClick = () => {
    // add front button logic here
  };
  const handleToggleButtonClick = () => {
    // add toggle button logic here
  };
  const handleEditButtonClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  /**
  * Handles the edit button click, toggling the edit mode.
  * @function handleEditButtonClick
  */

  /**
  * Handles the share button click, navigating to the Export screen with the image URI.
  * @function handleShareButtonClick
  */
  const handleShareButtonClick = () => {
    // Navigate to Export screen and pass the image URI as a parameter
    navigation.navigate("Export", { imageData: { uri: imageUri } });
  };

  /**
  * Handles the add to collection button click, showing the modal.
  * @function handleAddToCollectionButtonClick
  */
  //ADD TO COLLECTION LOGIC
  const handleAddToCollectionButtonClick = () => {
    setModalVisible(true);
  };

  //Show Grading result
  const handleViewGradingResultClick = () => {
    navigation.navigate(Routes.Grading, { data: cardInfo })
  };

  /**
  * Handles the close modal action.
  * @function handleCloseModal
  */
  const handleCloseModal = () => {
    setModalVisible(false);

    //TODO Implement add card to collections table after modal is closed when API scans card properly
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}></View>
      <View style={styles.middleBackground}></View>
      <View style={styles.bottomBackground}></View>

      <View style={styles.overlayBox}>
        {/* exit button */}
        <TouchableOpacity
          onPress={handleExitButtonClick}
          style={styles.exitButtonContainer}
        >
          <Ionicons name="close-circle-outline" size={35} color="#1D9DB9" />
        </TouchableOpacity>

        {/* Text above image container */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Bryce Harper</Text>
        </View>

        {/* container for image */}
        {imageUri ? (
          <View style={styles.cardImageContainer}>
            <Image style={styles.cardImage} source={{ uri: imageUri }} />
          </View>
        ) : null}

        {/* container for front and toggle buttons */}
        <View style={styles.frontToggleContainer}>
          <TouchableOpacity
            onPress={handleFlipButtonClick}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleButtonClick}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditButtonClick}
            style={editMode ? styles.editModeButton : styles.button}
          >
            <Text
              style={editMode ? styles.editModeButtonText : styles.buttonText}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollble dark grey box of card information */}
        <ScrollView style={styles.scrollableInformation}>
          <Text style={styles.informationText}>Information</Text>

          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Year</Text>
            </View>

            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo && cardInfo.card && cardInfo.card.year !== null
                      ? cardInfo.card.year.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, year: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo && cardInfo.card && cardInfo.card.year !== null
                    ? cardInfo.card.year
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Brand</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo && cardInfo.card && cardInfo.card.brand !== null
                      ? cardInfo.card.brand.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, brand: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo && cardInfo.card && cardInfo.card.brand !== null
                    ? cardInfo.card.brand
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Set</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo && cardInfo.card && cardInfo.card.set !== null
                      ? cardInfo.card.set.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, set: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo && cardInfo.card && cardInfo.card.set !== null
                    ? cardInfo.card.set
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Number</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo &&
                      cardInfo.card &&
                      cardInfo.card.cardNumber !== null
                      ? cardInfo.card.cardNumber.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, cardNumber: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo &&
                    cardInfo.card &&
                    cardInfo.card.cardNumber !== null
                    ? cardInfo.card.cardNumber
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Variation</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo &&
                      cardInfo.card &&
                      cardInfo.card.variation !== null
                      ? cardInfo.card.variation.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, variation: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo && cardInfo.card && cardInfo.card.variation !== null
                    ? cardInfo.card.variation
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Edge</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo &&
                      cardInfo.card &&
                      cardInfo.card.edgeScore !== null
                      ? cardInfo.card.edgeScore.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, edgeScore: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo && cardInfo.card && cardInfo.card.edgeScore !== null
                    ? cardInfo.card.edgeScore
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Corner</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo &&
                      cardInfo.card &&
                      cardInfo.card.cornerScore !== null
                      ? cardInfo.card.cornerScore.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, cornerScore: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo &&
                    cardInfo.card &&
                    cardInfo.card.cornerScore !== null
                    ? cardInfo.card.cornerScore
                    : ""}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.4 }]}>
              <Text style={styles.sideBySideBoxText}>Center</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.6, marginLeft: 5 }]}>
              {editMode ? ( // Conditionally render TextInput or Text
                <TextInput
                  style={styles.inputText}
                  value={
                    cardInfo &&
                      cardInfo.card &&
                      cardInfo.card.frontCenteringScore !== null
                      ? cardInfo.card.frontCenteringScore.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCardInfo({
                      ...cardInfo,
                      card: { ...cardInfo.card, frontCenteringScore: text },
                    })
                  }
                />
              ) : (
                <Text style={styles.sideBySideBoxText}>
                  {cardInfo &&
                    cardInfo.card &&
                    cardInfo.card.frontCenteringScore !== null
                    ? cardInfo.card.frontCenteringScore
                    : ""}
                </Text>
              )}
            </View>
          </View>

          {/* More Details */}
          <Text style={styles.moreDetailsText}>More Details</Text>
          <View style={styles.moreDetailsBox}>
            <Text style={styles.informationText}>
              {cardInfo && cardInfo.card && cardInfo.card.details !== null
                ? cardInfo.card.details
                : ""}
            </Text>
          </View>
        </ScrollView>

        {/* Share and Add to Collection Buttons */}
        <View style={styles.shareCollectionButtonsContainer}>
          <TouchableOpacity
            onPress={handleShareButtonClick}
            style={styles.shareCollectionButtons}
          >
            <Text style={styles.shareCollectionButtonsText}>Share</Text>
          </TouchableOpacity>

          {/*add to collection button and modal*/}
          <TouchableOpacity
            onPress={handleAddToCollectionButtonClick}
            style={styles.shareCollectionButtons}
          >
            <Text style={styles.shareCollectionButtonsText}>
              Add to Collection
            </Text>
          </TouchableOpacity>

          {cardInfo && <TouchableOpacity
            onPress={handleViewGradingResultClick}
            style={styles.gradingResultButtons}
          >
            <Text style={styles.gradingResultButtonsText}>
              Result
            </Text>
          </TouchableOpacity>}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={modalStyles.centeredView}>
              <View style={modalStyles.modalView}>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={modalStyles.closeButton}
                >
                  <Text style={modalStyles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={modalStyles.modalText}>Select a Collection</Text>
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  <RNPickerSelect
                    onValueChange={(value) => setSelectedCollection(value)}
                    items={collections.map((collection) => ({
                      label: collection.collection,
                      value: collection.id,
                    }))}
                    placeholder={{ label: "Select a collection", value: null }}
                    style={{
                      inputIOS: modalStyles.pickerContainer,
                      iconContainer: {
                        top: 10,
                        right: 12,
                      },
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[modalStyles.button, modalStyles.buttonClose]}
                  onPress={() => {
                    handleCloseModal();
                    Alert.alert("Added to Collection");
                    console.log("Item added to:", selectedCollection);
                  }}
                >
                  <Text style={modalStyles.textStyle}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#959595",
    position: "relative",
  },
  topBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  middleBackground: {
    flex: 6,
    backgroundColor: "#959595",
  },
  bottomBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  overlayBox: {
    position: "absolute",
    top: "6%",
    bottom: "5%",
    left: "5%",
    right: "5%",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  cardImageContainer: {
    backgroundColor: "#1D9DB9",
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  cardImage: {
    width: "95%",
    height: "95%",
    resizeMode: "cover",
  },
  exitButtonContainer: {
    position: "absolute",
    top: 5,
    left: 6,
    zIndex: 1,
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  frontToggleContainer: {
    backgroundColor: "#272727",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D9DB9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: "70%",
    width: "30%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  scrollableInformation: {
    backgroundColor: "#C6C6C6",
  },
  informationBox: {
    backgroundColor: "white",
    padding: 3,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  informationText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  sideBySideBoxesContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  sideBySideBox: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  sideBySideBoxText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  moreDetailsText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  moreDetailsBox: {
    backgroundColor: "white",
    padding: 3,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 150,
  },
  shareCollectionButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  shareCollectionButtons: {
    flex: 0.5,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: 40,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  shareCollectionButtonsText: {
    color: "black",
    fontSize: 16,
  },
  gradingResultButtons: {
    flex: 0.5,
    backgroundColor: "lightgreen",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: 40,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  gradingResultButtonsText: {
    color: "black",
    fontSize: 16,
  },
  editModeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E0909",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: "70%",
    width: "30%",
  },
  editModeButtonText: {
    color: "white",
    fontSize: 16,
  },
  inputText: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: "white",
  },
  closeButtonText: {
    color: "black",
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginTop: 30,
    width: "100%",
    backgroundColor: "#1D9DB9",
  },
  buttonClose: {
    backgroundColor: "#1D9DB9",
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 30,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
});
