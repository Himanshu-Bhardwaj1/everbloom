import React, { useEffect, useRef } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native'
import LottieView from 'lottie-react-native'

const ConfettiScreen = ({ shouldPlay, onAnimationFinish }) => {
    const confettiRef = useRef(null)

    useEffect(() => {
        if (shouldPlay) {
            confettiRef.current?.reset()
            confettiRef.current?.play()
        }
    }, [shouldPlay])

    const handleAnimationFinish = () => {
        if (onAnimationFinish) {
            onAnimationFinish()
        }
    }

    return (
        <View style={styles.confettiContainer}>
            <LottieView
                ref={confettiRef}
                source={require('../assets/confetti.json')}
                loop={false}
                autoPlay={true}
                style={styles.lottie}
                resizeMode="cover"
                onAnimationFinish={handleAnimationFinish}
            />
        </View>
    )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'black',
    },
    lottie: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: Platform.OS === 'android' ? height + StatusBar.currentHeight : height,
        zIndex: 1,
    },
    button: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: '#facc15',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        zIndex: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
})

export default ConfettiScreen
