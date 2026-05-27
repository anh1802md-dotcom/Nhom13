/**
 * Bổ sung mobile: Thêm bệnh nhân (bác sĩ & admin)
 * Không sửa file COD1 mobile gốc.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles } from './styles/common';

const emptyForm = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Nam',
  phone: '',
  address: '',
  bloodType: '',
  allergies: '',
  medicalHistory: '',
};

export default function COD1_Bonus_AddPatient() {
  const [form, setForm] = useState(emptyForm);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function load() {
    apiFetch('/api/bonus/patients')
      .then((r) => setPatients(r.data))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.fullName) {
      Alert.alert('Lỗi', 'Nhập họ tên bệnh nhân');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch('/api/bonus/patients', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      Alert.alert('Thành công', `Đã thêm ${result.data.fullName} (${result.data.id})`);
      setForm(emptyForm);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['fullName', 'Họ tên *'],
    ['dateOfBirth', 'Ngày sinh'],
    ['gender', 'Giới tính'],
    ['phone', 'SĐT'],
    ['address', 'Địa chỉ'],
    ['bloodType', 'Nhóm máu'],
    ['allergies', 'Dị ứng'],
    ['medicalHistory', 'Tiền sử'],
  ];

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Thêm bệnh nhân mới</Text>
        <Text style={commonStyles.label}>Bổ sung — Bác sĩ & Admin</Text>
        {error ? <Text style={commonStyles.error}>{error}</Text> : null}
        {fields.map(([key, label]) => (
          <View key={key}>
            <Text style={commonStyles.label}>{label}</Text>
            <TextInput
              style={commonStyles.input}
              value={form[key]}
              onChangeText={(v) => updateField(key, v)}
            />
          </View>
        ))}
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={commonStyles.buttonText}>Thêm bệnh nhân</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={[commonStyles.title, { marginTop: 8 }]}>Danh sách ({patients.length})</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <Text style={commonStyles.title}>{item.fullName}</Text>
            <Text style={commonStyles.label}>Mã: {item.id}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
