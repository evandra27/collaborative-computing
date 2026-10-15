const mqtt = require('mqtt');

// Konfigurasi koneksi MQTT Broker (dapat disesuaikan jika menggunakan broker lokal/halaman cloud)
const client = mqtt.connect('mqtt://broker.hivemq.com');

const TOPIC_TRASHCAN = 'smarttrashcan/data';
const MAX_HEIGHT_CM = 100; // Tinggi maksimal tempat sampah (kosong = 100 cm, penuh = 0 cm)

client.on('connect', () => {
    console.log('Sensor Smart Trash Can terhubung ke MQTT Broker.');

    // Simulasi pembacaan data sensor ultrasonik setiap 5 detik
    setInterval(() => {
        // Simulasi jarak sensor ke sampah dalam cm (misal: antara 5 cm hingga 100 cm)
        const distanceCm = Math.floor(Math.random() * (MAX_HEIGHT_CM - 5)) + 5;
        
        // Menghitung persentase kapasitas sampah
        let fillPercentage = Math.round(((MAX_HEIGHT_CM - distanceCm) / MAX_HEIGHT_CM) * 100);
        if (fillPercentage < 0) fillPercentage = 0;
        if (fillPercentage > 100) fillPercentage = 100;

        // Menentukan status tempat sampah
        let status = 'Aman';
        if (fillPercentage >= 80) {
            status = 'Hampir Penuh';
        } 
        if (fillPercentage >= 95) {
            status = 'Penuh';
        }

        // Payload data sensor dalam bentuk JSON
        const payload = JSON.stringify({
            trashcanId: 'TrashCan-01',
            distanceCm: distanceCm,
            fillPercentage: fillPercentage,
            status: status,
            timestamp: new Date().toISOString()
        });

        // Mempublikasikan data ke topik MQTT
        client.publish(TOPIC_TRASHCAN, payload, () => {
            console.log(`[SENSOR DATA SENT]: ${payload}`);
        });
    }, 5000);
});

client.on('error', (err) => {
    console.error('Koneksi sensor error:', err);
});