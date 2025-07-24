import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfettiScreen from '../components/ConfettiButton';

// Set your target date and time here
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 10); // 10 days from now
targetDate.setHours(targetDate.getHours() + 2); // plus 2 hours

const TimerScreen = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                clearInterval(timer);
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                setTimeLeft({ days, hours, minutes });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Her Special Day In</Text>
            <View style={styles.countdownBox}>
                <View style={styles.row}>
                    <Text style={styles.number}>{timeLeft.days}</Text>
                    <Text style={styles.number}>{timeLeft.hours}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Days</Text>
                    <Text style={styles.label}>Hours</Text>
                </View>
                <Text style={styles.minutes}>
                    {timeLeft.minutes}
                    <Text style={styles.labelSmall}> Mins</Text>
                </Text>
                <Text style={styles.footer}>Get ready for the celebrations</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18140f',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        fontSize: 32,
        color: '#e6c15a',
        fontFamily: 'serif',
        marginBottom: 30,
        letterSpacing: 1,
    },
    countdownBox: {
        backgroundColor: '#1d1b14',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#e6c15a',
        padding: 34,
        alignItems: 'center',
        shadowColor: '#e6c15a55',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 180,
        marginBottom: 5,
    },
    number: {
        fontSize: 64,
        color: '#e6c15a',
        fontFamily: 'serif',
        marginHorizontal: 20,
    },
    label: {
        fontSize: 24,
        color: '#e6c15a',
        fontFamily: 'serif',
        marginHorizontal: 26,
    },
    minutes: {
        fontSize: 56,
        color: '#e6c15a',
        fontFamily: 'serif',
        marginTop: 10,
    },
    labelSmall: {
        fontSize: 28,
        color: '#e6c15a',
        fontFamily: 'serif',
    },
    footer: {
        marginTop: 18,
        fontSize: 20,
        color: '#e6c15a',
        fontFamily: 'serif',
        textAlign: 'center',
        textShadowColor: '#222',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
});

export default TimerScreen;
