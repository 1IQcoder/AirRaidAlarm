import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import android.content.Intent

class AlarmHeadlessTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val taskId = intent?.getIntExtra("taskId", -1) ?: -1

        // создаем WritableMap
        val params: WritableMap = Arguments.createMap().apply {
            putInt("taskId", taskId)
        }

        return HeadlessJsTaskConfig(
            "AlarmCallback",  // имя JS задачи
            params,
            5000,             // таймаут в мс
            true              // allow while app killed
        )
    }
}
