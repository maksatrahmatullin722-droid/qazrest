// Автоматически подставляем имя вошедшего юзера при загрузке страницы, если оно есть в сессии
if (document.getElementById('clientName')) {
    document.getElementById('clientName').value = localStorage.getItem('currentSession') || "";
}

// Выход из системы
function logout() {
    localStorage.removeItem('currentSession');
    // Обнуляем поля ввода авторизации
    document.getElementById('loginUser').value = "";
    document.getElementById('loginPass').value = "";
    // Переключаем экраны обратно
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('appContent').style.display = 'none';
}

let activeProduct = { name: "", price: 0 };

const db = {
    "Tree Of Life": {
        category: "Базы отдыха",
        img: "https://edge.travelatacdn.ru/thumbs/640x480/upload/2020_38/content_hotel_5f67c0faa6a551.43553606.jpg",
        price: 39600,
        desc: 'Пляжный курорт Tree Of Life расположен на побережье Каспийского моря в 25 километрах от города Актау. Прекрасный вариант для комфортного отдыха.'
    },
    "Bluemarine Aqtau": {
        category: "Базы отдыха",
        img: "https://www.lada.kz/uploads/posts/2017-05/1496058229_sanset.jpg",
        price: 45000,
        desc: 'Комфортабельная база отдыха Bluemarine в Актау на самом побережье.'
    },
    "FREEDOM Beach&resort": {
        category: "Базы отдыха",
        img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/343249189.jpg?k=61949dbd89ecddeff5023c35c86ee03ecc813b7dbb97866ee51a67c7699defcc&o=",
        price: 34000,
        desc: 'Современный комплекс отдыха Freedom на побережье Капшагайского водохранилища.'
    },
    "Горный поход Кок Жайляу": {
        category: "Туры",
        img: "https://gorny-club.kz/wp-content/uploads/2016/10/9IZeMkHNYe64dm73Ec1zFlI0Lx2GLB-1.jpg",
        price: 5000,
        desc: 'Популярный и невероятно живописный пеший маршрут в Иле-Алатауском национальном парке Алматы.'
    },
    "Треккинг Ущелье Чукур": {
        category: "Туры",
        img: "https://avatars.mds.yandex.net/i?id=d9d31c01b6061b598c5d1cf540c7983f_l-2286743-images-thumbs&n=13",
        price: 7000,
        desc: 'Увлекательный поход по живописным горным тропам ущелья Чукур.'
    },
    "Санаторий Салма-Караван": {
        category: "Оздоровительный отдых",
        img: "https://img02.flagma.kz/photo/sanatoriy-saryagash-salma-karavan-3161813_big.jpg",
        price: 10000,
        desc: 'Современный оздоровительный санаторий в знаменитой курортной минеральной зоне Сарыагаш.'
    }
};

function scrollToSection(key) {
    const el = document.getElementById('sec-' + key);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function showItemDetails(name) {
    const item = db[name];
    if (!item) return;

    activeProduct.name = name;
    activeProduct.price = item.price;

    document.getElementById('itemTitle').innerText = name;
    document.getElementById('itemDesc').innerText = item.desc;
    document.getElementById('itemMainImg').src = item.img;

    let locationText = "📍 Алматинская область";
    if (name.includes("Life") || name.includes("Bluemarine")) locationText = "📍 Мангистауская область";
    if (name.includes("Санаторий")) locationText = "📍 Туркестанская область";
    document.getElementById('itemLoc').innerText = locationText;

    document.getElementById('catalogPage').style.display = "none";
    document.getElementById('detailsPage').style.display = "block";
    window.scrollTo(0, 0);
}

function backToCatalog() {
    document.getElementById('catalogPage').style.display = "block";
    document.getElementById('detailsPage').style.display = "none";
    window.scrollTo(0, 0);
}

const form = document.getElementById('orderForm');
const tableBody = document.getElementById('reportEntries');

if (form) {
    form.onsubmit = function(e) {
        e.preventDefault();
        const client = document.getElementById('clientName').value;
        const t1 = new Date(document.getElementById('dateStart').value);
        const t2 = new Date(document.getElementById('dateEnd').value);

        const diffHours = (t2 - t1) / (1000 * 60 * 60);
        if (diffHours <= 0) {
            alert("Конец брони должен быть позже начала!");
            return;
        }

        const cost = Math.ceil(diffHours) * activeProduct.price;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 10px; border: 1px solid #ddd;">${client}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${activeProduct.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${cost.toLocaleString()} ₸</strong></td>
        `;
        
        tableBody.appendChild(row);
        form.reset();
        document.getElementById('clientName').value = localStorage.getItem('currentSession');
        
        alert("Успешно оформлено!");
        backToCatalog();
    };
}
