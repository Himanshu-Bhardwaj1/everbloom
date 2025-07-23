import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';

const initialReasons = [
    { id: '0', title: 'You’re the light of my life 💖', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '1', title: 'Reason 1', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '2', title: 'Reason 2', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '3', title: 'Reason 3', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '4', title: 'Reason 4', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '5', title: 'Reason 5', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
    { id: '6', title: 'Reason 6', image: { uri: 'https://res.cloudinary.com/dq9a9g7en/image/upload/v1752613266/dq2dcducif3pdhmyiffm.jpg' }, openedOn: "2025-07-19" },
];

export default function ReasonScreen() {
    const [reasons, setReasons] = useState(initialReasons);
    const [todayReason, setTodayReason] = useState(null);
    const [showRevealModal, setShowRevealModal] = useState(false);
    const [flipAnim] = useState(new Animated.Value(0));
    const [revealQueue, setRevealQueue] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);



    useEffect(() => {
        const unopenedReasons = reasons.filter(r => !r.openedOn);
        if (unopenedReasons.length > 0) {
            setRevealQueue(unopenedReasons);
            setTodayReason(unopenedReasons[0]);
            setShowRevealModal(true);
        }
    }, []);

    const handleFlip = () => {
        Animated.timing(flipAnim, {
            toValue: 180,
            duration: 600,
            useNativeDriver: true,
        }).start(() => {
            const today = new Date().toISOString().split('T')[0];

            const updatedReasons = reasons.map(r =>
                r.id === todayReason.id ? { ...r, openedOn: today } : r
            );
            setReasons(updatedReasons);

            const remainingQueue = revealQueue.slice(1);

            setTimeout(() => {
                if (remainingQueue.length > 0) {
                    setRevealQueue(remainingQueue);
                    setTodayReason(remainingQueue[0]);
                    flipAnim.setValue(0);
                } else {
                    setShowRevealModal(false);
                }
            }, 3000);
        });
    };


    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedReason(item)} style={styles.card} activeOpacity={0.8}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.label}>{item.title}</Text>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reasons I Love You</Text>

            <FlatList
                data={reasons}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ padding: 12 }}
            />

            {selectedReason && (
                <Modal
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedReason(null)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.modalCloseArea} onPress={() => setSelectedReason(null)} />
                        <TouchableOpacity onPress={() => setSelectedReason(null)} style={styles.closeButton}>
                            <Text style={styles.closeIconText}>✕</Text>
                        </TouchableOpacity>
                        <View style={styles.selectedReasonModalContent}>
                            <Image source={selectedReason.image} style={styles.selectedReasonImage} />
                            <Text style={styles.selectedReasonTitle}>{selectedReason.title}</Text>
                        </View>
                    </View>
                </Modal>
            )}



            {showRevealModal && todayReason && (
                <Modal transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity onPress={handleFlip}>
                            <View style={styles.flipContainer}>
                                <Animated.View
                                    style={[
                                        styles.flipCard,
                                        { transform: [{ rotateY: frontInterpolate }] },
                                        { zIndex: 2, position: 'absolute' }
                                    ]}
                                >
                                    <Image source={require('../assets/tap.png')} style={styles.largeImage} />
                                </Animated.View>

                                <Animated.View
                                    style={[
                                        styles.flipCard,
                                        styles.flipCardBack,
                                        { transform: [{ rotateY: backInterpolate }] },
                                    ]}
                                >
                                    <Image source={todayReason.image} style={styles.largeImage} />
                                    <Text style={styles.revealedText}>{todayReason.title}</Text>
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1c1b1e',
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        alignSelf: 'center',
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#2a2a2e',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        width: '48%',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 12,
    },
    label: {
        marginTop: 8,
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // 80% opacity black
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    flipContainer: {
        width: 300,
        height: 600,
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1000,
    },

    flipCard: {
        width: 300,
        height: 600,
        backfaceVisibility: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // IMPORTANT
    },

    flipCardBack: {
        position: 'absolute',
        top: 0,
    },
    largeImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1.6,
        resizeMode: 'contain',
        borderRadius: 20,
    },

    tapText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        zIndex: 10,
        backgroundColor: '#00000088',
        padding: 10,
        borderRadius: 12,
    },
    revealedText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 12,
        backgroundColor: '#00000088',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    selectedReasonModalContent: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
        position: 'relative',
    },
    selectedReasonImage: {
        width: 250,
        height: 250,
        borderRadius: 15,
    },
    selectedReasonTitle: {
        fontSize: 22,
        color: '#fff',
        marginVertical: 15,
        textAlign: 'center',
    },

    closeButton: {
        alignSelf: 'flex-end',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 25,
        marginTop: 10,
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalCloseArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    closeIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 6,
    },
    closeIconText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white'
    },

});
