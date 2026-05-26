import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { registrar } from '../utils/authService';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegistrar = async () => {
    if (!email || !senha || !confirmar) return setMsg('Preencha todos os campos.');
    if (senha.length < 6) return setMsg('Senha deve ter mínimo 6 caracteres.');
    if (senha !== confirmar) return setMsg('As senhas não coincidem.');
    const resultado = await registrar(email.trim(), senha);
    if (!resultado.sucesso) return setMsg('Não foi possível criar a conta.');
    setMsg('Conta criada! Verifique seu e-mail.');
  };

  return (
    <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
      <Image style={styles.logo} source={require('../assets/unicopa.png')} />
      <Text style={styles.titulo}>REGISTRAR-SE</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#4a6070" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#4a6070" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#4a6070" value={confirmar} onChangeText={setConfirmar} secureTextEntry />

      {msg !== '' && <Text style={[styles.msg, msg.startsWith('Conta') && styles.sucesso]}>{msg}</Text>}

      <TouchableOpacity style={styles.botao} onPress={handleRegistrar}>
        <Text style={styles.botaoTexto}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem conta? <Text style={styles.linkDestaque}>Entrar</Text></Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 200, height: 50, resizeMode: 'contain', marginBottom: 32 },
  titulo: { fontSize: 28, fontWeight: '700', color: 'white', letterSpacing: 2, marginBottom: 24 },
  input: { width: '100%', backgroundColor: '#0c1b2a', borderWidth: 1, borderColor: '#1e2d3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, color: 'white', fontSize: 15, marginBottom: 12 },
  msg: { color: '#ff6b6b', fontSize: 13, marginBottom: 12 },
  sucesso: { color: '#4caf50' },
  botao: { width: '100%', backgroundColor: '#f2cc2f', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  botaoTexto: { color: '#040b13', fontWeight: 'bold', fontSize: 15 },
  link: { color: '#8fa3b8', fontSize: 14 },
  linkDestaque: { color: '#f2cc2f', fontWeight: 'bold' },
});