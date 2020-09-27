import React, { useContext } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { AuthContext } from '../contexts/auth'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'

function Routes() {
  const { signed, loading } = useContext(AuthContext)

  if(loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff8800"/>
      </View>
    )
  }

  return (
    signed ? <AppRoutes /> : <AuthRoutes />
  )
}

export default Routes