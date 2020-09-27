import React, { useState, createContext } from 'react'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [user, setUser] = useState({
    nome: 'Leandro',
    uid:''
  })
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider