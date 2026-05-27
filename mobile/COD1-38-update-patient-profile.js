/**
 * COD1-38: Cập nhật hồ sơ bệnh nhân
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function UpdatePatientScreen({ route }) {
  const initial = route.params?.patient || {
    id: DEMO_PATIENT_ID,
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
  };

  const [form, setForm] = useState({ ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      await apiFetch(`/api/patients/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      Alert.alert('Thành công', 'Đã cập nhật hồ sơ bệnh nhân');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['fullName', 'Họ tên'],
    ['dateOfBirth', 'Ngày sinh (YYYY-MM-DD)'],
    ['gender', 'Giới tính'],
    ['phone', 'Số điện thoại'],
    ['address', 'Địa chỉ'],
    ['bloodType', 'Nhóm máu'],
    ['allergies', 'Dị ứng'],
    ['medicalHistory', 'Tiền sử bệnh'],
  ];

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Cập nhật hồ sơ</Text>
        {error ? <Text style={commonStyles.error}>{error}</Text> : null}
        {fields.map(([key, label]) => (
          <View key={key}>
            <Text style={commonStyles.label}>{label}</Text>
            <TextInput
              style={commonStyles.input}
              value={String(form[key] || '')}
              onChangeText={(v) => updateField(key, v)}
            />
          </View>
        ))}
        <TouchableOpacity style={commonStyles.button} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={commonStyles.buttonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
