var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BHV3jXkNgP3fO8RdbPB-K5y2tIMZYrgfshFOD9FrxFfMOa_MGoFTZuV7KOI1vQYRP3lyA8Kd2tPDmfUqyMTTtqI",
   "privateKey": "67iAibPoW5Ezht0q-1a4Qe4KXmCKE5SGaxClZE8WHPY"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/djbaQdrC7Tw:APA91bGDfpppRNiwLPasS_ae95TeIhD0LYWGxsCIizD8OF4ekT3VmzosHH26Elk2DlLayuGUyM8--_He5eR98st2y0IaEHYIGC1XKHm27omyT0er8cIz4gJQRXDkaEGaKcuH2lTUvYTF",
   "keys": {
       "p256dh": "BNYMgICSahSBsVB64N6R+oaBI2Ce4PHLBh9x69Mp466SL1s56FZGcX9Hl7hhWviFkzUZKEuzEtQKTEOy7WaLza4=",
       "auth": "4Yk5Z2mpouAul7xdzAC3jQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '256098475565',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);