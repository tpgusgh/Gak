import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import NotificationListener from 'react-native-notification-listener';

export default function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestNotificationPermission();
    }

    const listener = NotificationListener.onNotificationReceived((notification) => {
      console.log('받은 알림:', notification);

      const parsed = parseNotification(notification.text);
      if (parsed) {
        setNotifications(prev => [parsed, ...prev]);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  async function requestNotificationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('알림 접근 권한이 필요합니다.');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  function parseNotification(text) {
    // 카드 결제 문자 또는 알림에서 금액과 상호 추출
    const regex = /(.+?) (\d+,?\d*)원/;
    const match = text.match(regex);
    if (match) {
      const title = match[1];
      const amount = -parseInt(match[2].replace(/,/g, ''), 10);
      const category = getCategory(title);
      return { title, amount, category, date: getTodayDate() };
    }
    return null;
  }

  function getCategory(title) {
    if (title.includes('스타벅스') || title.includes('커피')) return '식비';
    if (title.includes('버스') || title.includes('지하철') || title.includes('택시')) return '교통비';
    if (title.includes('편의점') || title.includes('마트')) return '쇼핑';
    return '기타';
  }

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>오늘의 지출</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.date} - {item.title}: {item.amount.toLocaleString()}원 ({item.category})</Text> 
          </View>
        )}
        //에러나는 이유를 모르겠음
      />
    </View>
  );
}
