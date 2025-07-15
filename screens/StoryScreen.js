import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeft, Plus, Heart, Coffee, Gift, Home, Plane } from 'lucide-react-native'
import React, { useEffect, useState, useRef } from 'react'
import Icon from 'react-native-vector-icons/Feather';
import AddStoryBottomSheet from '../components/AddStoryBottomSheet'


const StoryScreen = () => {
    const navigation = useNavigation()
    const [events, setEvents] = useState([])
    const [isStoryModalVisible, setIsStoryModalVisible] = useState(false)

    const handleCloseModal = () => {
        setIsStoryModalVisible(false)
    }
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:8080/milestone')
                console.log('Raw response:', response) // logs status, headers, etc.

                const data = await response.json()
                console.log('Parsed JSON data:', data.data.milestones)

                setEvents(data.data.milestones)
            } catch (error) {
                console.error('Failed to fetch events:', error)
            }
        }

        fetchEvents()
    }, [])

    useEffect(() => {
        console.log('Events updated:', events)
    }, [events])

    const iconMap = {
        Heart: Heart,
        Coffee: Coffee,
        Gift: Gift,
        Home: Home,
        Plane: Plane,
    }

    const handleAddStory = () => {
        setIsStoryModalVisible(true)
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <ArrowLeft size={24} color="#be185d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Our Story</Text>
                <Plus size={24} color="#be185d" />
            </View>
            {/* Timeline */}
            <ScrollView contentContainerStyle={styles.timelineContainer}>
                <View style={styles.timelineLine} />
                {Array.isArray(events) && events.map((event) => {
                    const Icon = iconMap[event.icon] || Heart
                    return (
                        <View key={event.id} style={styles.eventContainer}>
                            <View style={styles.timelineDot}>
                                <Icon size={18} color="#ec4899" />
                            </View>
                            <View style={styles.eventCard}>
                                <Text style={styles.eventDate}>{event.date}</Text>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventDesc}>{event.description}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={() => setIsStoryModalVisible(true)} activeOpacity={0.85}>
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
            <AddStoryBottomSheet
                onClose={() => setIsStoryModalVisible(false)}
                visible={isStoryModalVisible}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdf2f8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    headerIcon: { marginRight: 8 },
    headerTitle: {
        fontSize: 22,
        color: '#be185d',
        fontFamily: 'serif',
        fontWeight: 'bold',
    },
    timelineContainer: {
        padding: 16,
        paddingLeft: 32,
        paddingBottom: 100,
    },
    timelineLine: {
        position: 'absolute',
        left: 8,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#fbcfe8',
    },
    eventContainer: {
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
    },
    timelineDot: {
        position: 'absolute',
        left: -32,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fce7f3',
        borderWidth: 2,
        borderColor: '#f9a8d4',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fdf2f8',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
        flex: 1,
    },
    eventDate: {
        color: '#ec4899',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
    },
    eventTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#be185d',
        marginBottom: 6,
    },
    eventDesc: {
        fontSize: 14,
        color: '#52525b',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 40,
        backgroundColor: '#ec4899',
        borderRadius: 28,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default StoryScreen