import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

class ErrorManager {
    constructor() {
        this.listeners = [];
        this.currentError = null;
    }

    showError(error) {
        this.currentError = {
            id: Date.now(),
            message: error.message || 'An unexpected error occurred',
            type: error.type || 'error',
            duration: error.duration || 5000,
            action: error.action || null,
            timestamp: new Date(),
        };
        this.notifyListeners();
    }

    hideError() {
        this.currentError = null;
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentError));
    }
}

// Global instance
export const errorManager = new ErrorManager();

// Error Card Component
const GlobalErrorCard = () => {
    const [error, setError] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
        const unsubscribe = errorManager.subscribe((newError) => {
            if (newError) {
                setError(newError);
                showError();
                // Auto hide after duration
                setTimeout(() => {
                    hideError();
                }, newError.duration);
            } else {
                hideError();
            }
        });

        return unsubscribe;
    }, []);

    const showError = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideError = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setError(null);
            errorManager.hideError();
        });
    };

    const getErrorStyle = (type) => {
        switch (type) {
            case 'success':
                return styles.successCard;
            case 'warning':
                return styles.warningCard;
            case 'info':
                return styles.infoCard;
            default:
                return styles.errorCard;
        }
    };

    const getErrorIcon = (type) => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'error';
        }
    };

    const getErrorColor = (type) => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'warning':
                return '#F59E0B';
            case 'info':
                return '#3B82F6';
            default:
                return '#EF4444';
        }
    };

    if (!error) return null;

    return (
        <Modal
            visible={!!error}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.errorContainer,
                        getErrorStyle(error.type),
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.errorContent}>
                        <Icon
                            name={getErrorIcon(error.type)}
                            size={24}
                            color={getErrorColor(error.type)}
                            style={styles.errorIcon}
                        />
                        <View style={styles.errorTextContainer}>
                            <Text style={styles.errorMessage}>{error.message}</Text>
                            {error.action && (
                                <TouchableOpacity
                                    style={[styles.actionButton, { borderColor: getErrorColor(error.type) }]}
                                    onPress={() => {
                                        error.action.onPress();
                                        hideError();
                                    }}
                                >
                                    <Text style={[styles.actionText, { color: getErrorColor(error.type) }]}>
                                        {error.action.text}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={hideError}
                        >
                            <Icon name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

// Toast-style Error Card (Alternative)
const ToastErrorCard = () => {
    const [error, setError] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
        const unsubscribe = errorManager.subscribe((newError) => {
            if (newError) {
                setError(newError);
                showToast();
                setTimeout(() => {
                    hideToast();
                }, newError.duration);
            } else {
                hideToast();
            }
        });

        return unsubscribe;
    }, []);

    const showToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setError(null);
        });
    };

    if (!error) return null;

    return (
        <View style={styles.toastContainer} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.toast,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: error.type === 'success' ? '#10B981' :
                            error.type === 'warning' ? '#F59E0B' :
                                error.type === 'info' ? '#3B82F6' : '#EF4444',
                    },
                ]}
            >
                <Icon
                    name={error.type === 'success' ? 'check-circle' :
                        error.type === 'warning' ? 'warning' :
                            error.type === 'info' ? 'info' : 'error'}
                    size={20}
                    color="#fff"
                    style={styles.toastIcon}
                />
                <Text style={styles.toastText}>{error.message}</Text>
                <TouchableOpacity onPress={hideToast}>
                    <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

// Helper functions for easy usage
export const showError = (message, options = {}) => {
    errorManager.showError({
        message,
        type: 'error',
        ...options,
    });
};

export const showSuccess = (message, options = {}) => {
    errorManager.showError({
        message,
        type: 'success',
        ...options,
    });
};

export const showWarning = (message, options = {}) => {
    errorManager.showError({
        message,
        type: 'warning',
        ...options,
    });
};

export const showInfo = (message, options = {}) => {
    errorManager.showError({
        message,
        type: 'info',
        ...options,
    });
};

const styles = StyleSheet.create({
    // Modal Error Card Styles
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || 50,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    errorContainer: {
        width: screenWidth - 32,
        borderRadius: 12,
        marginHorizontal: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
    },
    successCard: {
        backgroundColor: '#F0FDF4',
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    warningCard: {
        backgroundColor: '#FFFBEB',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    infoCard: {
        backgroundColor: '#EFF6FF',
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
    },
    errorIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    errorTextContainer: {
        flex: 1,
    },
    errorMessage: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 8,
    },
    actionButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },

    // Toast Error Card Styles
    toastContainer: {
        position: 'absolute',
        top: StatusBar.currentHeight || 50,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: 16,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    toastIcon: {
        marginRight: 12,
    },
    toastText: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
});

export default GlobalErrorCard;