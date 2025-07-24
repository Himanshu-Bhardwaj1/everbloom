// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
// import LottieView from 'lottie-react-native';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width / 2 - 30;

// const reasons = [
//     'You always support me.',
//     'Your smile makes my day.',
//     'You listen to me patiently.',
//     'You love my weirdness.',
//     'You’re strong and kind.',
//     'You remember the little things.',
//     'We laugh together endlessly.',
//     'You make me feel special.',
//     'You’re beautiful inside and out.',
//     'You make my life better.'
// ];

// const ReasonCard = ({ id, reason, revealed, onReveal }) => {
//     return (
//         <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.8}
//             onPress={() => onReveal(id)}
//         >
//             <View style={[styles.cardInner, revealed ? styles.cardRevealed : styles.cardHidden]}>
//                 {revealed ? (
//                     <Text style={styles.reasonText}>{reason}</Text>
//                 ) : (
//                     <Text style={styles.tapText}>Tap to Reveal</Text>
//                 )}
//             </View>
//         </TouchableOpacity>
//     );
// };

// const ReasonScreen = () => {
//     const [revealedCards, setRevealedCards] = useState([]);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const navigation = useNavigation();

//     const revealCard = (id) => {
//         if (!revealedCards.includes(id)) {
//             setRevealedCards([...revealedCards, id]);
//             setShowConfetti(true);
//             setTimeout(() => setShowConfetti(false), 2000);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {showConfetti && (
//                 <LottieView
//                     source={require('../assets/confetti.json')}
//                     autoPlay
//                     loop={false}
//                     style={StyleSheet.absoluteFillObject}
//                 />
//             )}
//             <FlatList
//                 data={reasons}
//                 numColumns={2}
//                 contentContainerStyle={styles.cardList}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item, index }) => (
//                     <ReasonCard
//                         id={index}
//                         reason={item}
//                         revealed={revealedCards.includes(index)}
//                         onReveal={revealCard}
//                     />
//                 )}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fce4ec',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     cardList: {
//         paddingVertical: 20,
//         paddingHorizontal: 10,
//         alignItems: 'center'
//     },
//     card: {
//         width: CARD_WIDTH,
//         height: CARD_WIDTH,
//         margin: 10,
//         borderRadius: 12,
//         backgroundColor: '#fff0f5',
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3
//     },
//     cardInner: {
//         padding: 16,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     cardHidden: {
//         backgroundColor: '#ffb6c1'
//     },
//     cardRevealed: {
//         backgroundColor: '#ffffff'
//     },
//     tapText: {
//         fontSize: 16,
//         color: '#ad1457'
//     },
//     reasonText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#880e4f',
//         textAlign: 'center'
//     }
// });

// export default ReasonCard;
