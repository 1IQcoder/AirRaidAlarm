import React, { useState } from "react";
import { View, Text, Button, AppRegistry } from "react-native";
import AlarmKit from "@/modules/alarm-kit";

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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{logMsg}</Text>
      <Text>{AlarmKit.hello()}</Text>
      <Button title="Vibrate" onPress={onVibratePress} />
      <Button title="Поставить будильник" onPress={onPressTest} />
    </View>
  );
}
