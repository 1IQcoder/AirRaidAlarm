import { AlarmTime } from "@/types/alarm";
type TimeArr = [number, number];

// input example: 19:09
export const validateTime = (timeText: string) => {
    if (timeText.length > 5 || timeText[2] != ":") {
        return "Incorrect time format.\nTime Format must be like 15:30";
    }
    const timeArrText = timeText.split(":");
    const timeArr: TimeArr = [Number(timeArrText[0]), Number(timeArrText[1])];
    if (Number(timeArr[0]) < 0 || Number(timeArr[0]) > 23) {
        return "hours incorrect";
    }
    if (Number(timeArr[1]) < 0 || Number(timeArr[1]) > 59) {
        return "minutes incorrect";
    }
    return timeArr;
}

const calcNewDate = (timeArr: TimeArr): Date => {
    const newDate = new Date();
    newDate.setHours(timeArr[0], timeArr[1], 0, 0);
    if (new Date() <= newDate) newDate.setDate(newDate.getDate() + 1);
    return newDate;
}

export const dateToTimestamp = (date: Date): number => {
    return date.getHours()*60 + date.getMinutes();
}

export const getTimeDiff = (targetDate: Date, from: Date = new Date()): { hours: number, minutes: number } => {
    const tm = dateToTimestamp(targetDate);
    const fm = dateToTimestamp(from);
    let rm = 0; // result minutes
    let hours = 0;
    let minutes = 0;

    rm = tm-fm;
    if (rm < 0) rm = 1440-fm+tm;
    hours = Math.trunc(rm / 60);
    minutes = rm % 60;

    return { hours: hours, minutes: minutes };
}

export const getTimeObj = (time: TimeArr) => {
    const newDate = calcNewDate(time);

    const newTimeObj: AlarmTime = {
        text: `${time[0]}:${time[1]}`,
        date: newDate,
        dateString: newDate.toISOString(),
        timeStamp: dateToTimestamp(newDate),
    }
    return newTimeObj;
}