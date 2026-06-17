const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'bookings.json');

// Настройки безопасности и парсинга JSON
app.use(cors());
app.use(express.json());

// Раздача статических файлов фронтенда (HTML, CSS, JS), если они лежат в той же папке
app.use(express.static(__dirname));

// Вспомогательная функция для чтения данных из файла-БД
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
}

// Вспомогательная функция для записи данных в файл-БД
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 1. GET-эндпоинт: Получить все бронирования из базы данных
app.use('/api/bookings', (req, res, next) => {
    if (req.method === 'GET') {
        try {
            const bookings = readData();
            return res.json(bookings);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при чтении базы данных" });
        }
    }
    next();
});

// 2. POST-эндпоинт: Создать новое бронирование и сохранить его в БД
app.use('/api/bookings', (req, res, next) => {
    if (req.method === 'POST') {
        try {
            const { client, productName, totalCost, days } = req.body;

            // Валидация входных данных на стороне сервера
            if (!client || !productName || !totalCost || !days) {
                return res.status(400).json({ message: "Все поля обязательны к заполнению" });
            }

            const bookings = readData();
            
            const newBooking = {
                id: Date.now(), // Уникальный ID на основе времени
                client,
                productName,
                totalCost,
                days,
                createdAt: new Date().toISOString()
            };

            bookings.push(newBooking);
            writeData(bookings);

            return res.status(201).json({ message: "Бронирование успешно сохранено", booking: newBooking });
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при сохранении в базу данных" });
        }
    }
    next();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Сервер QAZREST успешно запущен!`);
    console.log(` URL локального сервера: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
