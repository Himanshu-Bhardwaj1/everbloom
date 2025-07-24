import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
    Settings as SettingsIcon,
    MessageCircle as MessageCircleIcon,
    Camera as CameraIcon,
    ScrollText as ScrollTextIcon,
    Calendar as CalendarIcon,
    Heart,
} from 'lucide-react-native'
import ConfettiButton from '../components/ConfettiButton'

const HomeScreen = () => {
    const navigation = useNavigation()
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Calculates the time remaining until the next occurrence of August 3rd.
    
    /*******  d9e51269-3a65-43b4-a886-30ff3f74281e  *******/
    const calculateDaysUntil = () => {
        const today = new Date()
        const birthday = new Date(today.getFullYear(), 7, 3)
        if (today > birthday) {
            birthday.setFullYear(birthday.getFullYear() + 1)
        }
        const diffTime = Math.abs(birthday.getTime() - today.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const diffHours = Math.floor(
            (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
        return {
            days: diffDays,
            hours: diffHours,
            minutes: diffMinutes,
        }
    }

    const [countdown, setCountdown] = useState(calculateDaysUntil())

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(calculateDaysUntil())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>H&amp;P</Text>
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e', // Dark background
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
        backgroundColor: '#facc15', // Yellow background
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f59e0b',
        overflow: 'hidden',
    },
    avatarText: {
        color: '#0e0e0e', // Text on yellow
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        color: '#facc15', // Gold/yellow title
    },
    card: {
        backgroundColor: '#1c1917', // Dark card
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
        color: '#ef4444', // Festive red
        marginBottom: 12,
    },
    horizontalScroll: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingBottom: 8,
    },
    newsCard: {
        width: 140,
        backgroundColor: '#1c1917',
        borderRadius: 14,
        padding: 12,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    newsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#facc15',
    },
    newsDesc: {
        fontSize: 12,
        color: '#d4d4d8',
    },
    quickAccessRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
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
    quickButtonText: {
        fontSize: 14,
        color: '#facc15',
    },
})


export default HomeScreen