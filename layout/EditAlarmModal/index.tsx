import { useState, FC, useEffect } from "react"
import { Modal, Portal, Text, TextInput, Switch, HelperText, Button } from "react-native-paper"
import { Alarm } from "@/hooks/useAlarm"
import { View, ViewStyle } from "react-native"
import { validateTime, getTimeObj } from "@/helpers/time"

type EditAlarmModalProps = {
    isOpen: boolean,
    alarmSettings: Partial<Alarm>,
    closeModal: (alarmObj?: { id: number } & Partial<Omit<Alarm, 'id'>>) => void,
}

export const EditAlarmModal: FC<EditAlarmModalProps> = ({ isOpen, alarmSettings, closeModal }) => {
    const [timeText, setTimeText] = useState(alarmSettings?.textTime ?? "");
    const [inputErr, setInputErr] = useState("");
    const [isCyclical, setCyclical] = useState(alarmSettings?.cyclical ?? false);
    const [isCheckAlarm, setCheckAlarm] = useState(alarmSettings?.checkAlarm ?? true);

    useEffect(() => {
        setTimeText(alarmSettings?.textTime ?? "");
        // setInputErr("");
        setCyclical(alarmSettings?.cyclical ?? false);
        setCheckAlarm(alarmSettings?.checkAlarm ?? false);
    }, [isOpen]);

    const onPressConfirm = () => {
        const res = validateTime(timeText);
        if ((typeof res) === "string") return setInputErr(res);
        
        const timeObj = getTimeObj(res);

        const newAlarmObj: Alarm = {
            id: alarmSettings?.id ?? Date.now(),
            active: alarmSettings?.active ?? false,
            time: timeObj,
            textTime: timeText,
            cyclical: isCyclical,
            checkAlarm: isCheckAlarm,
        }

        closeModal(newAlarmObj);
    }

    const hasErrors = () => {
        return inputErr.length > 0;
    };

    return (
        <Portal>
            <Modal visible={isOpen} onDismiss={()=>{closeModal()}} contentContainerStyle={containerStyle}>
                <Text style={{marginBottom: 15}} variant="titleMedium" >{alarmSettings.id ? "Редактирование будильника" : "Новый будильник"}</Text>

                <TextInput
                    label="Время"
                    value={timeText}
                    onChangeText={text => setTimeText(text)}
                />
                <HelperText type="error" visible={hasErrors()}>{inputErr}</HelperText>

                <View style={rowBlockStyle}>
                    <Text variant='bodyMedium'>{"Повторять ежедневно"}</Text>
                    <Switch value={isCyclical} onValueChange={()=>{setCyclical(!isCyclical)}} />
                </View>

                <View style={rowBlockStyle}>
                    <Text variant='bodyMedium'>{"Откладывать в \nслучае тревоги"}</Text>
                    <Switch value={isCheckAlarm} onValueChange={()=>{setCheckAlarm(!isCheckAlarm)}} />
                </View>

                <Button mode="contained" onPress={onPressConfirm}>{alarmSettings.id ? "Сохранить" : "Готово"}</Button>
            </Modal>
        </Portal>
    )
}

const containerStyle = {backgroundColor: 'gray', padding: 20};
const rowBlockStyle: ViewStyle = { display: "flex", flexDirection: "row",
    justifyContent: "space-between", paddingTop: 5, paddingBottom: 10 }