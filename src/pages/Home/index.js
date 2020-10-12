import React, { useContext, useState, useEffect } from 'react'
import { Alert, TouchableOpacity, Platform } from 'react-native'
import firebase from '../../services/firebaseConnetion'
import { format } from 'date-fns'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import HistoricoList from '../../components/HistoricoList'

import Icon from 'react-native-vector-icons/MaterialIcons'
import DatePicker from '../../components/DatePicker'

import {
  Background,
  Container,
  Nome,
  Saldo,
  Title,
  List,
  Area
} from './styles'

export default function Home () {
  const [historico, setHistorico] = useState([])
  const [saldo, setSaldo] = useState(0)
  const { user } = useContext(AuthContext)
  const uid = user && user.uid
  const [newDate, setNewDate] = useState(new Date())
  const [show, setShow] = useState(false)

  useEffect(() => {
    async function loadList () {
      await firebase.database().ref('users').child(uid).on('value', (snapshot) => {
        setSaldo(snapshot.val().saldo)
      })
      await firebase.database().ref('historico')
        .child(uid)
        .orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
        .limitToLast(10).on('value', (snapshot) => {
          setHistorico([])
          snapshot.forEach((childItem) => {
            const list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date
            }

            setHistorico(oldArray => [...oldArray, list].reverse())
          })
        })
    }
    loadList()
  }, [newDate])

  function handleDelete (data) {
    Alert.alert(
      'Cuidado Atençao!',
      `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleDeleteSuccess(data)
        }
      ]
    )
  }

  async function handleDeleteSuccess (data) {
    await firebase.database().ref('historico')
      .child(uid).child(data.key).remove()
      .then(async () => {
        let saldoAtual = saldo
        data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor)
        await firebase.database().ref('users').child(uid)
          .child('saldo').set(saldoAtual)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function handleShowPicker () {
    setShow(true)
  }

  function handleClose () {
    setShow(false)
  }

  const onChange = (date) => {
    setShow(Platform.OS === 'ios')
    setNewDate(date)
    console.log(date)
  }

  return (
    <Background>
      <Header/>
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#FFF" size={30} />
        </TouchableOpacity>
        <Title>Ultimas movimentações</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={ item => item.key}
        renderItem={ ({ item }) => (<HistoricoList data={item} deleteItem={handleDelete} />)}
      />

      {show && (
        <DatePicker
          onClose={handleClose}
          date={newDate}
          onChange={onChange}
        />
      )}

    </Background>
  )
}
