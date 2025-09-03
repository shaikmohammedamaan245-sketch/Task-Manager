// src/notifications.js

// Ask user for browser notification permission
export function askNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// Show a notification with a title and body
export function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
