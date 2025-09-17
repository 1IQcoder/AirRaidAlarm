package expo.modules.alarmkit

import android.app.Activity
import android.os.Bundle
import android.view.WindowManager
import android.widget.TextView

class AlarmActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Показываем поверх экрана блокировки
    window.addFlags(
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
      WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
      WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
    )

    val message = intent.getStringExtra("message") ?: "Alarm!"

    val textView = TextView(this).apply {
      text = message
      textSize = 30f
      setPadding(40, 40, 40, 40)
    }

    setContentView(textView)
  }
}
