import { useState, useEffect, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    Modal,
    StatusBar,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { showError } from '../components/GlobalErrorCard';
import AddMemoryModal from '../components/AddMemoryModal';
import { Platform } from 'react-native';

const CARD_MARGIN = 8;
const CARD_WIDTH = (Dimensions.get('window').width / 2) - (CARD_MARGIN * 3);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq9a9g7en/image/upload';
const CLOUDINARY_PRESET = 'my_app_preset';
const API_URL = 'http://localhost:8080/memories';

const MemoriesScreen = () => {
    const navigation = useNavigation();
    const [memories, setMemories] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMemoryModalVisible, setAddMemoryModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    const fetchMemories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) showError('Network response was not ok');
            const data = await response.json();
            const formatted = (data.data || []).map(memory => ({
                ...memory,
                revealed: false,
                id: memory.id ?? Math.floor(Math.random() * 1000000),
            }));
            setMemories(formatted);
        } catch (error) {
            showError('Error', 'Failed to fetch memories.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    const revealMemory = useCallback((id) => {
        setMemories(memories =>
            memories.map(memory =>
                memory.id === id ? { ...memory, revealed: true } : memory
            )
        );
    }, []);

    const openImageModal = useCallback((item) => {
        setSelectedImage(item);
        setIsModalVisible(true);
    }, []);

    const closeImageModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedImage(null);
    }, []);

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
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
                    <Icon name="circle" size={24} color="#fff" style={{ marginBottom: 8 }} />
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <Icon name="arrow-left" size={20} color="#be185d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Moments</Text>
                <View style={{ width: 24 }} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#be185d" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={memories}
                    keyExtractor={item => item.id?.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <TouchableOpacity style={styles.fab} onPress={() => setAddMemoryModalVisible(true)} activeOpacity={0.85}>
                <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
            <AddMemoryModal
                visible={isAddMemoryModalVisible}
                onClose={() => setAddMemoryModalVisible(false)}
                onMemoryAdded={(newMemory) => {
                    setMemories((prev) => [newMemory, ...prev]);
                }}
            />
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
                <TouchableWithoutFeedback onPress={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={closeImageModal}
                                >
                                    <Icon name="x" size={30} color="#fff" />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: selectedImage?.imageUrl }}
                                    style={styles.zoomedImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.modalCaptionContainer}>
                                    <Text style={styles.modalCaption}>
                                        {selectedImage?.caption}
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

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
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    headerIcon: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#be185d',
        fontWeight: 'bold',
    },
    grid: {
        padding: 12,
        paddingBottom: 100,
    },
    card: {
        width: CARD_WIDTH,
        aspectRatio: 1,
        margin: CARD_MARGIN,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    blurred: {},
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayText: {
        color: '#fff',
        fontSize: 14,
    },
    captionContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    caption: {
        color: '#fff',
        fontSize: 14,
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
        shadowRadius: 8,
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
    modalCaptionContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        borderRadius: 10,
        padding: 15,
    },
    modalCaption: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default MemoriesScreen;
