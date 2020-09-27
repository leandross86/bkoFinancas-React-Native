import React, { 
  useState, 
  createContext,
  useEffect
} from 'react'
import { Alert } from 'react-native'
import firebase from '../services/firebaseConnetion'
import AsyncStorage from '@react-native-community/async-storage'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorage(){
      const storageUser = await AsyncStorage.getItem('Auth_user')

      if (storageUser){
        setUser(JSON.parse(storageUser))
        setLoading(false)
      }
      setLoading(false)
    }
    loadStorage()
  }, [])

  //Função para logar usuario
  async function signIn(email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (value) => {
      let uid = value.user.uid
      await firebase.database().ref('users').child(uid).once('value')
      .then((snapshot) => {
        let data = {
          uid: uid,
          nome: snapshot.val().nome,
          email: value.user.email
        }
        setUser(data)
        storegeUser(data)
      })
    })
    .catch((error) => {
      Alert(error.code)
    })
  }

  // Cadastrar usuario
  async function signUp(email, password, nome){
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( async (value) => {
      let uid = value.user.uid
      await firebase.database().ref('users').child(uid).set({
        saldo: 0,
        nome: nome
      })
      .then(() => {
        let data = {
          uid: uid,
          nome: nome,
          email: value.user.email,
        }
        setUser(data)
        storegeUser(data)
      })
    })
    .catch((error) => {
      Alert(error.code)
    })
  }

  async function storegeUser(data){
    await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider