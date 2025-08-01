import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Your custom treats data
const birthdayTreats = [
    {
        id: 1,
        emoji: "🍳",
        name: "Breakfast Cooked by Me",
        desc: "Start her big day with a breakfast made with love and extra care.",
    },
    {
        id: 2,
        emoji: "☕",
        name: "Cafe Date",
        desc: "A special outing for dreamy coffee, cozy vibes, and sweet conversations.",
    },
    {
        id: 3,
        emoji: "🍽️",
        name: "Dinner at Geist",
        desc: "An evening of fine food and clinked glasses at your favorite place.",
    },
    {
        id: 4,
        emoji: "🍄",
        name: "Mushroom Masala by Bubba",
        desc: "Her favorite homemade mushroom masala, spiced lovingly by you.",
    },
    {
        id: 5,
        emoji: "🫖",
        name: "Morning Tea",
        desc: "Gentle tea and time together, to begin the birthday on a calm note.",
    },
    {
        id: 6,
        emoji: "🌶️",
        name: "South Indian Delicacy",
        desc: "Traditional flavors and all her southern favorites, handpicked by Bubba.",
    },
];

export default function BirthdayTreatsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Birthday Treats 🍰</Text>
            <Text style={styles.subHeader}>
                This year, every meal is a love letter!
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 7 }}
            >
                {birthdayTreats.map((treat) => (
                    <View key={treat.id} style={styles.treatCard}>
                        <View style={styles.emojiCircle}>
                            <Text style={styles.treatEmoji}>{treat.emoji}</Text>
                        </View>
                        <Text style={styles.treatName}>{treat.name}</Text>
                        <Text style={styles.treatDesc}>{treat.desc}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181828',
        paddingTop: 18,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffd93d',
        textAlign: 'center',
        marginBottom: 5,
    },
    subHeader: {
        color: '#fafafa',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 18,
    },
    treatCard: {
        backgroundColor: '#23272d',
        borderRadius: 16,
        padding: 22,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.14,
        shadowRadius: 9,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#ffd93d33',
        width: width * 0.92,
        alignSelf: 'center',
    },
    emojiCircle: {
        backgroundColor: '#2a2a2a',
        borderRadius: 33,
        width: 66,
        height: 66,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#ffd93d',
    },
    treatEmoji: {
        fontSize: 37,
    },
    treatName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffd93d',
        marginBottom: 9,
        textAlign: 'center',
    },
    treatDesc: {
        color: '#e4e4e4',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 1,
    },
});
