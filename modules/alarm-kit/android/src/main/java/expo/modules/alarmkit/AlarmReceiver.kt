package expo.modules.alarmkit

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat

import expo.modules.alarmkit.AlarmHeadlessTaskService

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val taskId = intent.getIntExtra("taskId", -1)
        val serviceIntent = Intent(context, AlarmHeadlessTaskService::class.java)
        serviceIntent.putExtra("taskId", taskId)

        // Запуск Headless JS Service
        ContextCompat.startForegroundService(context, serviceIntent)
    }
}
