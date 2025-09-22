import { ToggleAlarmFn } from "@/hooks/useAlarm";
import { AlarmsMap } from "@/hooks/useAlarm";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { AlarmItem } from "../AlarmListItem";
import { ShowSnackbarFn } from "@/hooks/useSnackbarList";

type AlarmListProps = {
  alarms: AlarmsMap,
  toggleAlarm: ToggleAlarmFn,
  openAlarmModal: (id?: number) => void,
  showMsg: ShowSnackbarFn,
}

const AlarmList: React.FC<AlarmListProps> = ({
  alarms, toggleAlarm, openAlarmModal, showMsg
}) => {
  return (
    <View style={styles.container}>
        {
          Object.values(alarms).length > 0 ? (
            Object.values(alarms).map((alarm) => (
              <AlarmItem
                key={alarm.id}
                alarm={alarm}
                toggleAlarm={toggleAlarm}
                openAlarmModal={openAlarmModal}
                showMsg={showMsg}
              />
            ))
          ) : (
            <Text>Тут поки нічого немає</Text>
          )
        }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    // backgroundColor: COLORS.SECONDARY_BACKGROUND,
    width: "100%",
    alignItems: "center",
  }
})

export default AlarmList;