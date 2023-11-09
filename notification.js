window.onload = () => {
    'use strict';

    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission()
            .then(function(permission) {
                if (permission === 'granted') {
                    // console.log('notification permission granted.');
                    alert('Terima kasih sudah menerima notifikasi!');
                } else {
                    alert('Yahhh, notifikasi diblokir.');
                    // console.warn('notification permission denied.');
                }
            });
    }
}