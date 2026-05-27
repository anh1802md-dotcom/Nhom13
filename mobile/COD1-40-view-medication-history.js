/**
 * COD1-40: Xem lịch sử thuốc
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { apiFetch } from './config/api';
import { commonStyles } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

export default function ViewMedicationScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch(`/api/medications?patientId=${DEMO_PATIENT_ID}`);
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
        ListEmptyComponent={<Text style={commonStyles.empty}>Chưa có lịch sử thuốc</Text>}
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <Text style={commonStyles.title}>{item.drugName}</Text>
            <Text style={commonStyles.label}>Liều: {item.dosage}</Text>
            <Text style={commonStyles.label}>Tần suất: {item.frequency}</Text>
            <Text style={commonStyles.label}>
              {item.startDate} → {item.endDate}
            </Text>
            {item.notes ? <Text style={commonStyles.value}>{item.notes}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
