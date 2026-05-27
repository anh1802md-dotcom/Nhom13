/**
 * COD1-46: Quản lý người dùng admin (mobile)
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles } from './styles/common';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const result = await apiFetch('/api/admin/users');
      setUsers(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Nhập username và password');
      return;
    }
    try {
      await apiFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ username, password, fullName, role: 'doctor' }),
      });
      setUsername('');
      setPassword('');
      setFullName('');
      loadUsers();
      Alert.alert('Thành công', 'Đã tạo người dùng');
    } catch (e) {
      Alert.alert('Lỗi', e.message);
    }
  }

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Thêm người dùng</Text>
        {error ? <Text style={commonStyles.error}>{error}</Text> : null}
        <TextInput
          style={commonStyles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Họ tên"
          value={fullName}
          onChangeText={setFullName}
        />
        <TouchableOpacity style={commonStyles.button} onPress={handleCreate}>
          <Text style={commonStyles.buttonText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={commonStyles.card}>
              <Text style={commonStyles.title}>{item.fullName}</Text>
              <Text style={commonStyles.label}>
                @{item.username} — {item.role}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
