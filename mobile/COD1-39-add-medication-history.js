/**
 * COD1-39: Thêm lịch sử thuốc
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

export default function AddMedicationScreen() {
  const [form, setForm] = useState({
    patientId: DEMO_PATIENT_ID,
    drugName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
    reminderTimes: '08:00,20:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const body = {
        ...form,
        reminderTimes: form.reminderTimes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await apiFetch('/api/medications', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      Alert.alert('Thành công', 'Đã thêm lịch sử thuốc');
      setForm({
        patientId: DEMO_PATIENT_ID,
        drugName: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        notes: '',
        reminderTimes: '08:00,20:00',
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['drugName', 'Tên thuốc *'],
    ['dosage', 'Liều lượng'],
    ['frequency', 'Tần suất'],
    ['startDate', 'Ngày bắt đầu'],
    ['endDate', 'Ngày kết thúc'],
    ['notes', 'Ghi chú'],
    ['reminderTimes', 'Giờ nhắc (vd: 08:00,20:00)'],
  ];

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Thêm lịch sử thuốc</Text>
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
            <Text style={commonStyles.buttonText}>Thêm thuốc</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
