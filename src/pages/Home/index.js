import React, { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'
import firebase from '../../services/firebaseConnetion'
import { format } from 'date-fns'
import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import HistoricoList from '../../components/HistoricoList'

import {
  Background,
  Container,
  Nome,
  Saldo,
  Title,
  List
} from './styles'


export default function Home() {
  const [ historico, setHistorico ] = useState([])
  const [saldo, setSaldo] = useState(0)
  
  const { user } = useContext(AuthContext)
  const uid = user && user.uid

  useEffect(() => {
    async function loadList() {
      await firebase.database().ref('users').child(uid).on('value', (snapshot) =>{
        setSaldo(snapshot.val().saldo)
      })
      await firebase.database().ref('historico')
        .child(uid)
        .orderByChild('date').equalTo(format(new Date, 'dd/MM/yy'))
        .limitToLast(10).on('value', (snapshot) => {
          setHistorico([])
          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
            }

            setHistorico(oldArray => [...oldArray, list].reverse())
          })
        })
    }

    loadList()
  }, [])

  function handleDelete(data) {
    if(isPast(new Date(data.date))){
      // Se a data do registro já passou vai entrar aqui
      alert('você não pode excluir um registro antigo!')
      return
    }
    Alert.alert(
      'Cuidado Atenção!',
      `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`
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

  async function handleDeleteSuccess(data) {
    await firabase.database().ref('histórico')
    .child(uid).child(data.key).remove()
    .then(async () => {
      let saldoAtual = saldo
      data.tipo === 'despesa' 
      ? saldoAtual += parseFloat(data.valor) 
      : saldoAtual -= parseFloat(data.valor)

      await firebase.database().ref('users').child(uid)
      .child('saldo').set(saldoAtual)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ { saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
      </Container>

      <Title>Ultimas movimentações</Title>

      <List 
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={ item => item.key }
        renderItem={({ item }) => ( <HistoricoList data={item} deleteItem={handleDelete}/> )}
      />
    </Background>
  );
}