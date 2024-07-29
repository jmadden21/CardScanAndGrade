import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../utils/Constants';

const DigitalCard = ({ card, width, uri }) => {
    const styles = cardStyles({ width })
    return (
        <View style={styles.card}>
            {uri ? (
                <Image source={{ uri: uri }} width={'100%'} height={'100%'} />
            ) : null}

            {/* {card && Object.keys(card).length >= 4 && <>
                <Text style={styles.bankName}>{card.bankName}</Text>
                <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                <View style={styles.cardDetails}>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardLabel}>Card Holder</Text>
                        <Text style={styles.cardValue}>{card.cardInfo.holderName}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardLabel}>Expiry</Text>
                        <Text style={styles.cardValue}>{card.expirationDate}</Text>
                    </View>
                </View>
            </>} */}
        </View >
    );
};

const cardStyles = (prop) => StyleSheet.create({
    card: {
        margin: 4,
        width: prop.width || '90%',
        height: 250,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignSelf: 'center',
    },
    bankName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 24,
        letterSpacing: 2,
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardInfo: {
        alignItems: 'flex-start',
    },
    cardLabel: {
        color: '#d1d1d1',
        fontSize: 14,
    },
    cardValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DigitalCard;
