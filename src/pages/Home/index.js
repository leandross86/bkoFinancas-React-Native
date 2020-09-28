import React, { useContext } from 'react';
import Header from '../../components/Header'
import {
  Background,
  Container,
  Nome,
  Saldo,
  Title
} from './styles'

import { AuthContext } from '../../contexts/auth'

export default function Home() {
  const { user } = useContext(AuthContext)
  return (
    <Background>
      <Header />
      <Container>
        <Nome>Leandro</Nome>
        <Saldo>R$ 145,00</Saldo>
      </Container>

      <Title>Ultimas movimentações</Title>
    </Background>
  );
}