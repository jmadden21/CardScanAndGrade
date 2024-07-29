import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { styles } from '../components/Styles';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { Routes } from '../utils/Constants';

const GradingResultScreen = (props) => {
    const route = useRoute();

    const { navigation } = props;

    // grading result values to show or props.data (assuming an array) will be used to show the result
    // can remove one approach if needed
    const { playerName, grade, brand, details, cardId, set, cardNumber, variation, edgeScore, cornerScore, frontCenteringScore, year } = route.params.data;

    /**
     * Handles the exit button click, navigating back to the Annotate screen.
     * @function handleExitButtonClick
     */
    const handleExitButtonClick = () => {
        navigation.navigate(Routes.Camera);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={handleExitButtonClick}
                style={styles.exitButtonContainer}
            >
                <Ionicons name="close-circle-outline" size={36} color="#1D9DB9" />
            </TouchableOpacity>

            {cardId && <Text style={styles.titleText}>Card ID: {cardId}</Text>}
            {cardNumber && <Text style={styles.titleText}>Card Number: {cardNumber}</Text>}
            {playerName && <Text style={styles.titleText}>Player Name: {playerName}</Text>}
            {edgeScore && <Text style={styles.text}>Edge Score: {edgeScore}</Text>}
            {grade && <Text style={styles.text}>Grade: {grade}</Text>}
            {variation && <Text style={styles.text}> Variation: {variation}</Text>}
            {cornerScore && <Text style={styles.text}> Corner Score: {cornerScore}</Text>}
            {frontCenteringScore && <Text style={styles.text}> Centering Score: {frontCenteringScore}</Text>}
            {brand && < Text style={styles.gradingCompany}>Grading Company: {brand}</Text>}
            {year && <Text style={styles.text}>Year: {year}</Text>}
            {details && <Text style={styles.comments}> Details: {details}</Text>}
            {set && <Text style={styles.comments}>Set: {set}</Text>}

            {route.params.data && Object.entries(route.params.data).map(([key, value], index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.text}>{key}: </Text>
                    <Text style={{ ...styles.primaryText, marginBottom: 20 }}>{value}</Text>
                </View>
            ))
            }
        </View >
    );
};

export default GradingResultScreen;