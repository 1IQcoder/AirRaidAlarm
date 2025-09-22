import * as Notifications from 'expo-notifications';
import { Alarm } from '@/types/alarm';

const ERR_ALARM_DOESNT_EXIST = "Будильника с таким Id не существует";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotification = (
    editAlarm: (id: number, settings: Partial<Alarm>) => void,
    getAlarm: (id: number) => Alarm | null,
) => {
    // Задает локальный будильник без проверки через api
    const newLocalAlarmNotification = async (alarmId: number) => {
        const alarm = getAlarm(alarmId);
        if (!alarm) throw new Error(ERR_ALARM_DOESNT_EXIST);

        try {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Будильник",
                    body: 'Вставай, рак',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: alarm.time.getHours(),
                    minute: alarm.time.getMinutes(),
                    // repeats: alarm.cyclical,
                },
            });

            editAlarm(alarmId, { notificationId: id, active: true });
        } catch (err) {
            throw new Error("Ошибка установки будильника: " + err);
        }
    }

    const deleteLocalAlarmNotification = async (alarmId: number): Promise<void> => {
        const alarm = getAlarm(alarmId);
        if (!alarm) throw new Error(ERR_ALARM_DOESNT_EXIST);

        const notificationId = alarm.notificationId;
        if (!notificationId) throw new Error("Запланнированный будильник с таким Id не найден");
        try {
            Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (err) {
            throw new Error("Ошибка удаления запланированного будильника: " + err);
        }
    }

    return {
        newLocalAlarmNotification,
        deleteLocalAlarmNotification,
    }
}