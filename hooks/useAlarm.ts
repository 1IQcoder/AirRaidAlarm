import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { getTimeObj } from "@/helpers/time";

const ALARMS_KEY = "AirRaidAlarm_alarms";

export type AlarmTime = {
    timeStamp: number, // кол-во минут от 00:00,
    date: Date,
    dateString: string, // Date ISO string
    text: string, // "19:30"
}

export type Alarm = {
    id: number,
    active: boolean,
    time: AlarmTime,
    textTime: string,
    cyclical: boolean,
    checkAlarm: boolean,
}

export type AlarmsMap = Record<number, Alarm>;

const DEFAULT_DATE = new Date();
DEFAULT_DATE.setHours(10);
DEFAULT_DATE.setMinutes(0);

const DEFAULT_ALARM: Alarm = {
    id: 1,
    active: true,
    time: getTimeObj([10, 30]),
    textTime: "12:40",
    cyclical: false,
    checkAlarm: false,
}

const defaultAlarms: AlarmsMap = {
    // 1: {
    //     id: 1,
    //     active: false,
    //     time: 100,
    //     textTime: "12:40",
    //     cyclical: false,
    //     checkAlarm: true,
    // }
}

export const useAlarm = () => {
    const [alarms, setAlarms] = useState<Record<number, Alarm>>({});
    const [isLoading, setIsLoading] = useState(true);

    const clearAlarms = async () => {
        setAlarms(defaultAlarms);
        try {
            await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(defaultAlarms));
        } catch (err) {
            throw new Error("Ошибка очистки будильников: "+err);
        }
    }

    const loadClockAlarms = async () => {
        try {
            const storedAlarms = await AsyncStorage.getItem(ALARMS_KEY);
            if (storedAlarms) {
                const alarms: AlarmsMap = JSON.parse(storedAlarms);
                for (const key in alarms) {
                    const e = alarms[key];
                    e.time.date = new Date(e.time.dateString);
                }
                setAlarms(alarms);
            } else {
                setAlarms(defaultAlarms);
            }
        } catch (err) {
            console.log(err);
            setAlarms(defaultAlarms);
        } finally {
            setIsLoading(false);
        }
    }

    const saveClockAlarms = async () => {
        if (!alarms) return;
        try {
            await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));   
        } catch (err) {
            console.log(err);
        }
    }

    const toggleAlarm = (id: number, active: boolean) => {
        const alarm = alarms[id];
        if (alarm.active === active) return;



        setAlarm(id, { active: active });
        return true;
    }

    // Если будильника нету - содает новый
    // Будильник есть - меняет параметры
    const setAlarm = (id: number, settings: Partial<Alarm>) => {
        const newAlarm = {
            ...(alarms[id] ?? DEFAULT_ALARM),
            ...settings,
            id: id,
        }

        // if (newAlarm.active) {
        //     try {
        //         await toggleAlarm(id, true);
        //     } catch (err) {
        //         throw err;
        //     }
        // }

        setAlarms(prev => {
            return {
                ...prev,
                [id]: newAlarm,
            }
        })
    }

    useEffect(() => {
        loadClockAlarms();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveClockAlarms();
        }
    }, [alarms]);

    return {
        alarms,
        isLoading,
        clearAlarms,
        setAlarm,
        toggleAlarm,
    }
}

type UseAlarmsReturn = ReturnType<typeof useAlarm>;
export type ToggleAlarmFn = UseAlarmsReturn["toggleAlarm"];
export type ClearAlarmsFn = UseAlarmsReturn["clearAlarms"];
