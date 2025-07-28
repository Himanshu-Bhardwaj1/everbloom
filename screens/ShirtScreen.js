import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ShirtScreen = () => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [showShirt, setShowShirt] = useState(false);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shirtFadeAnim = useRef(new Animated.Value(0)).current;
    const shirtScaleAnim = useRef(new Animated.Value(0.5)).current;
    const confettiAnims = useRef(
        Array.from({ length: 20 }, () => ({
            translateY: new Animated.Value(-50),
            rotate: new Animated.Value(0),
        }))
    ).current;

    const handleReveal = () => {
        setIsRevealed(true);

        // Animate gift box disappearing
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Show shirt after delay
        setTimeout(() => {
            setShowShirt(true);
            Animated.parallel([
                Animated.spring(shirtFadeAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.spring(shirtScaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            // Start confetti animation
            startConfetti();
        }, 1000);
    };

    const startConfetti = () => {
        confettiAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.parallel([
                    Animated.timing(anim.translateY, {
                        toValue: height + 100,
                        duration: 3000 + Math.random() * 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.rotate, {
                        toValue: 360,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    };

    const ConfettiPiece = ({ animValue, color, left }) => (
        <Animated.View
            style={[
                styles.confetti,
                {
                    left: left,
                    backgroundColor: color,
                    transform: [
                        { translateY: animValue.translateY },
                        {
                            rotate: animValue.rotate.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                            }),
                        },
                    ],
                },
            ]}
        />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />

            {/* Background Decorations */}
            <View style={styles.backgroundDecorations}>
                <Text style={[styles.decoration, { top: 60, left: 30 }]}>⚽</Text>
                <Text style={[styles.decoration, { top: 120, right: 40 }]}>👑</Text>
                <Text style={[styles.decoration, { bottom: 150, left: 40 }]}>🏆</Text>
                <Text style={[styles.decoration, { bottom: 80, right: 30 }]}>⭐</Text>
                <Text style={[styles.decoration, { top: height / 2, left: 20 }]}>💙</Text>
                <Text style={[styles.decoration, { top: height / 3, right: 20 }]}>🤍</Text>
            </View>

            {/* Confetti */}
            {showShirt && confettiAnims.map((anim, index) => (
                <ConfettiPiece
                    key={index}
                    animValue={anim}
                    color={index % 3 === 0 ? '#facc15' : index % 3 === 1 ? '#ef4444' : '#3b82f6'}
                    left={Math.random() * (width - 20)}
                />
            ))}

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!isRevealed ? (
                    /* Mystery Gift Box */
                    <View style={styles.giftContainer}>
                        <Animated.View
                            style={[
                                styles.giftBox,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    opacity: fadeAnim,
                                },
                            ]}
                        >
                            <View style={styles.giftBoxInner}>
                                <Text style={styles.giftEmoji}>🎁</Text>
                            </View>
                            <View style={styles.mysteryBadge}>
                                <Text style={styles.mysteryText}>?</Text>
                            </View>
                        </Animated.View>

                        <Text style={styles.title}>Mystery Gift Awaits!</Text>
                        <Text style={styles.subtitle}>
                            Something special is waiting inside...{'\n'}
                            Are you ready to discover what it is?
                        </Text>

                        <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
                            <Text style={styles.revealButtonText}>🎉 Reveal My Gift! 🎉</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Revealed Gift */
                    <View style={styles.revealContainer}>
                        {showShirt && (
                            <Animated.View
                                style={[
                                    styles.shirtContainer,
                                    {
                                        opacity: shirtFadeAnim,
                                        transform: [{ scale: shirtScaleAnim }],
                                    },
                                ]}
                            >
                                {/* Real Madrid Jersey */}
                                <View style={styles.jersey}>
                                    <View style={styles.jerseyHeader}>
                                        <View style={styles.logoContainer}>
                                            <Text style={styles.logoText}>👑</Text>
                                            <Text style={styles.realMadridText}>REAL MADRID</Text>
                                        </View>
                                    </View>

                                    <View style={styles.jerseyBody}>
                                        <View style={styles.jerseyStripes}>
                                            <View style={[styles.stripe, { backgroundColor: '#ffffff' }]} />
                                            <View style={[styles.stripe, { backgroundColor: '#f8f9fa' }]} />
                                            <View style={[styles.stripe, { backgroundColor: '#ffffff' }]} />
                                        </View>

                                        <View style={styles.jerseyCenter}>
                                            <Text style={styles.flyEmiratesText}>Fly Emirates</Text>
                                            <View style={styles.numberContainer}>
                                                <Text style={styles.jerseyNumber}>7</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.jerseyBottom}>
                                        <Text style={styles.playerName}>Priyansh</Text>
                                    </View>
                                </View>

                                <Text style={styles.revealTitle}>Your Real Madrid Jersey! 👑</Text>
                                <Text style={styles.revealSubtitle}>
                                    For the queen who deserves to support{'\n'}
                                    the greatest team in the world! 🤍
                                </Text>

                                <View style={styles.detailsContainer}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Team:</Text>
                                        <Text style={styles.detailValue}>Real Madrid CF</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Season:</Text>
                                        <Text style={styles.detailValue}>2024/25 Home Kit</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Number:</Text>
                                        <Text style={styles.detailValue}>Your Lucky 7</Text>
                                    </View>
                                </View>

                                <Text style={styles.loveMessage}>
                                    Now we can cheer for Los Blancos together! 💙🤍
                                </Text>
                            </Animated.View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
    },
    backgroundDecorations: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    decoration: {
        position: 'absolute',
        fontSize: 40,
        opacity: 0.1,
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        zIndex: 1,
    },
    giftContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    giftBox: {
        width: 200,
        height: 200,
        marginBottom: 30,
        position: 'relative',
    },
    giftBoxInner: {
        width: '100%',
        height: '100%',
        backgroundColor: '#facc15',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#facc15',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    giftEmoji: {
        fontSize: 80,
    },
    mysteryBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 50,
        height: 50,
        backgroundColor: '#ef4444',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    mysteryText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#facc15',
        textAlign: 'center',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#d4d4d8',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    revealButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    revealButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    revealContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    shirtContainer: {
        alignItems: 'center',
        width: '100%',
    },
    jersey: {
        width: 250,
        height: 300,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    jerseyHeader: {
        height: 60,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        marginBottom: 2,
    },
    realMadridText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f2937',
        letterSpacing: 1,
    },
    jerseyBody: {
        flex: 1,
        position: 'relative',
    },
    jerseyStripes: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    stripe: {
        flex: 1,
        opacity: 0.5,
    },
    jerseyCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flyEmiratesText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    numberContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(31, 41, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    jerseyNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    jerseyBottom: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
    },
    playerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        letterSpacing: 2,
    },
    revealTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#facc15',
        textAlign: 'center',
        marginBottom: 10,
    },
    revealSubtitle: {
        fontSize: 16,
        color: '#d4d4d8',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#1c1917',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#9ca3af',
    },
    detailValue: {
        fontSize: 14,
        color: '#facc15',
        fontWeight: '600',
    },
    loveMessage: {
        fontSize: 16,
        color: '#be185d',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
});

export default ShirtScreen;