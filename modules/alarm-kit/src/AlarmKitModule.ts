import { NativeModule, requireNativeModule } from 'expo';

import { AlarmKitModuleEvents } from './AlarmKit.types';

declare class AlarmKitModule extends NativeModule<AlarmKitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  setAlarm(timeInMillis: number, message: string): Promise<number>;
  cancelAlarm(id: number): Promise<void>;

  vibrate(duration: number): Promise<void>;

  /**
   * Устанавливает будильник, который разбудит приложение даже если оно закрыто,
   * и вызовет Headless JS коллбэк в JS.
   * @param timeInMillis Время срабатывания в миллисекундах
   * @param taskId Уникальный идентификатор задачи
   */
  setAlarmWithCallback(timeInMillis: number, taskId: number): Promise<number>;

  showAlarmActivity(message: string): Promise<void>;
  showActivityWithReactView(componentName: string): Promise<void>;

}

// This call loads the native module object from the JSI.
export default requireNativeModule<AlarmKitModule>('AlarmKit');
