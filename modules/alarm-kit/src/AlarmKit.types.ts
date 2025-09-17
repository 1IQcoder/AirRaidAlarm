export type ChangeEventPayload = {
  value: string;
};

export type AlarmEventPayload = { id: number; message: string };

export type AlarmKitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onAlarm: (event: AlarmEventPayload) => void;
};