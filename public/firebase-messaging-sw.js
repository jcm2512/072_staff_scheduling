// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUwpC91bzct8dexj8NBvhWJ-v_nsxIcx8",
  authDomain: "shiftori.firebaseapp.com",
  projectId: "shiftori",
  storageBucket: "shiftori.firebasestorage.app",
  messagingSenderId: "77806310535",
  appId: "1:77806310535:web:6b4f0d31f97a04d9b79422",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
