// Открытие/закрытие модалки
const authModal = document.getElementById('authModal');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const closeBtn = document.querySelector('.close');

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('authTitle').textContent = 'Вход';
    authModal.style.display = 'block';
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('authTitle').textContent = 'Регистрация';
    authModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// Закрытие при клике вне окна
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Обработка формы
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Форма отправлена! (В реальном проекте здесь будет AJAX-запрос)');
    authModal.style.display = 'none';
});
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = {
        id: Date.now().toString(),
        name: e.target.elements[0].value,
        email: e.target.elements[1].value,
        skills: [],
        rating: 5.0
    };

    // Сохраняем пользователя (позже заменим на Firebase)
    localStorage.setItem('user', JSON.stringify(user));
    alert('Регистрация успешна!');
    window.location.href = 'profile.html';  // Перенаправляем в профиль
});
// Временные данные
const mySkills = [
    { id: 1, title: "Обучение JavaScript", category: "programming" },
    { id: 2, title: "Консультации по SEO", category: "marketing" }
];

function renderMySkills() {
    const list = document.getElementById('mySkills');
    list.innerHTML = '';

    mySkills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <h4>${skill.title}</h4>
            <span class="category">${skill.category}</span>
            <button class="delete-btn" data-id="${skill.id}">Удалить</button>
        `;
        list.appendChild(item);
    });
}

// Добавление навыка
document.getElementById('addSkillBtn').addEventListener('click', () => {
    const title = prompt("Название навыка:");
    const category = prompt("Категория:");
    if (title && category) {
        mySkills.push({ id: Date.now(), title, category });
        renderMySkills();
    }
});

// Удаление навыка
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        const index = mySkills.findIndex(skill => skill.id === id);
        if (index !== -1) {
            mySkills.splice(index, 1);
            renderMySkills();
        }
    }
});

// Первая загрузка
renderMySkills();

// Данные из localStorage (временное решение)
let skills = [];

// Загрузка данных
function loadSkills() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    skills = [];
    
    users.forEach(user => {
        if (user.skills) {
            user.skills.forEach(skill => {
                skills.push({
                    ...skill,
                    userName: user.name,
                    userId: user.id,
                    userRating: user.rating || 5.0
                });
            });
        }
    });
    
    renderSkills(skills);
}

// Отрисовка карточек
function renderSkills(skillsToRender) {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = '';
    
    skillsToRender.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.dataset.category = skill.category;
        card.innerHTML = `
            <h3>${skill.title}</h3>
            <p>${skill.description || 'Нет описания'}</p>
            <div class="skill-meta">
                <span class="user">${skill.userName} • ★${skill.userRating.toFixed(1)}</span>
                <span class="category">${skill.category}</span>
            </div>
            <button class="button" onclick="startChat('${skill.userId}')">Предложить обмен</button>
        `;
        grid.appendChild(card);
    });
}

// Фильтрация
document.getElementById('categoryFilter').addEventListener('change', filterSkills);
document.getElementById('searchInput').addEventListener('input', filterSkills);

function filterSkills() {
    const category = document.getElementById('categoryFilter').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = skills.filter(skill => {
        const matchesCategory = category === 'all' || skill.category === category;
        const matchesSearch = skill.title.toLowerCase().includes(searchText) || 
                            (skill.description && skill.description.toLowerCase().includes(searchText));
        return matchesCategory && matchesSearch;
    });
    
    renderSkills(filtered);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    
    // Выход из аккаунта
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

// Для чата (заглушка)
function startChat(userId) {
    alert(`Чат с пользователем ${userId} будет реализован позже!`);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // 1. Получаем всех пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 2. Ищем пользователя
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 3. Сохраняем текущего пользователя
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 4. Перенаправляем в профиль
            window.location.href = 'profile.html';
        } else {
            alert('Неверный email или пароль');
        }
    });
});

