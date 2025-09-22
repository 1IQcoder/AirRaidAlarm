import { Button, Portal, Modal, TextInput, Switch, Dialog, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { Settings } from '@/hooks/useSettings';
import { UpdateSettingsFn, DEFAULT_SETTINGS } from '@/hooks/useSettings';
import { View, ViewStyle } from 'react-native';
import { ShowSnackbarFn } from '@/hooks/useSnackbarList';

type SettingsModalProps = {
    isVisible: boolean,
    settingsObj: Settings,
    closeModal: (newSettings?: Settings) => void,
    clearAlarms: () => void,
    showMsg: ShowSnackbarFn,
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, settingsObj, closeModal, clearAlarms, showMsg }) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    const [useMyApiKey, setUseMyApiKey] = useState<boolean>(DEFAULT_SETTINGS.useMyApiKey);
    const [apiKey, setApiKey] = useState<string>(DEFAULT_SETTINGS.myApiKey);

    useEffect(() => {
        if (isVisible) {
            setUseMyApiKey(settingsObj.useMyApiKey ?? false);
            setApiKey(settingsObj.myApiKey ?? "");
        }
    }, [isVisible]);

    const onCloseButtonPress = () => {
        const newSettings: Settings = {
            useMyApiKey: useMyApiKey,
            myApiKey: apiKey,
        };

        (Object.keys(newSettings) as (keyof typeof newSettings)[]).forEach(key => {
            if (newSettings[key] !== settingsObj[key]) return setDialogVisible(true);
        });

        closeModal(newSettings);
    }

    const closeDialog = (save: boolean) => {
        setDialogVisible(false);
        if (!save) return closeModal();

        const newSettings: Settings = {
            useMyApiKey: useMyApiKey,
            myApiKey: apiKey,
        };

        closeModal(newSettings);
    }

    const onPressClearAlarms = () => {
        clearAlarms();
        showMsg("Будильники очищены");
    }

    return (
        <Portal>
            <Modal visible={isVisible}
                onDismiss={()=>{closeModal()}}
                contentContainerStyle={settingsModalContainerStyle}
            >
                <View>
                    <View style={rowBlockStyle}>
                        <Text variant='bodyMedium'>{"Использовать мой alerts.in.ua \nAPI ключ"}</Text>
                        <Switch value={useMyApiKey} onValueChange={()=>{setUseMyApiKey(!useMyApiKey)}} />
                    </View>
                    <TextInput
                        style={{display: useMyApiKey ? "flex" : "none", marginBottom: 15}}
                        label="API key"
                        value={apiKey}
                        onChangeText={text => setApiKey(text)}
                    />
                </View>

                <View>
                    <Button style={{backgroundColor: "#e36a6aff"}} mode="contained" onPress={onPressClearAlarms} >Очистить будильники</Button>
                </View>

                <Button style={{marginTop: 15}} mode="contained-tonal" onPress={onCloseButtonPress}>Готово</Button>
            </Modal>

            <Portal>
                <Dialog visible={dialogVisible}>
                    <Dialog.Content>
                    <Text variant="bodyMedium">У вас есть несохраненные изменения</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>{closeDialog(false)}}>отменить</Button>
                        <Button onPress={()=>{closeDialog(true)}}>сохранить</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Portal>
    )
}

const settingsModalContainerStyle = {backgroundColor: 'gray', padding: 20};
const rowBlockStyle: ViewStyle = { display: "flex", flexDirection: "row",
    justifyContent: "space-between", paddingTop: 5, paddingBottom: 10 }