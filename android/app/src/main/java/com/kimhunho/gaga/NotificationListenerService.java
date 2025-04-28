package com.gaga; // ← 네 패키지 이름으로 수정

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import android.content.Intent;

public class MyNotificationListenerService extends NotificationListenerService {

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        String title = sbn.getNotification().extras.getString("android.title");
        String text = sbn.getNotification().extras.getString("android.text");

        Log.d("NotificationListener", "Notification received: " + title + " - " + text);

        // JS로 보내기
        Intent intent = new Intent("com.yourappname.NOTIFICATION_RECEIVED");
        intent.putExtra("title", title);
        intent.putExtra("text", text);
        sendBroadcast(intent);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // 알림 삭제 시 동작 (필요없으면 비워둬)
    }
}
