/**
 * COD1-53: Tạo màn hình lịch sử thuốc (giao diện chi tiết)
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles, colors } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function MedicationHistoryScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/medications?patientId=${DEMO_PATIENT_ID}`)
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <View style={[commonStyles.card, { backgroundColor: colors.primaryDark }]}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
          Lịch sử sử dụng thuốc
        </Text>
        <Text style={{ color: '#BBDEFB', marginTop: 4 }}>Bệnh nhân: {DEMO_PATIENT_ID}</Text>
      </View>

      {list.length === 0 ? (
        <Text style={commonStyles.empty}>Chưa có dữ liệu</Text>
      ) : (
        list.map((item, index) => (
          <View key={item.id} style={commonStyles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: '700', color: colors.primary }}>#{index + 1}</Text>
              <Text style={{ color: colors.textMuted }}>{item.id}</Text>
            </View>
            <Text style={commonStyles.title}>{item.drugName}</Text>
            <Text style={commonStyles.value}>
              {item.dosage} — {item.frequency}
            </Text>
            <View
              style={{
                backgroundColor: colors.background,
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              <Text style={commonStyles.label}>Thời gian điều trị</Text>
              <Text>{item.startDate} đến {item.endDate || 'hiện tại'}</Text>
              {item.reminderTimes?.length > 0 && (
                <Text style={{ marginTop: 6, color: colors.success }}>
                  Nhắc: {item.reminderTimes.join(', ')}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
