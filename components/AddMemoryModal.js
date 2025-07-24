import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { showError, showInfo } from './GlobalErrorCard';
import { Platform } from 'react-native';
import { BASE_URL } from '../util/Config';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq9a9g7en/image/upload';
const CLOUDINARY_PRESET = 'my_app_preset';
const API_URL = BASE_URL + '/memories';

const AddMemoryModal = (props) => {
    const [imageUri, setImageUri] = useState(null);
    const [caption, setCaption] = useState('');
    const [memories, setMemories] = useState([]);


    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showInfo('Permission required', 'Please allow access to your photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };
    const saveImageUrl = useCallback(async (url, caption) => {
        console.log(caption);
        if (!url) return;
        const newMemoryRequest = {
            imageUrl: url,
            caption: caption || '',
        };
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMemoryRequest),
            });
            if (!response.ok) throw new Error('Failed to post memory');
            props.onMemoryAdded?.({
                ...newMemoryRequest,
                id: Math.floor(Math.random() * 1000000),
                revealed: false,
            })
        } catch (error) {
            console.log(error);
            showError('Error', 'Failed to save memory.');
        }
    }, []);

    const uploadToCloudinary = useCallback(async (uri) => {
        try {
            console.log("Here I Am ", uri);

            const formData = new FormData();
            if (Platform.OS === 'web') {
                formData.append('file', uri);
            } else {
                formData.append('file', {
                    uri,
                    type: 'image/jpeg',
                    name: 'upload.jpg',
                });
            }
            formData.append('upload_preset', CLOUDINARY_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok && result.secure_url) {
                console.log('Upload Success: ', result.secure_url);
                return result.secure_url;
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.log(error);
            showError("Error: ", error.message);
        }
    }, []);

    const handleUpload = () => {
        if (!imageUri) {
            showInfo('Error', 'No image selected.');
            return;
        }

        // uploadToCloudinary(imageUri)
        //     .then((url) => {
        //         if (url) {
        //             saveImageUrl(url, caption);
        //             showInfo('Success', 'Memory added successfully!');
        //         } else {
        //             showInfo('Error', 'Failed to upload image.');
        //         }
        //         setVisible(false);
        //     }).catch((error) => {
        //         showError("Error: ", error.message)
        //     })
        console.log("Captions : ", caption);
        props.onClose()
    }

    return (
        <Modal visible={props.visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={props.onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Add to Memories</Text>
                    <Text style={styles.subtitle}>Select Media</Text>

                    <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
                        <Text style={styles.galleryText}>Open Gallery/Select Image</Text>
                    </TouchableOpacity>

                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    )}

                    <TextInput
                        style={styles.captionInput}
                        placeholder="Add a caption..."
                        placeholderTextColor="#a78bfa"
                        multiline
                        value={caption}
                        onChangeText={setCaption}
                    />

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={props.onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                            <Text style={styles.uploadText}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    closeButton: {
        alignSelf: 'flex-start',
    },
    closeText: {
        fontSize: 24,
        color: '#000',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 10,
    },
    galleryButton: {
        backgroundColor: '#f3f4f6',
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 16,
    },
    galleryText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    previewImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
    },
    captionInput: {
        backgroundColor: '#f6f1f4',
        borderRadius: 14,
        padding: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#444',
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 14,
        marginRight: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    uploadButton: {
        flex: 1,
        backgroundColor: '#ec4899',
        padding: 14,
        marginLeft: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    cancelText: {
        color: '#000',
        fontWeight: '600',
    },
    uploadText: {
        color: '#fff',
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#ec4899',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.97)', // or a shade of white
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});

export default AddMemoryModal;
