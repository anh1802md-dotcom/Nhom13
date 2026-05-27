/**
 * COD1-42: Xem lịch khám
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles, colors } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function ViewAppointmentsScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await apiFetch(`/api/appointments?patientId=${DEMO_PATIENT_ID}`);
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
      {error ? <Text style={commonStyles.error}>{error}</Text> : null}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        ListEmptyComponent={<Text style={commonStyles.empty}>Chưa có lịch khám</Text>}
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <Text style={commonStyles.title}>
              {item.date} — {item.time}
            </Text>
            <Text style={commonStyles.value}>{item.doctorName}</Text>
            <Text style={commonStyles.label}>{item.clinic}</Text>
            <Text style={commonStyles.label}>Lý do: {item.reason}</Text>
            <Text style={{ color: colors.primary, marginTop: 8, fontWeight: '600' }}>
              Trạng thái: {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
