import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function App() {
  useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('알림 수신:', notification);
        handleNotification(notification.message);
      },
      requestPermissions: true, // 권한 요청
    });
  }, []);

  // 알림 처리 함수
  const handleNotification = (message: string) => {
    console.log('파싱된 알림:', message);
    // 여기서 메시지를 파싱해서 가계부에 저장하는 로직을 구현
  };

  return (
    <View>
      <Text>가계부 앱</Text>
    </View>
  );
}
