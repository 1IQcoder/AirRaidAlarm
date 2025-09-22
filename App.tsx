import React, { useState } from "react";
import { View, Text, AppRegistry } from "react-native";
import AlarmKit from "@/modules/alarm-kit";
import app from './app.json';
const appName = app.expo.name;
import { PaperProvider, Button, Appbar, Icon, IconButton, Portal } from 'react-native-paper';
import { SettingsModal } from "./layout/SettingsModal/index";
import { useSettings, Settings } from "./hooks/useSettings";
import { EditAlarmModal } from "./layout/EditAlarmModal";
import { Alarm, useAlarm } from "./hooks/useAlarm";
import AlarmList from "./layout/AlarmList";
import { useSnackbarList } from "./hooks/useSnackbarList";
import { SnackbarList } from "./layout/SnackbarList/indes";

interface HeadlessTaskCallbackData {
  taskId: number;
}

// Используется только при наличии у клиента своего api токена
// Функция проверки наличия тревоги за несколько минут до будильника
// Если тревога есть - зпустить регулярную проверку, удалить запланированный будильник
// тревоги нет - оставить будильник
AppRegistry.registerHeadlessTask("AirRaidCheck", () => async (data: HeadlessTaskCallbackData) => {

})

AppRegistry.registerHeadlessTask(
  "AlarmCallback", // имя задачи, которое будет использоваться в сервисе
  () => async (data: HeadlessTaskCallbackData) => {
    console.log("Alarm fired!", data.taskId);

    // Например, вызвать вибрацию
    await AlarmKit.vibrate(2000);
    AlarmKit.showAlarmActivity("Raki");

    // Можно выполнять любую JS-логику здесь
    // Например, отправить уведомление или вызвать API
  }
);

export default function App() {
  const [logMsg, setLog] = useState("log message");

  const onVibratePress = async () => {
    setLog("vibrating...");
    await AlarmKit.vibrate(2000);
    setLog("not vibrating");
  };

  const onPressTest = async () => {
    try {
        await AlarmKit.setAlarmWithCallback(Date.now() + 5000, Date.now())
    } catch (err) {
        setLog("Setting alarm error: "+err);
    }
    setLog("Alarm was set");
  };

  // Settings Modal
  const [settingsModalVisible, setSettingsModalVisible] = React.useState(false);
  const { settings, updateSettings } = useSettings();

  const openSettingsModal = () => {
    setSettingsModalVisible(true);
  }

  const closeSettingsModal = (newSettings: Settings | undefined) => {
    if (newSettings) updateSettings(newSettings);
    setSettingsModalVisible(false);
  }

  // Alarm Modal
  const { alarms, isLoading, clearAlarms, setAlarm, toggleAlarm } = useAlarm();
  const [isEditAlarmModalOpen, setEditAlarmModalOpen] = useState(false);
  const [alarmSettings, setAlarmSettings] = useState<Partial<Alarm>>({});

  const openEditAlarmModal = (alarmId?: number) => {
    alarmId ? setAlarmSettings(alarms[alarmId]) : setAlarmSettings({});
    setEditAlarmModalOpen(true);
  }

  const closeEditAlarmModal = (alarmObj?: { id: number } & Partial<Omit<Alarm, 'id'>>) => {
    if (alarmObj) setAlarm(alarmObj.id, alarmObj);
    setEditAlarmModalOpen(false);
  }

  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { snackbars, showSnackbar, deleteSnackbar } = useSnackbarList();
  

  return (
    <PaperProvider>
      <Appbar.Header>
        <Icon
          source="alarm-light"
          size={28}
        />
        <Appbar.Content title="AirRaidAlarm" />

        <IconButton
          icon="electron-framework"
          size={20}
          onPress={() => setSettingsModalVisible(true)}
        />
        <Button mode="contained" onPress={() => openEditAlarmModal()}>+</Button>
      </Appbar.Header>

      <AlarmList
        alarms={alarms}
        toggleAlarm={toggleAlarm}
        openAlarmModal={openEditAlarmModal}
        showMsg={showSnackbar}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Text>{logMsg}</Text> */}
        {/* <Text>{AlarmKit.hello()}</Text> */}
        <Button onPress={() => {showSnackbar("sdgsdg")}}>pon</Button>

        <EditAlarmModal isOpen={isEditAlarmModalOpen} alarmSettings={alarmSettings} closeModal={closeEditAlarmModal} />

        <SettingsModal
          isVisible={settingsModalVisible}
          settingsObj={settings}
          closeModal={closeSettingsModal}
          clearAlarms={clearAlarms}
          showMsg={showSnackbar}
        />

        <SnackbarList snackbars={snackbars}  deleteSnackbar={deleteSnackbar}/>
      </View>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);