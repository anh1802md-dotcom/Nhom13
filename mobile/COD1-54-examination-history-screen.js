/**
 * COD1-54: Tạo màn hình lịch sử khám
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles, colors } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function ExaminationHistoryScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await apiFetch(`/api/examinations?patientId=${DEMO_PATIENT_ID}`);
      setList(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && list.length === 0) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={[commonStyles.title, { marginBottom: 8 }]}>Lịch sử khám bệnh</Text>
      {error ? <Text style={commonStyles.error}>{error}</Text> : null}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        ListEmptyComponent={<Text style={commonStyles.empty}>Chưa có lịch sử khám</Text>}
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primaryDark }}>
              {item.date}
            </Text>
            <Text style={commonStyles.value}>{item.doctorName}</Text>
            <Text style={commonStyles.label}>{item.clinic}</Text>
            <View
              style={{
                marginTop: 8,
                padding: 10,
                backgroundColor: '#E8F5E9',
                borderRadius: 8,
              }}
            >
              <Text style={commonStyles.label}>Chẩn đoán</Text>
              <Text style={{ fontSize: 15 }}>{item.diagnosis}</Text>
            </View>
            {item.notes ? (
              <Text style={{ marginTop: 8, color: colors.textMuted }}>{item.notes}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
