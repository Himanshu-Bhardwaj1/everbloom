import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

const ChatScreen = () => {
    const socketRef = useRef(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/ws/chat');
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to chat WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("From:", data.from);
            console.log("Message:", data.message);
            const message = {
                text: data.text,
                timestamp: Date.now(),
                fromSelf: false,
            };
            setMessages((prev) => [...prev, message]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        const message = {
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fromSelf: true,
        };

        socketRef.current.send(JSON.stringify(message));
        setMessages((prev) => [...prev, message]);
        setInput('');
    };

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.fromSelf ? styles.rightAlign : styles.leftAlign,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    item.fromSelf ? styles.selfBubble : styles.partnerBubble,
                ]}
            >
                <Text style={item.fromSelf ? styles.selfText : styles.partnerText}>
                    {item.text}
                </Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.messages}
            />

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                    placeholderTextColor="#c4a2b5"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>➤</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffeef5',
    },
    messages: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    leftAlign: {
        alignSelf: 'flex-start',
    },
    rightAlign: {
        alignSelf: 'flex-end',
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
    },
    partnerBubble: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 0,
    },
    selfBubble: {
        backgroundColor: '#f264b3',
        borderTopRightRadius: 0,
    },
    partnerText: {
        color: '#1f2937',
        fontSize: 15,
    },
    selfText: {
        color: '#fff',
        fontSize: 15,
    },
    timestamp: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    inputRow: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff0f7',
        borderTopWidth: 1,
        borderColor: '#f0cce2',
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 24,
        backgroundColor: '#fce6f1',
        color: '#000',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#f264b3',
        borderRadius: 24,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default ChatScreen;
