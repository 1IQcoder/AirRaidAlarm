package expo.modules.alarmkit

import android.os.Bundle
import com.facebook.react.ReactActivity

class ReactViewActivity : ReactActivity() {
  companion object {
    const val EXTRA_COMPONENT_NAME = "componentName"
  }

  private var componentNameFromIntent: String? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    componentNameFromIntent = intent.getStringExtra(EXTRA_COMPONENT_NAME)
  }

  override fun getMainComponentName(): String? {
    return componentNameFromIntent ?: "main"
  }
}