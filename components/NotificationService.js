import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const initializeNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
    }

    if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
        });
    }
};

export const scheduleDailyReminder = async ({
    hour = 22,
    minute = 0,
    title = 'EverBloom',
    body = 'You have a reason to be loved 💖',
}) => {
    await Notifications.cancelAllScheduledNotificationsAsync()

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
        },
        trigger: {
            hour,
            minute,
            repeats: true,
            channelId: 'daily-reminder',
        },
    });
};

export const sendInstantNotification = async ({
    title = 'Hey!',
    body = 'This is an instant notification',
}) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
        },
        trigger: null,
    });
};