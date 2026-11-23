import { Alert, Platform } from 'react-native';

// Alert.alert does nothing on web, so fall back to the browser's dialogs there.
export function showAlert(title, message, buttons) {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const list = buttons || [];

  if (list.length <= 1) {
    window.alert(text);
    if (list[0] && list[0].onPress) list[0].onPress();
    return;
  }

  // OK runs the last button; Cancel runs the "cancel" button (or the first one).
  const ok = list[list.length - 1];
  const cancel = list.find((b) => b.style === 'cancel') || list[0];
  const confirmed = window.confirm(text);
  const chosen = confirmed ? ok : cancel;
  if (chosen && chosen.onPress) chosen.onPress();
}
