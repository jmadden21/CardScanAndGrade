import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import { styles } from '../components/Styles';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { Routes } from '../utils/Constants';
import DigitalCard from '../components/DigitalCard';

const UserCardsScreen = (props) => {
    const route = useRoute();

    const [imageUri, setImageUri] = useState("");
    const [backImageUri, setBackImageUri] = useState("");
    const [imageMasterUri, setMasterImageUri] = useState();
    const [backMasterImageUri, setMasterBackImageUri] = useState();


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


    const { navigation } = props;

    const userCard = { bankName: 'ABC', cardNumber: '**** **** **** 1234', cardInfo: { holderName: "Jack", company: "Mastercard" }, expirationDate: "12/28" }
    const masterCardCopy = {}

    /**
     * Handles the exit button click, navigating back to the Annotate screen.
     * @function handleExitButtonClick
     */
    const handleExitButtonClick = () => {
        navigation.navigate(Routes.Camera);
    };
    const onNextClick = () => {
        navigation.navigate("Adjust Borders", {
            imageData: { uri: imageUri, backImageUri: backImageUri },
        });
    };

    return (
        <ScrollView>
            <View style={styles.card}>
                <TouchableOpacity
                    onPress={handleExitButtonClick}
                    style={styles.exitButtonContainer}
                >
                    <Ionicons name="close-circle-outline" size={36} color="#1D9DB9" />
                </TouchableOpacity>
                <Text>User Card and Master Card</Text>
                <View style={styles.row}>
                    <DigitalCard width={'50%'} uri={imageUri} />
                    <DigitalCard width={'50%'} uri={imageMasterUri} />
                </View>
                <View style={styles.row}>
                    <DigitalCard width={'50%'} uri={backImageUri} />
                    <DigitalCard width={'50%'} uri={backMasterImageUri} />
                </View>
                <Button onPress={onNextClick} title='Next'></Button>
            </View >
        </ScrollView>
    );
};

export default UserCardsScreen;