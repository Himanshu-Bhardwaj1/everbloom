import { useState } from 'react-native'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeft, Send } from 'lucide-react-native'

const ChatScreen = () => {
    const navigation = useNavigation()
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey love! How's your day going?",
            sender: 'partner',
            timestamp: '10:30 AM',
        },
        {
            id: 2,
            text: "It's going great! Just finished that project I was telling you about.",
            sender: 'me',
            timestamp: '10:32 AM',
        },
        {
            id: 3,
            text: "That's amazing! I'm so proud of you ❤️",
            sender: 'partner',
            timestamp: '10:33 AM',
        },
        {
            id: 4,
            text: "Thanks! Can't wait to tell you all about it tonight.",
            sender: 'me',
            timestamp: '10:35 AM',
        },
        {
            id: 5,
            text: "I'm looking forward to our dinner date! I miss you so much.",
            sender: 'partner',
            timestamp: '10:36 AM',
        },
    ])

    const sendMessage = () => {
        if (messageText.trim() === '') return
        const newMessage = {
            id: messages.length + 1,
            text: messageText,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }
        setMessages([...messages, newMessage])
        setMessageText('')
        setTimeout(() => {
            const responseMessage = {
                id: messages.length + 2,
                text: "That's wonderful! I can't wait to hear more about it ❤️",
                sender: 'partner',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }
            setMessages((prev) => [...prev, responseMessage])
        }, 1500)
    }

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === 'me' ? styles.messageRight : styles.messageLeft,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    item.sender === 'me' ? styles.bubbleMe : styles.bubblePartner,
                ]}
            >
                <Text style={item.sender === 'me' ? styles.textMe : styles.textPartner}>
                    {item.text}
                </Text>
            </View>
            <Text
                style={[
                    styles.timestamp,
                    item.sender === 'me' ? styles.timestampRight : styles.timestampLeft,
                ]}
            >
                {item.timestamp}
            </Text>
        </View>
    )

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#be185d" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Love Chat</Text>
                </View>
                {/* Messages */}
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.messagesList}
                    inverted
                />
                {/* Input Area */}
                <View style={styles.inputArea}>
                    <TextInput
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder="Type your message..."
                        style={styles.input}
                        placeholderTextColor="#be185d99"
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Send size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fdf2f8' },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    backButton: { marginRight: 16 },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'serif',
        color: '#be185d',
        fontWeight: 'bold',
    },
    messagesList: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        maxWidth: '80%',
        marginBottom: 12,
    },
    messageLeft: { alignSelf: 'flex-start' },
    messageRight: { alignSelf: 'flex-end' },
    bubble: {
        padding: 12,
        borderRadius: 20,
    },
    bubbleMe: {
        backgroundColor: '#f472b6',
        borderTopRightRadius: 0,
    },
    bubblePartner: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#fbcfe8',
    },
    textMe: { color: '#fff', fontSize: 16 },
    textPartner: { color: '#374151', fontSize: 16 },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
        color: '#6b7280',
    },
    timestampLeft: { textAlign: 'left' },
    timestampRight: { textAlign: 'right' },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#fbcfe8',
        padding: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#fbcfe8',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        color: '#be185d',
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#ec4899',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
})

export default ChatScreen