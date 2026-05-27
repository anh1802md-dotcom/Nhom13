/**
 * COD1-41: Đặt lịch khám
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

export default function BookAppointmentScreen() {
  const [form, setForm] = useState({
    patientId: DEMO_PATIENT_ID,
    doctorName: 'BS. Nguyễn Văn A',
    clinic: 'Phòng khám Đa khoa',
    date: '2026-06-15',
    time: '10:00',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleBook() {
    setLoading(true);
    setError('');
    try {
      await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      Alert.alert('Thành công', 'Đã đặt lịch khám');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['doctorName', 'Bác sĩ'],
    ['clinic', 'Cơ sở khám'],
    ['date', 'Ngày (YYYY-MM-DD)'],
    ['time', 'Giờ (HH:mm)'],
    ['reason', 'Lý do khám'],
  ];

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Đặt lịch khám</Text>
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
        <TouchableOpacity style={commonStyles.button} onPress={handleBook} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={commonStyles.buttonText}>Xác nhận đặt lịch</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
