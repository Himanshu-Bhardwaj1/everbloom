import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
    Pressable,
    ScrollView,
    Image
} from 'react-native';

const { width, height } = Dimensions.get('window');
const MAX_PARTICLES = 8;

// Floating heart particles animation
const HeartParticle = ({ left, delay }) => {
    const translateY = useRef(new Animated.Value(height * 0.6)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height * 0.2,
                    duration: 3500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                delay: 1200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.Text
            style={[styles.heartParticle, { left, opacity, transform: [{ translateY }] }]}
            pointerEvents="none"
        >
            💕
        </Animated.Text>
    );
};

export default function MemoryModal({
    visible,
    onClose,
    modalTitle,
    modalDescription,
    modalEmojis,
    modalUrl,
}) {
    const [particles, setParticles] = useState([]);
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    // Bounces for emoji animation
    const emojiBounces = (modalEmojis || []).map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();

            // Heart particles
            setParticles([]);
            const delays = [];
            for (let i = 0; i < MAX_PARTICLES; i++) {
                delays.push(Math.random() * 1400 + i * 330);
            }
            setTimeout(() => {
                setParticles(
                    delays.map((d, i) => ({
                        key: `hp${i}_${Math.random()}`,
                        left: Math.random() * (width - 40),
                        delay: d,
                    }))
                );
            }, 250);

            // Animate emoji bounce loop
            emojiBounces.forEach((anim, i) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, { toValue: -10, duration: 850, delay: i * 360, useNativeDriver: true }),
                        Animated.timing(anim, { toValue: 0, duration: 650, useNativeDriver: true }),
                    ])
                ).start();
            });
        } else {
            slideAnim.setValue(-50);
            opacityAnim.setValue(0);
            setParticles([]);
            emojiBounces.forEach(anim => anim.setValue(0));
        }
    }, [visible]);

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalCard,
                        {
                            opacity: opacityAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} accessible accessibilityLabel="Close modal">
                        <Text style={{ fontSize: 28, color: '#ff6b6b', fontWeight: 'bold' }}>×</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <View style={styles.emojiContainer}>
                        <View style={styles.imageWrapper}>
                            {modalUrl && (
                                <Image
                                    source={{ uri: modalUrl }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                        {/* Heart particles */}
                        {particles.map(({ left, delay, key }) => (
                            <HeartParticle key={key} left={left} delay={delay} />
                        ))}
                    </View>
                    <ScrollView style={styles.descScroll} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
                        <Text style={styles.memoryDesc}>{modalDescription}</Text>
                    </ScrollView>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(20,20,20,0.87)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#181828',
        borderRadius: 22,
        padding: 24,
        borderWidth: 2,
        borderColor: '#ffd93d',
        shadowColor: '#000', shadowOpacity: 0.7, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 16,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 17,
        textAlign: 'center',
        color: '#ffd93d',
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        minHeight: 80,
        alignItems: 'flex-end',
        position: 'relative',
    },
    emoji: {
        fontSize: 60,
        marginHorizontal: 9,
        zIndex: 2,
    },
    heartParticle: {
        position: 'absolute',
        fontSize: 20,
        color: '#ff6b6b',
        zIndex: 10,
    },
    descScroll: {
        maxHeight: 150,
        marginTop: 5,
    },
    memoryDesc: {
        color: '#f0f0f0',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        paddingTop: 7,
        fontWeight: '400',
    },
    imageWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    },
    modalImage: {
        width: '100%',
        height: 180,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: '#222', // fallback bg
    },

});
