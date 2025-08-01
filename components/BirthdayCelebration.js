import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
// import { Audio } from 'expo-av'; // Uncomment if adding background music

const { width, height } = Dimensions.get('window');

const BirthdayCelebration = () => {
    const [balloons, setBalloons] = useState([]);
    const [displayedText, setDisplayedText] = useState('');
    const [showButton, setShowButton] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const soundRef = useRef(null);

    const message = '🎉 Happy Birthday Monkey! 🎉 💖';

    // Typewriter effect
    useEffect(() => {
        let index = 0;
        let currentText = '';

        const timer = setInterval(() => {
            if (index < message.length) {
                currentText += message.charAt(index);
                setDisplayedText(currentText);
                index++;
            } else {
                clearInterval(timer);
                setShowButton(true);
            }
        }, 70);

        return () => clearInterval(timer);
    }, []);

    // Floating penguin animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -height / 2,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);
    useEffect(() => {
        let idCounter = 10;

        const interval = setInterval(() => {
            const translateY = new Animated.Value(0);
            const newBalloon = {
                id: idCounter++,
                x: Math.random() * (width - 80),
                popped: false,
                translateY,
            };

            setBalloons((prev) => [...prev, newBalloon]);

            Animated.timing(translateY, {
                toValue: -height,
                duration: 5000 + Math.random() * 3000,
                useNativeDriver: true,
            }).start(() => {
                setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));
            });
        }, 1500); // Adjust spawn speed here

        return () => clearInterval(interval);
    }, []);


    // Generate balloons
    useEffect(() => {
        const generated = Array.from({ length: 5 }).map((_, index) => {
            const translateY = new Animated.Value(0);
            const duration = 5000 + Math.random() * 3000; // random speed

            Animated.timing(translateY, {
                toValue: -height,
                duration,
                useNativeDriver: true,
            }).start(() => {
                // Remove balloon when it finishes floating
                setBalloons((prev) => prev.filter((b) => b.id !== index));
            });

            return {
                id: index,
                x: Math.random() * (width - 80),
                popped: false,
                translateY,
            };
        });

        setBalloons(generated);
    }, []);


    // Optional: Background music
    /*
    useEffect(() => {
      const playMusic = async () => {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/happy-birthday.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        soundRef.current = sound;
        await sound.playAsync();
      };
      playMusic();
      return () => {
        soundRef.current?.unloadAsync();
      };
    }, []);
    */

    // Handle popping balloon
    const handlePop = (id) => {
        setBalloons((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, popped: true } : b
            )
        );

        setTimeout(() => {
            setBalloons((prev) => prev.filter((b) => b.id !== id));
        }, 700);
    };


    return (
        <View style={styles.container}>
            {balloons.map((balloon) => (
                <Animated.View
                    key={balloon.id}
                    style={[
                        styles.balloon,
                        {
                            left: balloon.x,
                            transform: [{ translateY: balloon.translateY }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handlePop(balloon.id)}
                    >
                        <LottieView
                            source={
                                balloon.popped
                                    ? require('../assets/confetti.json')
                                    : require('../assets/Balloon.json')
                            }
                            autoPlay
                            loop={!balloon.popped}
                            style={{ width: 110, height: 110 }}
                        />
                    </TouchableOpacity>
                </Animated.View>
            ))}
            <View style={styles.lovingNote}>
                <Text style={styles.noteText}>
                    "To my sweet Monkey —
                    Your smile is sunshine,
                    your laugh is confetti,
                    and your love is my everyday miracle.
                    Happy Birthday, my heart!" 💖🎈
                </Text>
            </View>

            {/* Fireworks background */}
            <LottieView
                source={require('../assets/Fireworks.json')}
                autoPlay
                loop
                style={styles.fireworks}
            />

            {/* Hanging monkey */}
            <View style={styles.topRightLottie}>
                <LottieView
                    source={require('../assets/HangingMonkey.json')}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
            </View>

            {/* Floating penguin */}
            <Animated.View
                style={[styles.floatingLottie, { transform: [{ translateY: floatAnim }] }]}
            >
                <LottieView
                    source={require('../assets/Penguin.json')}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
            </Animated.View>

            {/* Confetti explosion (trigger-ready) */}
            <Animated.View style={[styles.explosion, { opacity: fadeAnim }]}>
                <LottieView
                    source={require('../assets/confetti.json')}
                    autoPlay
                    loop={false}
                    style={styles.explosion}
                />
            </Animated.View>

            {/* Typed message */}
            <View style={styles.textBox}>
                <Text style={styles.typedText}>
                    {displayedText}
                    <Text style={styles.cursor}>|</Text>
                </Text>
            </View>
        </View>
    );
};

export default BirthdayCelebration;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    fireworks: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },
    explosion: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
        zIndex: 15,
        pointerEvents: 'none',
    },
    topRightLottie: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 5,
    },
    floatingLottie: {
        position: 'absolute',
        bottom: 0,
        left: width / 2 - 100,
        width: 200,
        height: 200,
        zIndex: 5,
    },
    balloon: {
        position: 'absolute',
        bottom: 0,
        zIndex: 6,
    },
    textBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 30,
    },
    typedText: {
        fontSize: 22,
        color: '#facc15',
        textAlign: 'center',
        fontFamily: 'serif',
        textShadowColor: '#f472b6',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        lineHeight: 32,
    },
    cursor: {
        color: '#facc15',
        fontWeight: 'bold',
        opacity: 0.6,
    },
    lovingNote: {
        position: 'absolute',
        top: height * 0.2,
        paddingHorizontal: 20,
        zIndex: 1,
        opacity: 0.5, // subtle in background
    },

    noteText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'serif',
        lineHeight: 28,
    },

});
