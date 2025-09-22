import * as Notifications from 'expo-notifications';

const ERR_ALARM_DOESNT_EXIST = "Будильника с таким Id не существует";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Задает локальный будильник без проверки через api
export const newLocalAlarmNotification = async (time: Date) => {
    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Будильник",
                body: 'Вставай, рак',
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: time.getHours(),
                minute: time.getMinutes(),
                // repeats: alarm.cyclical,
            },
        });
        return id;
    } catch (err) {
        throw new Error("Ошибка установки будильника: " + err);
    }
}

export const deleteLocalAlarmNotification = async (notificationId: string): Promise<void> => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (err) {
        throw new Error("Ошибка удаления запланированного будильника: " + err);
    }
}

export const deleteAllLocalAlarmNotification = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
        throw new Error("Оштбка очистки запланированных будильников");
    }
}