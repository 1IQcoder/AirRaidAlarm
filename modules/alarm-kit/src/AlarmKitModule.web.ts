import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './AlarmKit.types';

type AlarmKitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class AlarmKitModule extends NativeModule<AlarmKitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(AlarmKitModule, 'AlarmKitModule');
