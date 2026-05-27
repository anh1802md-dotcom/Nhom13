/**
 * COD1-37: Xem hồ sơ bệnh nhân
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function ViewPatientScreen({ navigation }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatient();
  }, []);

  async function loadPatient() {
    try {
      const result = await apiFetch(`/api/patients/${DEMO_PATIENT_ID}`);
      setPatient(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.error}>{error || 'Không có dữ liệu'}</Text>
      </View>
    );
  }

  const fields = [
    ['Họ tên', patient.fullName],
    ['Ngày sinh', patient.dateOfBirth],
    ['Giới tính', patient.gender],
    ['Số điện thoại', patient.phone],
    ['Địa chỉ', patient.address],
    ['Nhóm máu', patient.bloodType],
    ['Dị ứng', patient.allergies],
    ['Tiền sử bệnh', patient.medicalHistory],
  ];

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Hồ sơ bệnh nhân #{patient.id}</Text>
        {fields.map(([label, value]) => (
          <View key={label}>
            <Text style={commonStyles.label}>{label}</Text>
            <Text style={commonStyles.value}>{value || '—'}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={commonStyles.button}
        onPress={() => navigation.navigate('UpdatePatient', { patient })}
      >
        <Text style={commonStyles.buttonText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
