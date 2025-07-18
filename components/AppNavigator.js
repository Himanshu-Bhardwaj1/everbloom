import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

// Import your screens
import MemoriesScreen from '../screens/MemoriesScreen'
import StoryScreen from '../screens/StoryScreen'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import Layout from './Layout'

const Stack = createNativeStackNavigator()

// Screen wrapper components
const MemoriesScreenWrapper = () => (
    <Layout>
        <MemoriesScreen />
    </Layout>
)

const TimelineScreenWrapper = () => (
    <Layout>
        <StoryScreen />
    </Layout>
)

const HomeScreenWrapper = () => (
    <Layout>
        <HomeScreen />
    </Layout>
)

const ChatScreenWrapper = () => (
    <Layout>
        <ChatScreen />
    </Layout>
)

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="Home"
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreenWrapper}
                />
                <Stack.Screen
                    name="Memories"
                    component={MemoriesScreenWrapper}
                />
                <Stack.Screen
                    name="Timeline"
                    component={TimelineScreenWrapper}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreenWrapper}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator