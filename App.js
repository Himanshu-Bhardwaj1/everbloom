import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import GlobalErrorCard from './components/GlobalErrorCard'
import AppNavigator from './components/AppNavigator'
import SplashScreen from './screens/SplashScreen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <SafeAreaProvider>
      {/* <GlobalErrorCard /> */}
      <AppNavigator />
    </SafeAreaProvider>
  )
}

export default App