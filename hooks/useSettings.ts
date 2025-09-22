import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const SETTINGS_KEY = "AirRaidAlarm_settings";

export type Settings = {
    useMyApiKey: boolean,
    myApiKey: string,
}

export const DEFAULT_SETTINGS: Settings = {
    useMyApiKey: false,
    myApiKey: "",
}

export const useSettings = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    const updateSettings = (newSettings: Settings) => {
        setSettings(newSettings);
    }

    const saveSettings = async () => {
        if (!settings) return;
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (err) {
            console.log(err);
        }
    }

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const sttngs: Settings = JSON.parse(stored);
                setSettings(sttngs);
            } else {
                setSettings(DEFAULT_SETTINGS);
            }
        } catch (err) {
            console.log(err);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setIsLoading(true);
        }
    }

    useEffect(() => {
        loadSettings();
    });

    useEffect(() => {
        saveSettings();
    }, [settings]);

    return {
        settings,
        updateSettings,
    }
}

type UseReturn = ReturnType<typeof useSettings>;
export type UpdateSettingsFn = UseReturn["updateSettings"];