/**
 * Ứng dụng chính - điều hướng tới các màn hình theo task COD1
 */
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './COD1-50-login-screen';
import HomeScreen from './COD1-52-mobile-interface';
import ViewPatientScreen from './COD1-37-view-patient-profile';
import UpdatePatientScreen from './COD1-38-update-patient-profile';
import AddMedicationScreen from './COD1-39-add-medication-history';
import ViewMedicationScreen from './COD1-40-view-medication-history';
import MedicationHistoryScreen from './COD1-53-medication-history-screen';
import BookAppointmentScreen from './COD1-41-book-appointment';
import ViewAppointmentsScreen from './COD1-42-view-appointments';
import ExaminationHistoryScreen from './COD1-54-examination-history-screen';
import AdminUsersScreen from './COD1-46-admin-users';
import MedicationNotifications from './COD1-57-medication-notifications';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1565C0' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: 'Trang chủ' }}>
              {(props) => <HomeScreen {...props} user={user} onLogout={() => setUser(null)} />}
            </Stack.Screen>
            <Stack.Screen
              name="ViewPatient"
              component={ViewPatientScreen}
              options={{ title: 'Hồ sơ bệnh nhân' }}
            />
            <Stack.Screen
              name="UpdatePatient"
              component={UpdatePatientScreen}
              options={{ title: 'Cập nhật hồ sơ' }}
            />
            <Stack.Screen
              name="AddMedication"
              component={AddMedicationScreen}
              options={{ title: 'Thêm thuốc' }}
            />
            <Stack.Screen
              name="ViewMedication"
              component={ViewMedicationScreen}
              options={{ title: 'Lịch sử thuốc' }}
            />
            <Stack.Screen
              name="MedicationScreen"
              component={MedicationHistoryScreen}
              options={{ title: 'Màn hình thuốc' }}
            />
            <Stack.Screen
              name="BookAppointment"
              component={BookAppointmentScreen}
              options={{ title: 'Đặt lịch khám' }}
            />
            <Stack.Screen
              name="ViewAppointments"
              component={ViewAppointmentsScreen}
              options={{ title: 'Lịch khám' }}
            />
            <Stack.Screen
              name="ExaminationHistory"
              component={ExaminationHistoryScreen}
              options={{ title: 'Lịch sử khám' }}
            />
            <Stack.Screen
              name="AdminUsers"
              component={AdminUsersScreen}
              options={{ title: 'Quản lý người dùng' }}
            />
            <Stack.Screen
              name="Notifications"
              component={MedicationNotifications}
              options={{ title: 'Nhắc uống thuốc' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
