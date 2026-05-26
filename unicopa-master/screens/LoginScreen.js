import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { login } from '../utils/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) return setErro('Preencha todos os campos.');
    const resultado = await login(email.trim(), senha);
    if (!resultado.sucesso) return setErro('E-mail ou senha incorretos.');
    navigation.replace('Home');
  };

  return (
    <ImageBackground style={styles.container} source={require('../assets/bg-overlay.png')}>
      <Image style={styles.logo} source={require('../assets/unicopa.png')} />
      <Text style={styles.titulo}>ENTRAR</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#4a6070" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#4a6070" value={senha} onChangeText={setSenha} secureTextEntry />

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? <Text style={styles.linkDestaque}>Registre-se</Text></Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040b13', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 200, height: 50, resizeMode: 'contain', marginBottom: 32 },
  titulo: { fontSize: 28, fontWeight: '700', color: 'white', letterSpacing: 2, marginBottom: 24 },
  input: { width: '100%', backgroundColor: '#0c1b2a', borderWidth: 1, borderColor: '#1e2d3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, color: 'white', fontSize: 15, marginBottom: 12 },
  erro: { color: '#ff6b6b', fontSize: 13, marginBottom: 12 },
  botao: { width: '100%', backgroundColor: '#f2cc2f', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  botaoTexto: { color: '#040b13', fontWeight: 'bold', fontSize: 15 },
  link: { color: '#8fa3b8', fontSize: 14 },
  linkDestaque: { color: '#f2cc2f', fontWeight: 'bold' },
});