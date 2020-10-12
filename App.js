// import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import AuthProvider from './src/contexts/auth'

import Routes from './src/routes/index'

console.disableYellowBox = true

export default function App () {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#131313" barStyle="light-content"/>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  )
}
