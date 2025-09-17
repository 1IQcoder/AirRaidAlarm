import { Button, Text, View } from "react-native";
import AlarmKit from '@/modules/alarm-kit';
import { useEffect, useState } from "react";
import { AppRegistry } from 'react-native';

const AlarmScreen = () => {
  // const [text, setText] = useState("Ivan rak?");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{"pon"}</Text>
      {/* <Button title="Yes" onPress={() => setText("Ivan Rakal")} /> */}
    </View>
  );
};

AppRegistry.registerComponent("RNActivity", () => AlarmScreen);

interface AlarmCallbackData {
  taskId: number;
}

// AppRegistry.registerHeadlessTask(
//   "AlarmCallback",
//   // TaskProvider: возвращает функцию, которая получает аргументы
//   () => async (data: AlarmCallbackData) => {
//     console.log("Alarm fired!", data.taskId);
//     AlarmKit.vibrate(2000);
//     // здесь твой JS коллбэк
//   }
// );

export default function Index() {
  const [logMsg, setLog] = useState("log message");

  const onVibratePress = async () => {
    setLog("vibrating...");
    await AlarmKit.vibrate(2000);
    setLog("not vibrating");
  }

  const onPressTest = async () => {
    setLog("setted")
    // const taskId = Math.floor(Math.random() * 10000);
    // await AlarmKit.setAlarmWithCallback(Date.now() + 5000, taskId);
    AlarmKit.showActivityWithReactView("RNActivity");
    setLog("setted 1")
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{logMsg}</Text>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>{AlarmKit.hello()}</Text>
      <Button title="Vibrate" onPress={onVibratePress} />
      <Button title="Test Alarm" onPress={onPressTest} />
    </View>
  );
}