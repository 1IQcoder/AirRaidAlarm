// Reexport the native module. On web, it will be resolved to AlarmKitModule.web.ts
// and on native platforms to AlarmKitModule.ts
export { default } from './src/AlarmKitModule';
export * from  './src/AlarmKit.types';
