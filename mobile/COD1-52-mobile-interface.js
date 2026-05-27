/**
 * COD1-52: Thiết kế giao diện mobile (màn hình trang chủ)
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors } from './styles/common';

const MENU = [
  { screen: 'ViewPatient', label: 'Xem hồ sơ bệnh nhân', task: 'COD1-37' },
  { screen: 'UpdatePatient', label: 'Cập nhật hồ sơ bệnh nhân', task: 'COD1-38' },
  { screen: 'AddMedication', label: 'Thêm lịch sử thuốc', task: 'COD1-39' },
  { screen: 'ViewMedication', label: 'Xem lịch sử thuốc', task: 'COD1-40' },
  { screen: 'MedicationScreen', label: 'Màn hình lịch sử thuốc', task: 'COD1-53' },
  { screen: 'BookAppointment', label: 'Đặt lịch khám', task: 'COD1-41' },
  { screen: 'ViewAppointments', label: 'Xem lịch khám', task: 'COD1-42' },
  { screen: 'ExaminationHistory', label: 'Lịch sử khám', task: 'COD1-54' },
  { screen: 'Notifications', label: 'Nhắc uống thuốc', task: 'COD1-57' },
];

export default function HomeScreen({ navigation, user, onLogout }) {
  const menu =
    user?.role === 'admin'
      ? [...MENU, { screen: 'AdminUsers', label: 'Quản lý người dùng (Admin)', task: 'COD1-46' }]
      : MENU;

  return (
    <ScrollView style={commonStyles.container}>
      <View style={[commonStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
          Xin chào, {user?.fullName || user?.username}
        </Text>
        <Text style={{ color: '#E3F2FD', marginTop: 4 }}>Vai trò: {user?.role}</Text>
      </View>

      <Text style={[commonStyles.title, { marginTop: 8 }]}>Chức năng</Text>
      {menu.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={commonStyles.menuItem}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={commonStyles.menuText}>{item.label}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{item.task}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[commonStyles.button, { backgroundColor: colors.danger, marginBottom: 32 }]}
        onPress={onLogout}
      >
        <Text style={commonStyles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
