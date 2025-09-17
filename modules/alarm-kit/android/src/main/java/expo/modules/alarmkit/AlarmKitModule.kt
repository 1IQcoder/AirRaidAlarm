package expo.modules.alarmkit

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

// Vabration
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

import expo.modules.alarmkit.ReactViewActivity

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import java.util.*

class AlarmKitModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('AlarmKit')` in JavaScript.
    Name("AlarmKit")

    // Defines constant property on the module.
    Constant("PI") {
      Math.PI
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello raks! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    AsyncFunction("setAlarm") { timeInMillis: Long, message: String ->
      val context = appContext.reactContext ?: throw Exception("No React context")
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      val id = System.currentTimeMillis().toInt()
      val intent = Intent(context, AlarmReceiver::class.java).apply {
        putExtra("id", id)
        putExtra("message", message)
      }
      val pendingIntent = PendingIntent.getBroadcast(
        context,
        id,
        intent,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      )

      alarmManager.setExactAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP,
        timeInMillis,
        pendingIntent
      )

      return@AsyncFunction id
    }

    // 👉 Отмена будильника
    AsyncFunction("cancelAlarm") { id: Int ->
      val context = appContext.reactContext ?: throw Exception("No React context")
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      val intent = Intent(context, AlarmReceiver::class.java)
      val pendingIntent = PendingIntent.getBroadcast(
        context,
        id,
        intent,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      )

      alarmManager.cancel(pendingIntent)
    }

    AsyncFunction("vibrate") { duration: Long ->
      val context = appContext.reactContext ?: throw Exception("No React context")

      // Для Android 12+ используем VibratorManager
      val vibrator = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
        val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vm.defaultVibrator
      } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      }

      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(duration)
      }
    }

    AsyncFunction("setAlarmWithCallback") { timeInMillis: Long, taskId: Int ->
      val context = appContext.reactContext ?: throw Exception("No React context")
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

      val intent = Intent(context, AlarmReceiver::class.java).apply {
          putExtra("taskId", taskId)
      }

      val pendingIntent = PendingIntent.getBroadcast(
          context,
          taskId,
          intent,
          PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      )

      alarmManager.setExactAndAllowWhileIdle(
          AlarmManager.RTC_WAKEUP,
          timeInMillis,
          pendingIntent
      )

      return@AsyncFunction taskId
    }

    AsyncFunction("showAlarmActivity") { message: String ->
      val context = appContext.reactContext ?: throw Exception("No React context")
      val intent = Intent(context, AlarmActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        putExtra("message", message)
      }
      context.startActivity(intent)
    }

    AsyncFunction("showActivityWithReactView") { componentName: String ->
      val context = appContext.reactContext ?: throw Exception("No React context")

      val intent = Intent(context, ReactViewActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        putExtra(ReactViewActivity.EXTRA_COMPONENT_NAME, componentName)
      }

      context.startActivity(intent)
    }
  }
}
