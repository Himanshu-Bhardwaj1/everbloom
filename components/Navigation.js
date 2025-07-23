import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, MessageCircle, Image, ScrollText } from 'lucide-react-native';

const navItems = [
    {
        route: 'Home',
        icon: Home,
        label: 'Home',
    },
    {
        route: 'Chat',
        icon: MessageCircle,
        label: 'Chat',
    },
    {
        route: 'Memories',
        icon: Image,
        label: 'Memories',
    },
    {
        route: 'Timeline',
        icon: ScrollText,
        label: 'Story',
    },
    {
        route: 'Reason',
        icon: ScrollText,
        label: 'Reason',
    },
];

const Navigation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
            <View style={styles.navRow}>
                {navItems.map((item) => {
                    const isActive = route.name === item.route;
                    const Icon = item.icon;
                    return (
                        <TouchableOpacity
                            key={item.route}
                            onPress={() => navigation.navigate(item.route)}
                            style={styles.button}
                        >
                            <Icon
                                size={24}
                                color={isActive ? '#ec4899' : '#6b7280'}
                                fill={isActive ? '#fce7f3' : 'none'}
                            />
                            <Text style={[styles.label, isActive && styles.activeLabel]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 1,
        borderColor: '#fce7f3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 12,
    },
    button: {
        alignItems: 'center',
        padding: 4,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: '#6b7280',
    },
    activeLabel: {
        color: '#ec4899',
    },
});

export default Navigation;