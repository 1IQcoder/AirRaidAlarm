import { ToggleAlarmFn } from "@/hooks/useAlarm"
import { Alarm } from "@/hooks/useAlarm"
import React, { useEffect } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { getTimeDiff } from "@/helpers/time"
import { Text, Switch } from "react-native-paper"
import { ShowSnackbarFn } from "@/hooks/useSnackbarList"

type AlarmItemProps = {
    alarm: Alarm,
    toggleAlarm: ToggleAlarmFn,
    openAlarmModal: (id?: number) => void,
    showMsg: ShowSnackbarFn,
}

export const AlarmItem: React.FC<AlarmItemProps> = ({
    alarm, toggleAlarm, openAlarmModal, showMsg
}) => {
    const onToggleAlarm = async () => {
        try {
            const now = new Date;
            showMsg(now.toISOString());
            await toggleAlarm(alarm.id, !alarm.active);
            const timeDiff = getTimeDiff(alarm.time.date);
            
            showMsg(
                alarm.active ? "Будильник на "+alarm.textTime+" отменен" :
                `Новый будильник задан на ${alarm.textTime}\n Зазвонит через: ${timeDiff.hours} часов ${timeDiff.minutes} минут`
            )
        } catch (err) {
            showMsg("Ошибка: "+String(err));
        }
    }

    const onPressablePress = () => {
        openAlarmModal(alarm.id)
    }

    return (
        <Pressable onPress={onPressablePress}>
            <View style={styles.container}>
                <View>
                    <Text variant="displaySmall">{alarm.time.text}</Text>
                    <Text>{!alarm.cyclical ? "Однократно" : "Ежедневно"}</Text>
                </View>
                <View>
                    <Switch value={alarm.active} onValueChange={onToggleAlarm} />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth: "90%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#515151dd",
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
    }
})