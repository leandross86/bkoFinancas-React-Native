import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'
import { AuthContext } from '../../contexts/auth'
import { 
  Container,
  Nome,
  NewLink,
  NewText,
  Logout,
  LogoutText
 } from './styles';

export default function Profile() {
  const navigation = useNavigation()
  const { user, singOut } = useContext(AuthContext)

  return (
    <Container>
      <Header />
      <Nome>
        {user && user.nome}
      </Nome>

      <NewLink>
        <NewText onPress={() => navigation.navigate('Registrar')}>
          Registrar gastos
        </NewText>
      </NewLink>

      <Logout onPress={ () => singOut() }>
        <LogoutText>
          Sair
        </LogoutText>
      </Logout>
    </Container>
  );
}