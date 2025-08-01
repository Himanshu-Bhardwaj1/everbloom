import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../util/Config';

const iconOptions = [
    { name: 'heart', label: 'Heart', lib: FontAwesome5 },
    { name: 'coffee', label: 'Coffee', lib: FontAwesome5 },
    { name: 'gift', label: 'Gift', lib: FontAwesome5 },
    { name: 'home-outline', label: 'Home', lib: Ionicons },
];


const API_URL = BASE_URL + "/milestone";
const AddStoryBottomSheet = (props) => {
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [picker, showPicker] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);

    const handleSave = () => {
        saveStory({ title, description, date });
    };

    const saveStory = async ({ title, description, date }) => {
        try {
            const story = {
                title,
                description,
                date: date.toISOString().split('T')[0],
                icon:
            };
            console.log('Story to save:', story);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(story),
            });
            const data = await response.json();
            console.log('Story saved:', data);
            props.onClose();
        } catch (error) {
            console.error('Error saving story:', error);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        showPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handlePicker = () => {
        console.log('Picker pressed' + picker);
        showPicker(true);
    }

    return (
        <Modal visible={props.visible} onClose={props.onClose} animationType="slide">
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={props.onClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.heading}>Add a Story</Text>

                <TextInput
                    placeholder="Title"
                    placeholderTextColor="#a78b9f"
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    placeholder="Description"
                    placeholderTextColor="#a78b9f"
                    style={[styles.input, styles.multilineInput]}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />
                <View style={styles.dateRow}>
                    <TouchableOpacity
                        style={[styles.input, { flex: 1, justifyContent: 'center' }]}
                        onPress={handlePicker}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: '#000' }}>
                            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                        </Text>
                    </TouchableOpacity>
                    <Ionicons
                        name="calendar-outline"
                        size={24}
                        color="#d63aed"
                        style={{ marginLeft: 8 }}
                        onPress={handlePicker}
                    />
                </View>

                {picker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

                <Text style={styles.sectionTitle}>Select Icon</Text>
                <View style={styles.iconTray}>
                    {iconOptions.map(({ name, label, lib: IconLib }) => {
                        const isSelected = selectedIcon === name;
                        return (
                            <TouchableOpacity
                                key={name}
                                style={[
                                    styles.iconButton,
                                    isSelected && styles.iconButtonSelected
                                ]}
                                onPress={() => setSelectedIcon(name)}
                            >
                                <IconLib
                                    name={name}
                                    size={18}
                                    color={isSelected ? '#fff' : '#1f2937'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={{ color: isSelected ? '#fff' : '#1f2937' }}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Save Story</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    dragHandle: {
        alignSelf: 'center',
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#e5e5e5',
        marginBottom: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f6f2f5',
        padding: 12,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 12,
        color: '#000',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#ec4899',
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },

    iconTray: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
        justifyContent: 'flex-start',
    },

    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 8,
    },

    iconButtonSelected: {
        backgroundColor: '#7c3aed',
    },
    closeText: {
        fontSize: 24,
        color: '#000',
    },

});

export default AddStoryBottomSheet;
