import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    StatusBar,
    ActivityIndicator,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AddMemoryModal from '../components/AddMemoryModal'
import AddStoryBottomSheet from '../components/AddStoryBottomSheet'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const CARD_MARGIN = 12
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3) / 2

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq9a9g7en/image/upload';
const CLOUDINARY_PRESET = 'my_app_preset';
const API_URL = 'http://localhost:8080/memories';

const MemoriesScreenNew = () => {
    const [memories, setMemories] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isAddMemoryModalVisible, setAddMemoryModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchMemories = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error('Network response was not ok')
            const data = await response.json()
            const formatted = (data.data || []).map(memory => ({
                ...memory,
                revealed: false,
                id: memory.id ?? Math.floor(Math.random() * 1000000),
            }))
            setMemories(formatted)
        } catch (error) {
            console.error('Error fetching memories:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMemories()
    }, [fetchMemories])

    const revealMemory = useCallback((id) => {
        setMemories(prev =>
            prev.map(mem => mem.id === id ? { ...mem, revealed: true } : mem)
        )
    }, [])

    const openImageModal = useCallback((item) => {
        setSelectedImage(item)
        setIsModalVisible(true)
    }, [])

    const closeImageModal = useCallback(() => {
        setIsModalVisible(false)
        setSelectedImage(null)
    }, [])

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
                if (!item.revealed) {
                    revealMemory(item.id);
                } else {
                    openImageModal(item);
                }
            }}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={[styles.image, !item.revealed && styles.blurred]}
                blurRadius={item.revealed ? 0 : 8}
            />

            {!item.revealed ? (
                <View style={styles.overlay}>
                    <Ionicons name="eye-outline" size={24} color="#fff" style={{ marginBottom: 6 }} />
                    <Text style={styles.overlayText}>Tap to Reveal</Text>
                </View>
            ) : (
                <View style={styles.captionContainer}>
                    <Text style={styles.caption}>{item.caption}</Text>
                </View>
            )}
        </TouchableOpacity>
    ), [revealMemory, openImageModal]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="#be185d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Moments</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#be185d" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={memories}
                    numColumns={2}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setAddMemoryModalVisible(true)}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Image Modal */}
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <TouchableWithoutFeedback onPress={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                                    <Ionicons name="close" size={30} color="#fff" />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: selectedImage?.imageUrl }}
                                    style={styles.zoomedImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.modalCaption}>{selectedImage?.caption}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setAddMemoryModalVisible(true)}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Add Memory Modal */}
            <AddMemoryModal
                visible={isAddMemoryModalVisible}
                onClose={() => setAddMemoryModalVisible(false)}
                onMemoryAdded={(newMemory) => {
                    setMemories((prev) => [newMemory, ...prev])
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf2f8',
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#be185d',
    },
    grid: {
        padding: 12,
        paddingBottom: 120,
    },
    card: {
        width: CARD_WIDTH,
        aspectRatio: 1,
        margin: CARD_MARGIN / 2,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    blurred: {
        opacity: 0.9,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    captionContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        width: '100%',
    },
    caption: {
        color: '#fff',
        fontSize: 13,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 36,
        backgroundColor: '#ec4899',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        padding: 10,
    },
    zoomedImage: {
        width: screenWidth - 40,
        height: screenHeight - 200,
        borderRadius: 10,
    },
    modalCaption: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    card: {
        width: '48%',
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#2a2a2e',
    },

    image: {
        width: '100%',
        height: 140,
        borderRadius: 16,
    },

    blurred: {
        opacity: 0.7,
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    overlayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    captionContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 6,
        borderRadius: 10,
    },

    caption: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

})

export default MemoriesScreenNew
