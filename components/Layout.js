import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>{children}</View>
            <Navigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F7', // fallback for pink-50
    },
    content: {
        flex: 1,
        paddingBottom: 64, // similar to pb-16
    },
});

export default Layout;