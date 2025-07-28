import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Alert,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Heart, Fire, Star, Clock, BookOpen, Eye, EyeOff, FireExtinguisher } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SmutScreen = () => {
    const [unlockedSections, setUnlockedSections] = useState(new Set([0])); // First section unlocked
    const [fadeAnim] = useState(new Animated.Value(0));
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Check for daily unlocks
        checkDailyUnlocks();
    }, []);

    const checkDailyUnlocks = () => {
        const lastUnlock = new Date().getDate();
        // Simulate daily unlock logic
        const daysSinceStart = Math.floor((Date.now() - new Date('2024-01-01')) / (1000 * 60 * 60 * 24));
        const unlockedCount = Math.min(daysSinceStart + 1, smutLibrary.length);

        const newUnlocked = new Set();
        for (let i = 0; i < unlockedCount; i++) {
            newUnlocked.add(i);
        }
        setUnlockedSections(newUnlocked);
    };

    const smutLibrary = [
        {
            id: 1,
            title: "Midnight Confessions",
            category: "romance",
            intensity: 3,
            description: "Sweet whispers in the darkness...",
            preview: "The way you look at me in candlelight makes my heart race...",
            content: "Your fingers trace patterns on my skin as we lay entwined in silk sheets. The moonlight streaming through the window illuminates your beautiful face as you whisper sweet nothings that make my soul ignite with passion...",
            unlockDay: 0,
            emoji: "🌙",
            color: ["#1a1a2e", "#16213e"]
        },
        {
            id: 2,
            title: "Secret Desires",
            category: "spicy",
            intensity: 4,
            description: "Hidden fantasies come alive...",
            preview: "I've been thinking about what we could do when we're alone...",
            content: "The tension between us is electric as our eyes meet across the room. Every stolen glance, every accidental touch sends shivers down my spine. Tonight, I want to show you exactly what you do to me...",
            unlockDay: 1,
            emoji: "🔥",
            color: ["#2d1b69", "#11263c"]
        },
        {
            id: 3,
            title: "Forbidden Touch",
            category: "naughty",
            intensity: 5,
            description: "When boundaries disappear...",
            preview: "Your touch ignites something primal within me...",
            content: "Every caress sends waves of pleasure through my body. The way you look at me with those hungry eyes makes me lose all control. I want to explore every inch of you, to taste your lips and feel your breath against my skin...",
            unlockDay: 2,
            emoji: "💋",
            color: ["#4a0e4e", "#2d1b69"]
        },
        {
            id: 4,
            title: "Velvet Dreams",
            category: "sensual",
            intensity: 4,
            description: "Luxury meets passion...",
            preview: "Silk and satin against heated skin...",
            content: "The velvet couch becomes our playground as we lose ourselves in each other. Your hands explore with purpose, finding every sensitive spot that makes me gasp your name. The night is young and full of possibilities...",
            unlockDay: 3,
            emoji: "🌹",
            color: ["#8b0000", "#4a0e4e"]
        },
        {
            id: 5,
            title: "After Hours",
            category: "naughty",
            intensity: 5,
            description: "When the world sleeps, we awaken...",
            preview: "3 AM and you're all I can think about...",
            content: "The city sleeps but we're wide awake, lost in our own world of pleasure and desire. Your whispered confessions in the dark make my body respond in ways I never imagined. Tonight, we make our own rules...",
            unlockDay: 4,
            emoji: "🌃",
            color: ["#0f0f23", "#8b0000"]
        },
        {
            id: 6,
            title: "Morning Glory",
            category: "romance",
            intensity: 3,
            description: "Sunrise seductions...",
            preview: "Waking up next to you is pure bliss...",
            content: "Golden sunlight filters through the curtains as I trace lazy circles on your chest. Morning has never felt so perfect, with your sleepy smile and gentle touches that promise so much more to come...",
            unlockDay: 5,
            emoji: "☀️",
            color: ["#ff6b35", "#f7931e"]
        },
        {
            id: 7,
            title: "Crimson Passion",
            category: "spicy",
            intensity: 5,
            description: "When love burns brightest...",
            preview: "Red lips, red wine, red hot desire...",
            content: "The taste of wine on your lips mingles with the heat of our passion. Red candles flicker around us as we lose ourselves completely. Tonight, nothing else exists but you and me and this burning need...",
            unlockDay: 6,
            emoji: "🍷",
            color: ["#dc143c", "#8b0000"]
        }
    ];

    const categories = [
        { key: 'all', label: 'All Stories', icon: BookOpen, color: '#ff6b35' },
        { key: 'romance', label: 'Romance', icon: Heart, color: '#e91e63' },
        { key: 'spicy', label: 'Spicy', icon: FireExtinguisher, color: '#ff5722' },
        { key: 'sensual', label: 'Sensual', icon: Star, color: '#9c27b0' },
        { key: 'naughty', label: 'Naughty', icon: Eye, color: '#f44336' }
    ];

    const filteredLibrary = selectedCategory === 'all'
        ? smutLibrary
        : smutLibrary.filter(item => item.category === selectedCategory);

    const isUnlocked = (index) => unlockedSections.has(index);

    const getIntensityStars = (intensity) => {
        return '🔥'.repeat(intensity);
    };

    const handleStoryPress = (story, index) => {
        if (!isUnlocked(index)) {
            Alert.alert(
                "🔒 Locked Content",
                `This steamy story unlocks in ${story.unlockDay - Array.from(unlockedSections).length + 1} day(s). Come back tomorrow for more spicy content! 😘`,
                [{ text: "Can't Wait! 💕", style: "cancel" }]
            );
            return;
        }

        Alert.alert(
            story.title + " " + story.emoji,
            story.content,
            [
                { text: "More Please 😍", style: "default" },
                { text: "Save for Later 💾", style: "cancel" }
            ]
        );
    };

    const renderStoryCard = (story, index) => {
        const locked = !isUnlocked(index);

        return (
            <TouchableOpacity
                key={story.id}
                style={[styles.storyCard, locked && styles.lockedCard]}
                onPress={() => handleStoryPress(story, index)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={locked ? ['#2a2a2a', '#1a1a1a'] : story.color}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.storyEmoji}>
                            {locked ? '🔒' : story.emoji}
                        </Text>
                        <View style={styles.intensityContainer}>
                            <Text style={styles.intensityText}>
                                {locked ? '???' : getIntensityStars(story.intensity)}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.storyTitle, locked && styles.lockedText]}>
                        {locked ? '??? ??? ???' : story.title}
                    </Text>

                    <Text style={[styles.storyDescription, locked && styles.lockedText]}>
                        {locked ? 'Unlock to reveal this spicy content...' : story.description}
                    </Text>

                    <Text style={[styles.storyPreview, locked && styles.lockedText]}>
                        {locked ? `Unlocks in ${story.unlockDay - Array.from(unlockedSections).length + 1} day(s) 🔥` : story.preview}
                    </Text>

                    {locked && (
                        <View style={styles.lockOverlay}>
                            <Lock size={24} color="#ff6b35" />
                            <Text style={styles.lockText}>Coming Soon</Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0a0a0a', '#1a1a2e', '#16213e']}
                style={styles.background}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Smut Library 📚</Text>
                        <Text style={styles.headerSubtitle}>
                            Your collection of spicy stories 🔥
                        </Text>
                        <Text style={styles.unlockCounter}>
                            {unlockedSections.size}/{smutLibrary.length} Unlocked
                        </Text>
                    </View>

                    {/* Category Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryContainer}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.key}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category.key && {
                                        backgroundColor: category.color + '40',
                                        borderColor: category.color
                                    }
                                ]}
                                onPress={() => setSelectedCategory(category.key)}
                            >
                                <category.icon size={16} color={category.color} />
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category.key && { color: category.color }
                                ]}>
                                    {category.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Stories Grid */}
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.storiesGrid}>
                            {filteredLibrary.map((story, index) => renderStoryCard(story, index))}
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                💕 New stories unlock daily 💕
                            </Text>
                            <Text style={styles.footerSubtext}>
                                Come back tomorrow for more spicy content!
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    background: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff6b35',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#cccccc',
        marginBottom: 10,
    },
    unlockCounter: {
        fontSize: 14,
        color: '#ff6b35',
        backgroundColor: '#ff6b3520',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ff6b35',
    },
    categoryContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333333',
        backgroundColor: '#1a1a1a',
    },
    categoryText: {
        color: '#cccccc',
        marginLeft: 5,
        fontSize: 12,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    storiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    storyCard: {
        width: '48%',
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    lockedCard: {
        opacity: 0.7,
    },
    cardGradient: {
        padding: 15,
        minHeight: 180,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    storyEmoji: {
        fontSize: 24,
    },
    intensityContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    intensityText: {
        fontSize: 12,
        color: '#fff',
    },
    storyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    storyDescription: {
        fontSize: 12,
        color: '#cccccc',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    storyPreview: {
        fontSize: 11,
        color: '#aaaaaa',
        lineHeight: 16,
    },
    lockedText: {
        color: '#666666',
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockText: {
        color: '#ff6b35',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    footerText: {
        fontSize: 16,
        color: '#ff6b35',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#cccccc',
        fontStyle: 'italic',
    },
});

export default SmutScreen;