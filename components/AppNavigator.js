import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

// Import your screens
import MemoriesScreenNew from '../screens/MemoriesScreenNew'
import StoryScreen from '../screens/StoryScreen'
import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import Layout from './Layout'
import ReasonsScreen from '../screens/ReasonScreen'
import ReasonCard from './ReasonCard'
import ReasonScreen from '../screens/ReasonScreen'
import TimerScreen from '../screens/TimerScreen'

const Stack = createNativeStackNavigator()

// Screen wrapper components
const MemoriesScreenWrapper = () => (
    <Layout>
        <MemoriesScreenNew />
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


const ReasonScreenWrapper = () => (
    <Layout>
        <ReasonScreen />
    </Layout>
)

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="Reason"
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
                    name="Reason"
                    component={ReasonScreenWrapper}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator