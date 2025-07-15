import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Heart } from 'lucide-react-native'; // Use lucide-react-native for React Native

const SplashScreen = () => {
    const [scale] = useState(new Animated.Value(1));

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [scale]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.heartContainer, { transform: [{ scale }] }]}>
                <View style={styles.relative}>
                    <Heart size={80} color="#f472b6" />
                    <Heart
                        size={60}
                        color="#fbcfe8"
                        style={styles.innerHeart}
                    />
                </View>
            </Animated.View>
            <Text style={styles.title}>My Queen</Text>
            <Animated.Text style={styles.subtitle}>
                Mi Amor...
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linear-gradient(135deg, #ffe4e6 0%, #ffedd5 100%)', // You may need a gradient library like 'expo-linear-gradient'
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    relative: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerHeart: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -30,
        marginTop: -30,
        transform: [{ rotate: '45deg' }],
    },
    title: {
        marginTop: 32,
        fontSize: 36,
        color: '#be185d',
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: 12,
        fontSize: 14,
        color: '#f472b6',
        opacity: 0.7,
    },
});

export default SplashScreen;