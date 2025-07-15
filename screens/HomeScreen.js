import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
    Settings as SettingsIcon,
    MessageCircle as MessageCircleIcon,
    Camera as CameraIcon,
    ScrollText as ScrollTextIcon,
    Calendar as CalendarIcon,
} from 'lucide-react-native'

const HomeScreen = () => {
    const navigation = useNavigation()
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
                <SettingsIcon size={20} color="#be185d" />
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
            </View>
            {/* What's New Section */}
            <Text style={styles.sectionTitle}>What's New?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.newsCard}>
                    <View style={styles.newsHeader}>
                        <MessageCircleIcon size={16} color="#ec4899" style={{ marginRight: 6 }} />
                        <Text style={styles.newsTitle}>New message</Text>
                    </View>
                    <Text style={styles.newsDesc}>from Emma!</Text>
                </View>
                <View style={styles.newsCard}>
                    <View style={styles.newsHeader}>
                        <CameraIcon size={16} color="#ec4899" style={{ marginRight: 6 }} />
                        <Text style={styles.newsTitle}>New memory</Text>
                    </View>
                    <Text style={styles.newsDesc}>added yesterday!</Text>
                </View>
                <View style={styles.newsCard}>
                    <View style={styles.newsHeader}>
                        <ScrollTextIcon size={16} color="#ec4899" style={{ marginRight: 6 }} />
                        <Text style={styles.newsTitle}>New chapter</Text>
                    </View>
                    <Text style={styles.newsDesc}>in our story!</Text>
                </View>
            </ScrollView>
            {/* Quick Access Buttons */}
            <View style={styles.quickAccessRow}>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => navigation.navigate('Chat')}
                >
                    <MessageCircleIcon size={24} color="#ec4899" style={{ marginBottom: 6 }} />
                    <Text style={styles.quickButtonText}>Open Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => navigation.navigate('Memories')}
                >
                    <CameraIcon size={24} color="#ec4899" style={{ marginBottom: 6 }} />
                    <Text style={styles.quickButtonText}>Add Memory</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => navigation.navigate('Timeline')}
                >
                    <ScrollTextIcon size={24} color="#ec4899" style={{ marginBottom: 6 }} />
                    <Text style={styles.quickButtonText}>Our Story</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff7ed',
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
        backgroundColor: '#fbcfe8',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f9a8d4',
        overflow: 'hidden',
    },
    avatarText: {
        color: '#be185d',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#be185d',
    },
    card: {
        backgroundColor: '#ffe4e6',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#fbbf24',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#be185d',
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
        color: '#9d174d',
    },
    countdownLabel: {
        fontSize: 12,
        color: '#db2777',
    },
    cardFooter: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
        color: '#db2777',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#be185d',
        marginBottom: 12,
    },
    horizontalScroll: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingBottom: 8,
    },
    newsCard: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginRight: 16,
        shadowColor: '#fbbf24',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#ffe4e6',
    },
    newsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#be185d',
    },
    newsDesc: {
        fontSize: 12,
        color: '#52525b',
    },
    quickAccessRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ffe4e6',
        shadowColor: '#fbbf24',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    quickButtonText: {
        fontSize: 14,
        color: '#be185d',
    },
})

export default HomeScreen