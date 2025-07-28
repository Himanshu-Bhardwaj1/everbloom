import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Feather icon set covers heart, star, gift, etc.

const { width, height } = Dimensions.get('window');

const loveQuotes = [
    "You ignite a fire in me that burns through every fiber of my being 🔥",
    "Your touch sends electricity through my veins, leaving me breathless ⚡",
    "I crave you like the moon craves the darkness 🌙",
    "You're my addiction, my beautiful obsession I can't resist 💫",
    "Every whisper of your name makes my heart race uncontrollably 🖤"
];

const memories = [
    { icon: "🌙", text: "Stolen moments under starlight, lost in your eyes" },
    { icon: "🕯️", text: "Candlelit nights where time stands still between us" },
    { icon: "🌹", text: "The way you make my pulse quicken with just a look" },
    { icon: "🎭", text: "Dancing close, feeling your heartbeat against mine" },
    { icon: "📖", text: "Whispered secrets that only lovers know" }
];

const randomLeft = () => Math.floor(Math.random() * (width - 40));

const LoveNote = () => {
    const [isHeartBeating, setIsHeartBeating] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(0);
    const [floatingHearts, setFloatingHearts] = useState([]);

    // Heart beat animation
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Floating heart animation
    const createFloatingHeart = () => {
        const id = Date.now();
        const topAnim = new Animated.Value(height - 120);
        const left = randomLeft();
        setFloatingHearts(prev => [...prev, { id, topAnim, left }]);
        Animated.timing(topAnim, {
            toValue: 20,
            duration: 2500,
            useNativeDriver: true,
            easing: Easing.out(Easing.sin)
        }).start(() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== id));
        });
    };

    useEffect(() => {
        // Heart beat interval
        const beat = () => {
            setIsHeartBeating(true);
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.22,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 320,
                    useNativeDriver: true,
                })
            ]).start(() => setIsHeartBeating(false));
        };
        const interval = setInterval(beat, 3000);
        return () => clearInterval(interval);
    }, []);

    // Rotating quotes interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote(q => (q + 1) % loveQuotes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            {/* Floating Hearts */}
            {floatingHearts.map(({ id, topAnim, left }) => (
                <Animated.Text
                    key={id}
                    style={[
                        styles.floatingHeart,
                        { left, transform: [{ translateY: topAnim }] },
                    ]}
                >
                    🖤
                </Animated.Text>
            ))}
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                {/* Header */}
                <View style={{ alignItems: 'center', marginTop: 36 }}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Icon
                            name="heart"
                            size={72}
                            color={isHeartBeating ? "#fb7185" : "#ef4444"}
                            style={{ marginBottom: 8 }}
                        />
                        {/* Moon icon, positioned absolutely */}
                        <View style={styles.moonIcon}>
                            <Icon name="moon" size={22} color="#d1bbfc" />
                        </View>
                    </Animated.View>
                    <Text style={styles.header}>Happy Birthday, My Dark Angel</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7 }}>
                        <Icon name="star" size={14} color="#f87171" />
                        <Text style={styles.subheader}>My beautiful enigma</Text>
                        <Icon name="star" size={14} color="#f87171" />
                    </View>
                </View>
                {/* Main Love Note */}
                <View style={styles.card}>
                    <Text style={styles.quote}>
                        "You consume my thoughts, awaken desires I never knew existed..."
                    </Text>
                    <Text style={styles.body}>
                        You are intoxicating, the sweetest temptation that courses through my veins.
                        Every curve of your smile drives me wild, every breath you take
                        pulls me deeper into this beautiful madness we call love.
                    </Text>
                    <Text style={styles.body}>
                        Your presence sets my soul ablaze with a hunger only you can satisfy.
                        You are my weakness and my strength, the one who makes me lose control
                        in the most delicious way. I am utterly, completely yours.
                    </Text>
                    <Text style={styles.quoteAlt}>
                        You own every beat of my heart, every thought in my mind 🖤
                    </Text>
                </View>
                {/* Rotating Love Quotes */}
                <View style={styles.rotatingQuote}>
                    <Icon name="message-circle" size={22} color="#fff" style={{ alignSelf: 'center', marginBottom: 6 }} />
                    <Text style={styles.rotatingText}>{loveQuotes[currentQuote]}</Text>
                </View>
                {/* Memories */}
                <View style={styles.memoriesCard}>
                    <Text style={styles.memoriesHeader}>Me & You 🌙</Text>
                    {memories.map(({ icon, text }, i) => (
                        <View key={i} style={styles.memoryItem}>
                            <Text style={{ fontSize: 22, marginRight: 10 }}>{icon}</Text>
                            <Text style={styles.memoryText}>{text}</Text>
                        </View>
                    ))}
                </View>
                {/* Heart Button */}
                <View style={{ alignItems: 'center', marginVertical: 15 }}>
                    <TouchableOpacity style={styles.button} onPress={createFloatingHeart}>
                        <Text style={styles.buttonText}>Send My Love 💕</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#a1a1aa', fontSize: 13, marginTop: 4 }}>Tap to share your heart</Text>
                </View>
                {/* Footer */}
                <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 10 }}>
                    <Text style={{ color: '#a1a1aa', fontSize: 13, marginBottom: 3 }}>
                        Happy Birthday to my irresistible temptation 🔥
                    </Text>
                    <Text style={{ color: '#f87171', fontWeight: 'bold' }}>
                        Forever intoxicated by you, body and soul 🖤❤️
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Deep violet, as base gradient
        justifyContent: 'flex-start',
    },
    floatingHeart: {
        position: 'absolute',
        fontSize: 28,
        color: '#ef4444',
        zIndex: 10,
        bottom: 40,
        left: 0,
    },
    moonIcon: { position: 'absolute', top: -20, right: -26 },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    subheader: {
        fontStyle: 'italic',
        color: '#d1d5db',
        fontSize: 14,
        marginHorizontal: 3,
    },
    card: {
        backgroundColor: '#262834e6',
        borderRadius: 24,
        padding: 20,
        marginTop: 18,
        marginBottom: 14,
        shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#7c264f33'
    },
    quote: {
        fontWeight: '600',
        color: '#fb7185',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    quoteAlt: {
        fontWeight: '600',
        color: '#a78bfa',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
    },
    body: {
        color: '#e3e3e3',
        fontSize: 15,
        marginBottom: 4,
        lineHeight: 22,
    },
    rotatingQuote: {
        backgroundColor: '#9333ea',
        borderRadius: 14,
        padding: 16,
        marginVertical: 12,
        marginHorizontal: 3,
        shadowColor: '#c026d3', shadowOpacity: 0.11, shadowRadius: 6,
    },
    rotatingText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
    },
    memoriesCard: {
        backgroundColor: '#262834e6',
        borderRadius: 18,
        padding: 14,
        marginVertical: 12,
        marginHorizontal: 3,
        shadowColor: '#c026d3', shadowOpacity: 0.09, shadowRadius: 5,
        borderWidth: 1, borderColor: '#a78bfa55',
    },
    memoriesHeader: {
        color: '#e9d5ff',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 8,
    },
    memoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(236, 72, 153, 0.07)',
        borderRadius: 7,
        paddingVertical: 7,
        paddingHorizontal: 8,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    memoryText: {
        color: '#d1d5db',
        fontSize: 14,
        flex: 1,
    },
    button: {
        backgroundColor: '#b91c1c',
        flexDirection: 'row',
        paddingHorizontal: 32,
        paddingVertical: 13,
        borderRadius: 999,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOpacity: 0.23,
        shadowRadius: 5,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.3,
    },
});


export default LoveNote;