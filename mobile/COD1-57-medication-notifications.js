/**
 * COD1-57: Nhận thông báo thuốc
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { apiFetch } from './config/api';
import { commonStyles, colors } from './styles/common';

const DEMO_PATIENT_ID = 'p1';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function requestPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export default function MedicationNotifications() {
  const [medications, setMedications] = useState([]);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await requestPermission();
      setPermission(ok);
      try {
        const result = await apiFetch(`/api/medications?patientId=${DEMO_PATIENT_ID}`);
        setMedications(result.data);
      } catch {
        setMedications([]);
      }
    })();
  }, []);

  async function scheduleReminder(med, time) {
    const ok = permission || (await requestPermission());
    if (!ok) {
      Alert.alert('Lỗi', 'Cần cấp quyền thông báo');
      return;
    }

    const [hour, minute] = time.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      Alert.alert('Lỗi', 'Giờ nhắc không hợp lệ');
      return;
    }

    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medicine', {
        name: 'Nhắc uống thuốc',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc uống thuốc',
        body: `${med.drugName} — ${med.dosage || 'theo chỉ định'}`,
        sound: true,
      },
      trigger,
      ...(Platform.OS === 'android' ? { channelId: 'medicine' } : {}),
    });

    Alert.alert('Đã đặt', `Nhắc ${med.drugName} lúc ${time} hàng ngày`);
  }

  async function sendTestNow() {
    const ok = permission || (await requestPermission());
    if (!ok) {
      Alert.alert('Lỗi', 'Cần cấp quyền thông báo');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc uống thuốc (thử)',
        body: 'Đây là thông báo thử — kiểm tra hoạt động',
      },
      trigger: { seconds: 2 },
    });
    Alert.alert('OK', 'Thông báo sẽ hiện sau 2 giây');
  }

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Nhắc uống thuốc</Text>
        <Text style={{ color: colors.textMuted, marginBottom: 12 }}>
          Quyền thông báo: {permission ? 'Đã cấp' : 'Chưa cấp'}
        </Text>
        <TouchableOpacity style={commonStyles.button} onPress={sendTestNow}>
          <Text style={commonStyles.buttonText}>Gửi thông báo thử</Text>
        </TouchableOpacity>
      </View>

      {medications.map((med) => (
        <View key={med.id} style={commonStyles.card}>
          <Text style={commonStyles.title}>{med.drugName}</Text>
          <Text style={commonStyles.label}>
            Giờ nhắc: {(med.reminderTimes || []).join(', ') || 'Chưa có'}
          </Text>
          {(med.reminderTimes || []).map((time) => (
            <TouchableOpacity
              key={`${med.id}-${time}`}
              style={[commonStyles.button, { marginTop: 8, backgroundColor: colors.success }]}
              onPress={() => scheduleReminder(med, time)}
            >
              <Text style={commonStyles.buttonText}>Đặt nhắc {time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
