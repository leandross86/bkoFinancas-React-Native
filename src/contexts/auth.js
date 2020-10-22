import React, {
  useState,
  createContext,
  useEffect
} from 'react'
import { Alert } from 'react-native'
import firebase from '../services/firebaseConnetion'
import AsyncStorage from '@react-native-community/async-storage'

export const AuthContext = createContext({})

function AuthProvider ({ children }) { // eslint-disable-line
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAuth, setLoadingAuth] = useState(false)

  useEffect(() => {
    async function loadStorage () {
      const storageUser = await AsyncStorage.getItem('Auth_user')

      if (storageUser) {
        setUser(JSON.parse(storageUser))
        setLoading(false)
      }
      setLoading(false)
    }
    loadStorage()
  }, [])

  // Função para logar usuario
  async function signIn (email, password) {
    setLoadingAuth(true)
    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        const uid = value.user.uid
        await firebase.database().ref('users').child(uid).once('value')
          .then((snapshot) => {
            const data = {
              uid: uid,
              nome: snapshot.val().nome,
              email: value.user.email
            }
            setUser(data)
            storegeUser(data)
            setLoadingAuth(false)
          })
      })
      .catch((error) => {
        Alert(error.code)
        setLoadingAuth(false)
      })
  }

  // Cadastrar usuario
  async function signUp (email, password, nome) {
    setLoadingAuth(true)
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        const uid = value.user.uid
        await firebase.database().ref('users').child(uid).set({
          saldo: 0,
          nome: nome
        })
          .then(() => {
            const data = {
              uid: uid,
              nome: nome,
              email: value.user.email
            }
            setUser(data)
            storegeUser(data)
            setLoadingAuth(false)
          })
      })
      .catch((error) => {
        Alert(error.code)
        setLoadingAuth(false)
      })
  }

  async function storegeUser (data) {
    await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
  }

  async function signOut () {
    await firebase.auth().signOut()
    await AsyncStorage.clear()
      .then(() => {
        setUser(null)
      })
  }

  return (
    <AuthContext.Provider value={{
      signed:
        !!user,
      user,
      loading,
      signUp,
      signIn,
      signOut,
      loadingAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
