import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    Modal,
    Alert,
    SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Jar = () => {
    const [notes, setNotes] = useState([
        'Every moment with you feels like magic ✨',
        'Your smile lights up my entire world 😊',
        'I fall in love with you more each day 💕',
        'You are my favorite hello and hardest goodbye',
    ]);
    const [inputText, setInputText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const jarShakeAnim = useRef(new Animated.Value(0)).current;
    const noteAnimations = useRef([]).current;
    const modalAnim = useRef(new Animated.Value(0)).current;
    const floatingHearts = useRef([]).current;
    const jarFillAnim = useRef(new Animated.Value(0)).current;

    // Jar capacity settings
    const MAX_NOTES = 25;
    const FULL_WARNING_THRESHOLD = 20;

    // Initialize animations for existing notes and update jar fill level
    useEffect(() => {
        notes.forEach((_, index) => {
            if (!noteAnimations[index]) {
                noteAnimations[index] = new Animated.Value(1);
            }
        });

        // Animate jar fill level based on note count
        const fillPercentage = Math.min(notes.length / MAX_NOTES, 1);
        Animated.timing(jarFillAnim, {
            toValue: fillPercentage,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [notes]);

    // Floating hearts animation
    useEffect(() => {
        const createFloatingHeart = () => {
            const heartAnim = new Animated.Value(0);
            floatingHearts.push(heartAnim);

            Animated.timing(heartAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            }).start(() => {
                const index = floatingHearts.indexOf(heartAnim);
                if (index > -1) floatingHearts.splice(index, 1);
            });
        };

        const interval = setInterval(createFloatingHeart, 2000);
        return () => clearInterval(interval);
    }, []);

    const addNote = () => {
        if (!inputText.trim()) return;

        // Check if jar is full
        if (notes.length >= MAX_NOTES) {
            Alert.alert(
                '🫙 Jar is Full!',
                `Your love jar has reached its magical capacity of ${MAX_NOTES} notes! Consider removing some old memories to make space for new ones, or start a new jar for more adventures together! 💕`,
                [
                    { text: 'Keep Writing', style: 'cancel' },
                    { text: 'Start New Jar', onPress: startNewJar },
                ]
            );
            return;
        }

        // Warn when jar is getting full
        if (notes.length === FULL_WARNING_THRESHOLD) {
            Alert.alert(
                '⚠️ Jar Getting Full',
                `Your jar is almost full! Only ${MAX_NOTES - FULL_WARNING_THRESHOLD} more notes can fit. Consider starting a new jar soon! 💝`,
                [{ text: 'Got it!', style: 'default' }]
            );
        }

        const newIndex = notes.length;
        setNotes([...notes, inputText.trim()]);
        setInputText('');

        // Initialize animation for new note
        noteAnimations[newIndex] = new Animated.Value(0);

        // Animate jar shake and new note appearance
        Animated.sequence([
            Animated.timing(jarShakeAnim, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(jarShakeAnim, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(jarShakeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Animate new note
        Animated.spring(noteAnimations[newIndex], {
            toValue: 1,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
        }).start();

        const remainingSpace = MAX_NOTES - notes.length - 1;
        const message = remainingSpace > 5
            ? 'Love note added to your magical jar!'
            : `Love note added! ${remainingSpace} more notes can fit.`;

        Alert.alert('💝', message);
    };

    const openNote = (note, index) => {
        setSelectedNote(note);
        setSelectedIndex(index);
        setModalVisible(true);

        Animated.spring(modalAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
        });
    };

    const deleteNote = (index) => {
        Alert.alert(
            '💔 Remove Note',
            'Are you sure you want to remove this precious memory?',
            [
                { text: 'Keep It', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        Animated.timing(noteAnimations[index], {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => {
                            const newNotes = notes.filter((_, i) => i !== index);
                            setNotes(newNotes);
                            noteAnimations.splice(index, 1);
                        });
                    },
                },
            ]
        );
    };

    const startNewJar = () => {
        Alert.alert(
            '🆕 New Love Jar',
            'This will clear all current notes and start fresh. Your old memories will be gone forever! Are you sure?',
            [
                { text: 'Keep Current Jar', style: 'cancel' },
                {
                    text: 'Start Fresh',
                    style: 'destructive',
                    onPress: () => {
                        setNotes([]);
                        noteAnimations.length = 0;
                        Alert.alert('✨', 'New love jar created! Ready for new memories! 💕');
                    },
                },
            ]
        );
    };

    const getJarCapacityInfo = () => {
        const percentage = (notes.length / MAX_NOTES) * 100;
        if (percentage >= 100) return { text: 'Full!', color: '#FF4444', icon: '🔴' };
        if (percentage >= 80) return { text: 'Almost Full', color: '#FF8800', icon: '🟡' };
        if (percentage >= 50) return { text: 'Half Full', color: '#FFD700', icon: '🟨' };
        return { text: 'Plenty of Space', color: '#32CD32', icon: '🟢' };
    };

    const getNoteStyle = (index) => {
        const colors = [
            { bg: '#FFE4E6', border: '#FF69B4', shadow: '#FFB6C1' },
            { bg: '#E8F5E8', border: '#32CD32', shadow: '#90EE90' },
            { bg: '#FFF8DC', border: '#FFD700', shadow: '#F0E68C' },
            { bg: '#E6E6FA', border: '#9370DB', shadow: '#DDA0DD' },
            { bg: '#F0F8FF', border: '#87CEEB', shadow: '#B0E0E6' },
            { bg: '#FFF0F5', border: '#FF1493', shadow: '#FFB6C1' },
        ];
        return colors[index % colors.length];
    };

    const getRandomRotation = (index) => {
        const rotations = [-15, -8, 0, 8, 15, -12, 6, -6, 12];
        return rotations[index % rotations.length];
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a0d26" />

            {/* Background */}
            <View style={styles.background}>
                {/* Floating Hearts */}
                {floatingHearts.map((anim, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.floatingHeart,
                            {
                                left: Math.random() * (width - 30),
                                opacity: anim,
                                transform: [
                                    {
                                        translateY: anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [height, -50],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.heartEmoji}>💖</Text>
                    </Animated.View>
                ))}

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>✨ Love Jar ✨</Text>
                    <Text style={styles.subtitle}>
                        Where beautiful memories live forever
                    </Text>
                </View>

                {/* Jar Container */}
                <Animated.View
                    style={[
                        styles.jarContainer,
                        {
                            transform: [{ translateX: jarShakeAnim }],
                        },
                    ]}
                >
                    {/* Jar Lid */}
                    <View style={styles.jarLid}>
                        <View style={styles.lidHandle} />
                        <View style={styles.lidTop} />
                        <View style={styles.lidShadow} />
                    </View>

                    {/* Main Jar */}
                    <View style={styles.jar}>
                        {/* Jar Fill Indicator */}
                        <Animated.View
                            style={[
                                styles.jarFill,
                                {
                                    height: jarFillAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '85%'],
                                    }),
                                    opacity: jarFillAnim.interpolate({
                                        inputRange: [0, 0.1, 1],
                                        outputRange: [0, 0.3, 0.6],
                                    }),
                                },
                            ]}
                        />
                        <View style={styles.jarGlass} />
                        <ScrollView
                            style={styles.jarContent}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {notes.map((note, index) => {
                                const noteStyle = getNoteStyle(index);
                                const rotation = getRandomRotation(index);
                                const animation = noteAnimations[index] || new Animated.Value(1);

                                return (
                                    <Animated.View
                                        key={index}
                                        style={[
                                            styles.noteWrapper,
                                            {
                                                transform: [
                                                    { rotate: `${rotation}deg` },
                                                    { scale: animation },
                                                ],
                                                opacity: animation,
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => openNote(note, index)}
                                            onLongPress={() => deleteNote(index)}
                                            activeOpacity={0.8}
                                        >
                                            <View
                                                style={[
                                                    styles.note,
                                                    {
                                                        backgroundColor: noteStyle.bg,
                                                        borderColor: noteStyle.border,
                                                        shadowColor: noteStyle.shadow,
                                                    },
                                                ]}
                                            >
                                                <Text style={styles.noteText} numberOfLines={3}>
                                                    {note}
                                                </Text>
                                                <View style={styles.noteTape} />
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}

                            {notes.length === 0 && (
                                <View style={styles.emptyJar}>
                                    <Text style={styles.emptyIcon}>🫙</Text>
                                    <Text style={styles.emptyText}>
                                        Your love jar is waiting{'\n'}for its first sweet memory
                                    </Text>
                                </View>
                            )}
                        </ScrollView>

                        {/* Jar Base */}
                        <View style={styles.jarBase} />
                    </View>
                </Animated.View>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Write something beautiful..."
                            placeholderTextColor="#B8860B"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={150}
                        />
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                {
                                    opacity: (inputText.trim() && notes.length < MAX_NOTES) ? 1 : 0.5,
                                    backgroundColor: notes.length >= MAX_NOTES ? '#888' : '#FF69B4',
                                }
                            ]}
                            onPress={addNote}
                            disabled={!inputText.trim() || notes.length >= MAX_NOTES}
                        >
                            <Text style={styles.addButtonText}>
                                {notes.length >= MAX_NOTES ? '🔒' : '💝'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.counter}>
                            {notes.length}/{MAX_NOTES} precious memor{notes.length !== 1 ? 'ies' : 'y'}
                        </Text>
                        <View style={styles.heartSeparator}>
                            <Text style={styles.heartIcon}>💕</Text>
                        </View>
                        <View style={styles.capacityIndicator}>
                            <Text style={styles.capacityIcon}>{getJarCapacityInfo().icon}</Text>
                            <Text style={[styles.capacityText, { color: getJarCapacityInfo().color }]}>
                                {getJarCapacityInfo().text}
                            </Text>
                        </View>
                        {notes.length >= MAX_NOTES && (
                            <TouchableOpacity style={styles.newJarButton} onPress={startNewJar}>
                                <Text style={styles.newJarButtonText}>Start New Jar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Modal */}
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="none"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    opacity: modalAnim,
                                    transform: [
                                        {
                                            scale: modalAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.7, 1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>💖 Love Note 💖</Text>
                                <TouchableOpacity
                                    style={styles.closeIcon}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.closeIconText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[
                                styles.modalNoteCard,
                                selectedIndex >= 0 ? {
                                    backgroundColor: getNoteStyle(selectedIndex).bg,
                                    borderColor: getNoteStyle(selectedIndex).border,
                                } : {}
                            ]}>
                                <Text style={styles.modalNoteText}>{selectedNote}</Text>
                                <View style={styles.modalNoteTape} />
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Keep This Memory Safe</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0d26',
    },
    background: {
        flex: 1,
        background: 'linear-gradient(135deg, #1a0d26 0%, #2d1b3d 50%, #4a2c5e 100%)',
    },
    floatingHeart: {
        position: 'absolute',
        zIndex: 1,
    },
    heartEmoji: {
        fontSize: 24,
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFE4E1',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(255, 182, 193, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#DDA0DD',
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.9,
    },
    jarContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        maxHeight: height * 0.5,
    },
    jarLid: {
        alignItems: 'center',
        marginBottom: -8,
        zIndex: 3,
    },
    lidHandle: {
        width: 20,
        height: 8,
        backgroundColor: '#8B4513',
        borderRadius: 4,
        marginBottom: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    lidTop: {
        width: width * 0.55,
        height: 18,
        backgroundColor: '#CD853F',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#8B4513',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    lidShadow: {
        width: width * 0.5,
        height: 6,
        backgroundColor: 'rgba(139, 69, 19, 0.6)',
        marginTop: 2,
        borderRadius: 15,
    },
    jar: {
        width: width * 0.75,
        height: height * 0.4,
        position: 'relative',
    },
    jarFill: {
        position: 'absolute',
        bottom: 25,
        left: 2,
        right: 2,
        backgroundColor: 'rgba(255, 182, 193, 0.4)',
        borderBottomLeftRadius: 23,
        borderBottomRightRadius: 23,
        zIndex: 1,
    },
    jarGlass: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 25,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 15,
    },
    jarContent: {
        flex: 1,
        padding: 15,
        zIndex: 2,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    jarBase: {
        position: 'absolute',
        bottom: -5,
        left: -5,
        right: -5,
        height: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 30,
        zIndex: 1,
    },
    noteWrapper: {
        marginBottom: 12,
        alignSelf: Math.random() > 0.5 ? 'flex-start' : 'flex-end',
    },
    note: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        maxWidth: width * 0.55,
        minWidth: width * 0.3,
        borderWidth: 1,
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        position: 'relative',
    },
    noteText: {
        color: '#2F4F4F',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 18,
    },
    noteTape: {
        position: 'absolute',
        top: -4,
        right: 8,
        width: 20,
        height: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
        borderRadius: 2,
        transform: [{ rotate: '15deg' }],
    },
    emptyJar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        color: '#8B7D8B',
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 24,
    },
    inputSection: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 182, 193, 0.3)',
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
        fontFamily: 'System',
    },
    addButton: {
        backgroundColor: '#FF69B4',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF1493',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    addButtonText: {
        fontSize: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    counter: {
        color: '#DDA0DD',
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    heartSeparator: {
        marginHorizontal: 10,
    },
    heartIcon: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 30,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4',
    },
    closeIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 105, 180, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconText: {
        fontSize: 16,
        color: '#FF69B4',
        fontWeight: 'bold',
    },
    modalNoteCard: {
        borderRadius: 15,
        padding: 25,
        marginBottom: 25,
        borderWidth: 2,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modalNoteText: {
        fontSize: 18,
        color: '#2F4F4F',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
    },
    modalNoteTape: {
        position: 'absolute',
        top: -6,
        right: 20,
        width: 30,
        height: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
        borderRadius: 3,
        transform: [{ rotate: '10deg' }],
    },
    closeButton: {
        backgroundColor: '#FF69B4',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 25,
        alignSelf: 'center',
        shadowColor: '#FF1493',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    capacityIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    capacityIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    capacityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    newJarButton: {
        backgroundColor: 'rgba(255, 105, 180, 0.8)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Jar;