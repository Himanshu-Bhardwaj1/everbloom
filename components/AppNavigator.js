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
import Jar from '../screens/Jar'
import SmutScreen from '../screens/SmutScreen'
import ShirtScreen from '../screens/ShirtScreen'
import JarScreen from '../screens/JarScreen'
import LoveNote from '../screens/LoveNote'
import TreatScreen from '../screens/TreatScreen'
import BirthdayCelebration from './BirthdayCelebration'

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

const JarScreenWrapper = () => (
    <Layout>
        <JarScreen />
    </Layout>
)
const SmutScreenWrapper = () => (
    <Layout>
        <SmutScreen />
    </Layout>
)

const ShirtScreenWrapper = () => (
    <Layout>
        <ShirtScreen />
    </Layout>
)

const LoveNoteScreenWrapper = () => (
    <Layout>
        <LoveNote />
    </Layout>
)

const TreatScreenWrapper = () => (
    <Layout>
        <TreatScreen />
    </Layout>
)

const BirthdayScreenWrapper = () => (
    <Layout>
        <BirthdayCelebration />
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
                    name="Reason"
                    component={ReasonScreenWrapper}
                />
                <Stack.Screen
                    name="Jar"
                    component={JarScreenWrapper}
                />
                <Stack.Screen
                    name="Smut"
                    component={SmutScreenWrapper}
                />
                <Stack.Screen
                    name="Shirt"
                    component={ShirtScreenWrapper}
                />
                <Stack.Screen
                    name="LoveNote"
                    component={LoveNoteScreenWrapper}
                />
                <Stack.Screen
                    name="Treat"
                    component={TreatScreenWrapper}
                />
                <Stack.Screen
                    name="BirthdayCelebration"
                    component={BirthdayScreenWrapper}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator