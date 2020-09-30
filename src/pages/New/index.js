import React, { useState } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import Header from '../../components/Header'
import {
  Background,
  Input,
  SubmitButton,
  SubmitText,
} from './styles'
import Picker from '../../components/Picker'

export default function New() {
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('receita')
  return (
    <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
      <Background>
        <Header />
        <SafeAreaView style={{ alignItems: 'center' }}>
          <Input 
            placeholder="Valor desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={ () => Keyboard.dismiss() }
            value={valor}
            onChangeText={ (text) => setValor(text) }
          />

          <Picker onChange={setTipo} tipo={tipo} />

          <SubmitButton>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}