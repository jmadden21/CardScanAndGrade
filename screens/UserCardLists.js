import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight, Button, ScrollView, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { styles } from '../components/Styles';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { Colors, Routes } from '../utils/Constants';
import DigitalCard from '../components/DigitalCard';

const UserCardLists = (props) => {
    const route = useRoute();

    const card = { playerName: 'Michael Jordan', brand: 'test', details: 'Top player', cardId: '111222', cardNumber: '123231232123', year: '2005', uri: require('../assets/images/card.png') }
    const [cards, setCards] = useState(Array(20).fill(card))
    const [collection, setCollection] = useState();

    useEffect(() => {
        setCollection(route?.params?.data)
        // fetch collections cards
        //setCards(); //set date from server
    }, []);



    const { navigation } = props;

    /**
     * Handles the exit button click, navigating back to the Annotate screen.
     * @function handleExitButtonClick
     */
    const handleExitButtonClick = () => {
        navigation.navigate(Routes.Home);
    };

    const addItem = () => {
        navigation.navigate(Routes.MainTabs, { screen: Routes.CameraRoot })
    };

    const updateItem = (item) => {
        navigation.navigate(Routes.MainTabs, { screen: Routes.CameraRoot, params: { screen: Routes.AdjustBorders, params: { card } } });
    };

    const deleteItem = (id) => {
        // setItems(items.filter(item => item.id !== id));
        // refetch cards
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.card}>
                <TouchableOpacity
                    underlayColor="rgba(255, 239, 213, 0.5)"
                    onPress={handleExitButtonClick}
                    style={styles.exitButtonContainer}
                >
                    <Ionicons name="close-circle-outline" size={36} color="#1D9DB9" />
                </TouchableOpacity>
                <Text style={{ ...styles.primaryText, marginBottom: 20 }}>Cards</Text>
                <TouchableHighlight underlayColor="#DDDDDD" style={{
                    backgroundColor: 'rgba(255, 239, 213, 0.8)',
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 20,
                }} onPress={addItem}>
                    <Text style={{ ...styles.primaryText }}>Add Item</Text>
                </TouchableHighlight>
                <FlatList
                    data={cards}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight style={styles.collectionItem} onPress={() => {
                            // navigation.navigate();
                        }}>
                            <View key={index}>
                                {item.uri ? (
                                    <Image source={item.uri} style={{
                                        flex: 1,
                                        aspectRatio: 1, // Your aspect ratio,
                                    }} />
                                ) : null}
                                <View>
                                    <Text style={{ ...styles.primaryTextLight, }}>{item.playerName}</Text>
                                    <View style={{ ...styles.row, justifyContent: 'space-between', }}>
                                        <TouchableHighlight underlayColor={Colors.primary} onPress={() => updateItem(item)}>
                                            <Text style={{ ...styles.primaryTextLight, }}>Edit</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor={Colors.primary} onPress={() => deleteItem(item.id)}>
                                            <Text style={{ ...styles.primaryTextLight }}>Delete</Text>
                                        </TouchableHighlight >
                                    </View >

                                </View>
                            </View >
                        </TouchableHighlight >
                    )}
                    numColumns={2}
                    style={{ height: 612 }}
                />
            </View >
        </SafeAreaView >
    );
};

export default UserCardLists;