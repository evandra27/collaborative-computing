const mqtt = require('mqtt');

// Konfigurasi koneksi ke MQTT Broker yang sama dengan sensor
const client = mqtt.connect('mqtt://broker.hivemq.com');

const TOPIC_TRASHCAN = 'smarttrashcan/data';

client.on('connect', () => {
    console.log('Subscriber Smart Trash Can terhubung ke MQTT Broker.');
    
    // Mendaftarkan diri ke topik Smart Trash Can
    client.subscribe(TOPIC_TRASHCAN, (err) => {
        if (!err) {
            console.log(`Berhasil subscribe ke topik: ${TOPIC_TRASHCAN}\n`);
        } else {
            console.error('Gagal subscribe ke topik:', err);
        }
    });
});

// Menangani pesan data yang masuk dari sensor
client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());

        console.log(`--- UPDATE DARI ${data.trashcanId} ---`);
        console.log(`Jarak Terdeteksi : ${data.distanceCm} cm`);
        console.log(`Kapasitas Terisi : ${data.fillPercentage}%`);
        console.log(`Status           : ${data.status}`);
        console.log(`Waktu            : ${data.timestamp}`);

        // Peringatan otomatis jika tempat sampah penuh
        if (data.fillPercentage >= 80) {
            console.log(`⚠️ WARNING: Tempat sampah ${data.trashcanId} ${data.status}! Segera kosongkan.`);
        }
        console.log('------------------------------------\n');

    } catch (error) {
        console.error('Format data tidak valid:', message.toString());
    }
});

client.on('error', (err) => {
    console.error('Koneksi subscriber error:', err);
});