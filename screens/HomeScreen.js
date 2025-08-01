import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import {
    Settings as SettingsIcon,
    MessageCircle as MessageCircleIcon,
    Camera as CameraIcon,
    ScrollText as ScrollTextIcon,
    Calendar as CalendarIcon,
    Heart,
} from 'lucide-react-native'
import ConfettiButton from '../components/ConfettiButton'
import MemoryModal from '../components/MemoryModal'
import { useConfig } from '../util/ConfigContext'

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);

    const openModal = (photo) => {
        console.log("Opening modal for:", photo);
        setSelectedMemory(photo.modal);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedMemory(null);
    };
    const navigation = useNavigation()
    const calculateDaysUntil = () => {
        const now = new Date();
        const target = new Date(now.getFullYear(), 7, 3); // August is month 7 (0-indexed)

        if (now > target) {
            return { days: 0, hours: 0, minutes: 0 };
        }

        const diffMs = target - now;

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    };


    const [countdown, setCountdown] = useState(calculateDaysUntil())

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(calculateDaysUntil())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const surpriseActivities = [
        { icon: "🎁", title: "Mystery Gift", desc: "Something special awaits", flag: "GIFT" },
        { icon: "🌹", title: "Love Notes", desc: "Sweet messages for you", flag: "LOVE_NOTES" },
        { icon: "📸", title: "Memory Lane", desc: "Our favorite moments", flag: "MEMORY_LANE" },
        { icon: "🍰", title: "Birthday Treats", desc: "Delicious surprises", flag: "TREATS" },
    ]

    const birthdayPlans = [
        { time: "Morning", activity: "Breakfast by bubba", icon: "☕" },
        { time: "Afternoon", activity: "Cafe Date & Shopping", icon: "🎈" },
        { time: "Evening", activity: "Adiyogi", icon: "🕯️" },
        { time: "Night", activity: "Dinner Night and Movie Night", icon: "✨" },
    ]

    const memoryPhotos = [
        {
            id: 1,
            emoji: "🍳",
            caption: "Cooking Date",
            url: "...",
            modal: {
                title: "Our Cooking Date 👨‍🍳💕",
                description: "Our little kitchen turned into a world of flavors and fun that day. We weren’t just making food — we were making memories. Your laughter, the playful mess, the warmth — everything about that moment was deliciously perfect. 👨‍🍳💕",
                emojis: ["🍳", "👫", "🥘"],
                url: "https://res.cloudinary.com/dq9a9g7en/image/upload/v1753724294/IMG_20250111_154426_ktwaij.jpg"
            },
            flag: "COOKING_DATE",
        },
        {
            id: 2,
            emoji: "👫",
            caption: "That day was important for both of us ",
            modal: {
                title: "Sandoz & Dinner Date🌙",
                description: "Anticipating more beautiful moments together.",
                emojis: ["🌙", "✨"],
                url: "https://res.cloudinary.com/dq9a9g7en/image/upload/v1753814402/WhatsApp_Image_2025-07-30_at_00.08.06_pofqf7.jpg"
            },
            flag: "SANDOZ"
        },
        {
            id: 3,
            emoji: "🚗",
            caption: "Car Ride and Trip",
            modal: {
                title: "First trip, mountains and Marriage🌙",
                description: "Anticipating more beautiful moments together.",
                emojis: ["🌙", "✨"],
                url: "https://res.cloudinary.com/dq9a9g7en/image/upload/v1753814402/WhatsApp_Image_2025-07-30_at_00.08.07_tkrft1.jpg"
            },
            flag: "TRIP"
        },
        {
            id: 4,
            emoji: "⚔️",
            caption: "Fight, 8:30 and lots of love",
            modal: {
                title: "Fight, 8:30 and lots of love 🌙",
                description: "Anticipating more beautiful moments together.",
                emojis: ["🌙", "✨"],
                url: "https://res.cloudinary.com/dq9a9g7en/image/upload/v1753814402/WhatsApp_Image_2025-07-30_at_00.08.06_2_df02mm.jpg"
            },
            flag: "FIGHT"
        },
        {
            id: 5,
            emoji: "👫",
            caption: "New job, new beginnings, Celebration and gorgeous you",
            modal: {
                title: "New job, new beginnings, Celebration and gorgeous you 🌙",
                description: "Anticipating more beautiful moments together.",
                emojis: ["🌙", "✨"],
                url: "https://res.cloudinary.com/dq9a9g7en/image/upload/v1753814402/WhatsApp_Image_2025-07-30_at_00.08.06_1_bxafp0.jpg"
            },
            flag: "BUHO"
        },
    ]

    const config = useConfig();
    if (!config) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading configuration...</Text>
            </View>
        );
    }

    const surprises = config["SURPRISES"]
    const birthdayFlags = config?.birthday_plans_flags;
    const memoryFlags = config?.memory_photos_flags


    const handleSurprisePress = (title) => {
        switch (title) {
            case "Mystery Gift":
                navigation.navigate("Shirt"); // Navigate to Real Madrid shirt reveal
                break;
            case "Love Notes":
                navigation.navigate("LoveNote"); // Navigate to love messages screen
                break;
            case "Memory Lane":
                navigation.navigate("Memories"); // Navigate to photo memories screen
                break;
            case "Birthday Treats":
                navigation.navigate("Treat"); // Navigate to treats/cake screen
                break;
            default:
                console.log(`${title} pressed`);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>H&P</Text>
                    </View>
                    <Text style={styles.headerTitle}>Our Haven</Text>
                    <Heart size={20} color="#be185d" />
                </View>

                {/* Birthday Countdown Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <CalendarIcon size={20} color="#db2777" style={{ marginRight: 8 }} />
                        <Text style={styles.cardTitle}>Her Special Day In...</Text>
                    </View>
                    <View style={styles.countdownRow}>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>{countdown.days}</Text>
                            <Text style={styles.countdownLabel}>Days</Text>
                        </View>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>{countdown.hours}</Text>
                            <Text style={styles.countdownLabel}>Hours</Text>
                        </View>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>{countdown.minutes}</Text>
                            <Text style={styles.countdownLabel}>Mins</Text>
                        </View>
                    </View>
                    <Text style={styles.cardFooter}>Get ready for the celebration!</Text>
                    <ConfettiButton />
                </View>
                {countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && (
                    <TouchableOpacity
                        style={styles.celebrateButton}
                        onPress={() => navigation.navigate('BirthdayCelebration')}
                    >
                        <Text style={styles.celebrateText}>🎉 Celebrate Now 🎉</Text>
                    </TouchableOpacity>
                )}


                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Birthday Surprises</Text>
                <View style={styles.quickAccessRow}>
                    {surpriseActivities.slice(0, 2).map((item, index) => {
                        console.log(`Surprise item: ${item.title}, Flag: ${item.flag}, Active: ${surprises[item.flag]}`);

                        const isDisabled = item.flag ? !surprises[item.flag] : true;
                        console.log(`Surprise item: ${item.title}, Disabled: ${isDisabled}`);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.quickButton, isDisabled && styles.disabledButton]}
                                onPress={() => handleSurprisePress(item.title)}
                                disabled={isDisabled}
                            >
                                <Text style={styles.quickButtonEmoji}>{item.icon}</Text>
                                <Text style={styles.quickButtonText}>{item.title}</Text>
                                <Text style={styles.quickButtonDesc}>{item.desc}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.quickAccessRow}>
                    {surpriseActivities.slice(2, 4).map((item, index) => {
                        const isDisabled = item.flag ? !surprises[item.flag] : true;

                        return (
                            <TouchableOpacity
                                key={index + 2}
                                style={[styles.quickButton, isDisabled && styles.disabledButton]}
                                onPress={() => handleSurprisePress(item.title)}
                                disabled={isDisabled}
                            >
                                <Text style={styles.quickButtonEmoji}>{item.icon}</Text>
                                <Text style={styles.quickButtonText}>{item.title}</Text>
                                <Text style={styles.quickButtonDesc}>{item.desc}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Birthday Timeline */}
                <Text style={styles.sectionTitle}>The Big Day Plan</Text>
                <View style={styles.timelineContainer}>
                    {birthdayPlans.map((plan, index) => {
                        const isActive = birthdayFlags[plan.time.toUpperCase()];
                        console.log(`Plan: ${plan.time}, Active: ${isActive}`);
                        return (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineDot}>
                                    <Text style={styles.timelineEmoji}>{plan.icon}</Text>
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTime}>{plan.time}</Text>
                                    <Text style={styles.timelineActivity}>
                                        {isActive ? plan.activity : "Coming soon baby..."}
                                    </Text>
                                </View>
                            </View>
                        );

                    })}
                </View>

                {/* Memory Photos Horizontal Scroll */}
                <Text style={styles.sectionTitle}>Our Beautiful Memories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {memoryPhotos.map((photo) => {
                        const isActive = memoryFlags[photo.flag];
                        console.log(`Memory Photo: ${photo.caption}, Active: ${isActive}`);
                        photo.caption = isActive ? photo.caption : "Coming soon baby...";
                        return (
                            <TouchableOpacity
                                key={photo.id}
                                style={[styles.memoryCard, !isActive && styles.inactivePhoto]}
                                activeOpacity={isActive ? 0.7 : 1}
                                onPress={() => {
                                    if (isActive) openModal(photo);
                                }}
                                disabled={!isActive}
                            >
                                <View style={styles.memoryPhotoPlaceholder}>
                                    <Text style={styles.memoryEmoji}>{photo.emoji}</Text>
                                </View>
                                <Text style={styles.memoryCaption}>{photo.caption}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {selectedMemory && (
                    <MemoryModal
                        visible={modalVisible}
                        onClose={closeModal}
                        modalTitle={selectedMemory.title}
                        modalDescription={selectedMemory.description}
                        modalEmojis={selectedMemory.emojis}
                        modalUrl={selectedMemory.url}
                    />
                )}

                {/* Love Message Card */}
                <View style={styles.loveMessageCard}>
                    <Text style={styles.loveMessageTitle}>💖 A Special Message</Text>
                    <Text style={styles.loveMessageText}>
                        Every day with you feels like a celebration, but your birthday is extra magical.
                        You bring so much joy, laughter, and love into my life.
                        I can't wait to make this day as wonderful as you are! 🎂✨
                    </Text>
                    <Text style={styles.loveMessageSignature}>With all my love 💕</Text>
                </View>

                {/* Bottom Padding for floating buttons */}
                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.lottieContainer}>
                {/* Gift Lottie Button */}
                <TouchableOpacity
                    style={styles.lottieButton}
                    onPress={() => {
                        console.log("Gift pressed");
                        navigation.navigate("Jar");
                    }}
                >
                    <LottieView
                        source={require('../assets/gift.json')}
                        autoPlay
                        loop
                        style={styles.giftLottie}
                    />
                </TouchableOpacity>

                {/* Lips Lottie Button */}
                {/* <TouchableOpacity
                    style={styles.lottieButton}
                    onPress={() => {
                        console.log("Lips pressed");
                        navigation.navigate("Smut");
                    }}
                >
                    <LottieView
                        source={require('../assets/lips.json')}
                        autoPlay
                        loop
                        style={styles.giftLottie}
                    />
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#facc15',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f59e0b',
        overflow: 'hidden',
    },
    avatarText: {
        color: '#0e0e0e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        color: '#facc15',
    },
    card: {
        backgroundColor: '#1c1917',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#facc15',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#facc15',
    },
    countdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    countdownItem: {
        alignItems: 'center',
    },
    countdownValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#facc15',
    },
    countdownLabel: {
        fontSize: 12,
        color: '#fcd34d',
    },
    cardFooter: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
        color: '#fcd34d',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ef4444',
        marginBottom: 12,
        marginTop: 8,
    },
    quickAccessRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#1c1917',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    quickButtonEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    quickButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#facc15',
        marginBottom: 4,
    },
    quickButtonDesc: {
        fontSize: 11,
        color: '#d4d4d8',
        textAlign: 'center',
    },
    timelineContainer: {
        marginBottom: 24,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    timelineDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1c1917',
        borderWidth: 2,
        borderColor: '#facc15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    timelineEmoji: {
        fontSize: 18,
    },
    timelineContent: {
        flex: 1,
    },
    timelineTime: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#facc15',
        marginBottom: 2,
    },
    timelineActivity: {
        fontSize: 16,
        color: '#d4d4d8',
    },
    horizontalScroll: {
        marginBottom: 24,
    },
    memoryCard: {
        width: 120,
        marginRight: 16,
        alignItems: 'center',
    },
    memoryPhotoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1c1917',
        borderWidth: 2,
        borderColor: '#facc15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    memoryEmoji: {
        fontSize: 32,
    },
    memoryCaption: {
        fontSize: 12,
        color: '#facc15',
        textAlign: 'center',
        fontWeight: '500',
    },
    loveMessageCard: {
        backgroundColor: '#1c1917',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#be185d',
    },
    loveMessageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#facc15',
        marginBottom: 12,
        textAlign: 'center',
    },
    loveMessageText: {
        fontSize: 14,
        color: '#d4d4d8',
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 12,
    },
    loveMessageSignature: {
        fontSize: 14,
        color: '#be185d',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    lottieContainer: {
        position: 'absolute',
        bottom: 72,
        right: 16,
        flexDirection: 'column',
        zIndex: 100,
        elevation: 10,
    },
    lottieButton: {
        marginBottom: 12,
    },
    giftLottie: {
        width: 60,
        height: 60,
    },
    inactivePhoto: {
        opacity: 0.5,
    },
    celebrateButton: {
        backgroundColor: '#be185d',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    celebrateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },


})

export default HomeScreen