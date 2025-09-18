package expo.modules.alarmkit

import android.app.Activity
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class AlarmActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Флаги для показа поверх блокировки и включения экрана
    window.addFlags(
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
      WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
      WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
    )

    val message = intent.getStringExtra("message") ?: "Alarm!"

    // Основной вертикальный контейнер
    val rootLayout = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.MATCH_PARENT
      )
      setPadding(40, 40, 40, 40)
    }

    // Заголовок сверху
    val textView = TextView(this).apply {
      text = message
      textSize = 30f
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        0,
        2f // занимает 2 части от всего вертикального пространства
      )
    }

    // Контейнер для кнопок снизу
    val buttonLayout = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        0,
        1f // занимает 1 часть вертикального пространства
      )
    }

    val snoozeButton = Button(this).apply {
      text = "Отложить"
      setOnClickListener {
        // логика отложить
        finish() // закрываем активити
      }
    }

    val stopButton = Button(this).apply {
      text = "Остановить"
      setOnClickListener {
        // логика остановить
        finish() // закрываем активити
      }
    }

    buttonLayout.addView(snoozeButton)
    buttonLayout.addView(stopButton)

    rootLayout.addView(textView)
    rootLayout.addView(buttonLayout)

    setContentView(rootLayout)
  }
}
