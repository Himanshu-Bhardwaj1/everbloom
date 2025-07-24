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
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../util/Config';
import { Dimensions } from 'react-native';
import ConfettiScreen from '../components/ConfettiButton';
import { Ionicons } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;  // 80% of screen width
const CARD_HEIGHT = height * 0.6;


const numberImages = {
    1: require('../assets/number/1.png'),
    2: require('../assets/number/2.png'),
    3: require('../assets/number/3.png'),
    4: require('../assets/number/4.png'),
    5: require('../assets/number/5.png'),
    6: require('../assets/number/6.png'),
    7: require('../assets/number/7.png'),
    8: require('../assets/number/8.png'),
    9: require('../assets/number/9.png'),
    10: require('../assets/number/10.png'),
};


export default function ReasonScreen() {
    const navigation = useNavigation()
    const [reasons, setReasons] = useState([]);
    const [todayReason, setTodayReason] = useState(null);
    const [showRevealModal, setShowRevealModal] = useState(false);
    const [flipAnim] = useState(new Animated.Value(0));
    const [revealQueue, setRevealQueue] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const fetchReasons = async () => {
        try {
            const response = await fetch(BASE_URL + '/reason');
            const data = await response.json();
            const reasonsList = data.data.reasons;

            setReasons(reasonsList);
            console.log(reasonsList);

            // Trigger modal if any reason should be revealed today
            const revealableReasons = reasonsList.filter(
                r => !r.opened && r.revealOn <= Date.now()
            );

            if (revealableReasons.length > 0) {
                setRevealQueue(revealableReasons);
                setTodayReason(revealableReasons[0]);
                setShowRevealModal(true);
            }

        } catch (error) {
            console.error('Failed to fetch reasons:', error);
        }
    };


    useEffect(() => {
        fetchReasons();
    }, []);

    // const handleFlip = () => {
    //     Animated.timing(flipAnim, {
    //         toValue: 180,
    //         duration: 600,
    //         useNativeDriver: true,
    //     }).start(async () => {
    //         try {
    //             var url = BASE_URL + `/reason/opened/${todayReason.id}`
    //             await fetch(url, {
    //                 method: 'POST'
    //             });
    //         } catch (error) {
    //             console.error('Failed to mark reason as opened:', error);
    //         }

    //         const updatedReasons = reasons.map(r =>
    //             r.id === todayReason.id ? { ...r, opened: true } : r
    //         );
    //         setReasons(updatedReasons);

    //         const remainingQueue = revealQueue.slice(1);
    //         setTimeout(() => {
    //             if (remainingQueue.length > 0) {
    //                 setRevealQueue(remainingQueue);
    //                 setTodayReason(remainingQueue[0]);
    //                 flipAnim.setValue(0);
    //             } else {
    //                 setShowRevealModal(false);
    //             }
    //         }, 3000);
    //     });
    // };


    const handleFlip = () => {
        Animated.timing(flipAnim, {
            toValue: 180,
            duration: 600,
            useNativeDriver: true,
        }).start(async () => {
            // Trigger confetti when flip completes
            setIsFlipped(true)
            setShowConfetti(true)

            try {
                var url = BASE_URL + `/reason/opened/${todayReason.id}`
                await fetch(url, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Failed to mark reason as opened:', error);
            }

            const updatedReasons = reasons.map(r =>
                r.id === todayReason.id ? { ...r, opened: true } : r
            );
            setReasons(updatedReasons);

            const remainingQueue = revealQueue.slice(1);
            setTimeout(() => {
                if (remainingQueue.length > 0) {
                    setRevealQueue(remainingQueue);
                    setTodayReason(remainingQueue[0]);
                    flipAnim.setValue(0);
                    // Reset confetti state for next card
                    setIsFlipped(false);
                    setShowConfetti(false);
                } else {
                    setShowRevealModal(false);
                    // Reset confetti state when closing modal
                    setIsFlipped(false);
                    setShowConfetti(false);
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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#be185d" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reason</Text>
                <View style={{ width: 24 }} />
            </View>

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
                                    <Image source={numberImages[todayReason.no]} style={styles.largeImage} />
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
                                    {isFlipped && (
                                        <ConfettiScreen
                                            shouldPlay={showConfetti}
                                            onAnimationFinish={() => setShowConfetti(false)}
                                        />
                                    )}
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e', // Dark background
        padding: 16,
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
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1000,
        overflow: 'visible',
    },
    flipCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backfaceVisibility: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    flipCardBack: {
        position: 'absolute',
        top: 0,
    },
    largeImage: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
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

});
