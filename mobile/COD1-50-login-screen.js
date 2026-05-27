/**
 * COD1-50: Màn hình đăng nhập (gọi API đăng nhập)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiFetch, setAuthToken } from './config/api';
import { commonStyles, colors } from './styles/common';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('bacsi');
  const [password, setPassword] = useState('user123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setAuthToken(result.token);
      onLogin(result.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { justifyContent: 'center' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[commonStyles.card, { marginBottom: 24 }]}>
        <Text style={[commonStyles.title, { fontSize: 22, textAlign: 'center' }]}>
          Quản lý bệnh nhân
        </Text>
        <Text style={{ textAlign: 'center', color: colors.textMuted, marginBottom: 16 }}>
          Đăng nhập để tiếp tục
        </Text>
        {error ? <Text style={commonStyles.error}>{error}</Text> : null}
        <Text style={commonStyles.label}>Tên đăng nhập</Text>
        <TextInput
          style={commonStyles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="bacsi hoặc admin"
        />
        <Text style={commonStyles.label}>Mật khẩu</Text>
        <TextInput
          style={commonStyles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="user123 hoặc admin123"
        />
        <TouchableOpacity style={commonStyles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={commonStyles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
