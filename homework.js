// homework.js - Логика для страницы домашних заданий

console.log("📚 MA'RIFA - Домашние задания загружены");

// Данные заданий (в реальном проекте будут приходить с сервера)
const assignmentsData = [
    {
        id: 1,
        type: "homework",
        title: "Правила Нун Сакина",
        description: "Прочитать суру Ан-Нас и найти все примеры Нун Сакина с их правилами (Идгам, Ихфа, Изхар).",
        status: "checked",
        dateAssigned: "2024-01-10",
        dateDue: "2024-01-17",
        grade: 9,
        maxGrade: 10,
        teacherComment: "Отличная работа! Все примеры найдены верно. Обрати внимание на правильное произношение при Ихфе.",
        teacherAudio: null,
        attachments: ["task1.pdf", "audio1.mp3"]
    },
    {
        id: 2,
        type: "test",
        title: "Тест по махраджу",
        description: "Определить махрадж для букв: ق, ك, ج, ش. Записать аудио с правильным произношением.",
        status: "pending",
        dateAssigned: "2024-01-12",
        dateDue: "2024-01-19",
        grade: null,
        maxGrade: 15,
        teacherComment: null,
        teacherAudio: null,
        attachments: ["test2.pdf"]
    },
    {
        id: 3,
        type: "homework",
        title: "Атрибуты букв (Сыфат)",
        description: "Разделить все буквы на тяжёлые и лёгкие. Привести по 2 примера на каждую тяжёлую букву.",
        status: "resubmit",
        dateAssigned: "2024-01-08",
        dateDue: "2024-01-15",
        grade: 6,
        maxGrade: 10,
        teacherComment: "Нужно исправить классификацию букв خ и غ. Они относятся к тяжёлым. Пересмотри теорию и отправь исправленную работу.",
        teacherAudio: "comment3.mp3",
        attachments: ["task3.pdf"]
    },
    {
        id: 4,
        type: "exam",
        title: "Контрольная №1",
        description: "Полный разбор правил чтения первой джуз. Теория + практическое чтение.",
        status: "error",
        dateAssigned: "2024-01-05",
        dateDue: "2024-01-12",
        grade: 4,
        maxGrade: 20,
        teacherComment: "Много ошибок в правилах мадда. Рекомендую перечитать теорию и записаться на консультацию.",
        teacherAudio: null,
        attachments: ["exam4.pdf", "feedback4.pdf"]
    },
    {
        id: 5,
        type: "test",
        title: "Тест по гуне",
        description: "Определить типы гуны в указанных аятах и объяснить правила их применения.",
        status: "checked",
        dateAssigned: "2024-01-03",
        dateDue: "2024-01-10",
        grade: 14,
        maxGrade: 15,
        teacherComment: "Превосходно! Только один мелкий недочёт в определении гуны назир.",
        teacherAudio: "comment5.mp3",
        attachments: ["test5.pdf"]
    },
    {
        id: 6,
        type: "homework",
        title: "Чтение суры Аль-Фатиха",
        description: "Записать аудио чтения суры Аль-Фатиха с соблюдением всех правил таджвида.",
        status: "pending",
        dateAssigned: "2024-01-14",
        dateDue: "2024-01-21",
        grade: null,
        maxGrade: 10,
        teacherComment: null,
        teacherAudio: null,
        attachments: ["task6.pdf"]
    },
    {
        id: 7,
        type: "exam",
        title: "Контрольная №2",
        description: "Анализ правил вакф и ибтида. Практическое применение при чтении.",
        status: "checked",
        dateAssigned: "2023-12-20",
        dateDue: "2023-12-27",
        grade: 18,
        maxGrade: 20,
        teacherComment: "Хорошая работа. Особенно хорошо разобраны правила вакф аль-хасан.",
        teacherAudio: null,
        attachments: ["exam7.pdf"]
    },
    {
        id: 8,
        type: "homework",
        title: "Разбор хамзат аль-васыль",
        description: "Найти в суре Аль-Бакара все примеры хамзат аль-васыль и объяснить правила их чтения.",
        status: "error",
        dateAssigned: "2023-12-15",
        dateDue: "2023-12-22",
        grade: 3,
        maxGrade: 10,
        teacherComment: "Неправильно определены условия чтения хамзы. Основная теория не усвоена.",
        teacherAudio: "comment8.mp3",
        attachments: ["task8.pdf"]
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем домашние задания...');
    
    initSidebar();
    initFilters();
    renderAssignments('all');
    initModal();
    initProgressCircles();
    
    // Анимация появления
    setTimeout(() => {
        document.querySelector('.loading-state').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-state').style.display = 'none';
        }, 300);
    }, 1000);
});

// ===== БОКОВАЯ ПАНЕЛЬ =====
function initSidebar() {
    console.log('Инициализация боковой панели...');
    
    const menuItems = document.querySelectorAll('.menu-item[data-filter]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Добавляем текущему
            this.classList.add('active');
            
            // Получаем фильтр
            const filter = this.getAttribute('data-filter');
            
            // Меняем заголовок
            updateHeaderTitle(filter);
            
            // Рендерим задания
            renderAssignments(filter);
            
            // Анимация
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = 'translateX(0)';
            }, 200);
        });
    });
    
    // Навигационные ссылки (без фильтрации)
    const navLinks = document.querySelectorAll('.menu-item.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Просто переход по ссылке, ничего не фильтруем
            console.log('Переход на:', this.href);
        });
    });
}

// ===== ФИЛЬТРЫ =====
function initFilters() {
    console.log('Инициализация фильтров...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Добавляем текущему
            this.classList.add('active');
            
            // Получаем фильтр
            const filter = this.getAttribute('data-filter');
            
            // Анимация
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Обновляем отображение (если нужно)
            if (filter !== 'all') {
                // Для демо просто показываем сообщение
                showNotification(`Показаны: ${getFilterLabel(filter)}`);
            }
        });
    });
}

function getFilterLabel(filter) {
    const labels = {
        'all': 'Все задания',
        'recent': 'Недавние задания',
        'important': 'Важные задания'
    };
    return labels[filter] || filter;
}

// ===== РЕНДЕРИНГ ЗАДАНИЙ =====
function renderAssignments(filter = 'all') {
    console.log(`Рендерим задания с фильтром: ${filter}`);
    
    const container = document.getElementById('assignmentsContainer');
    if (!container) {
        console.error('Контейнер заданий не найден!');
        return;
    }
    
    // Фильтруем задания
    let filteredAssignments = assignmentsData;
    
    if (filter !== 'all') {
        filteredAssignments = assignmentsData.filter(assignment => {
            if (filter === 'checked') return assignment.status === 'checked';
            if (filter === 'pending') return assignment.status === 'pending';
            if (filter === 'resubmit') return assignment.status === 'resubmit';
            if (filter === 'errors') return assignment.status === 'error';
            if (filter === 'tests') return assignment.type === 'test';
            if (filter === 'exams') return assignment.type === 'exam';return true;
        });
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Обновляем счетчик
    updateAssignmentsCount(filteredAssignments.length);
    
    if (filteredAssignments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Заданий нет</h3>
                <p>В этом разделе пока нет заданий</p>
            </div>
        `;
        return;
    }
    
    // Рендерим каждое задание
    filteredAssignments.forEach(assignment => {
        const card = createAssignmentCard(assignment);
        container.appendChild(card);
    });
    
    // Анимация появления
    setTimeout(() => {
        const cards = container.querySelectorAll('.assignment-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 50);
}

function createAssignmentCard(assignment) {
    const card = document.createElement('div');
    card.className = assignment-card ${assignment.type} ${assignment.status};
    card.setAttribute('data-id', assignment.id);
    
    // Статус текстом
    const statusText = {
        'checked': 'Проверено',
        'pending': 'На проверке',
        'resubmit': 'Пересдача',
        'error': 'С ошибками'
    }[assignment.status] || assignment.status;
    
    // Иконка типа
    const typeIcon = {
        'homework': 'fa-book-open',
        'test': 'fa-question-circle',
        'exam': 'fa-clipboard-check'
    }[assignment.type] || 'fa-file-alt';
    
    // Форматируем даты
    const dueDate = new Date(assignment.dateDue).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
    
    const assignedDate = new Date(assignment.dateAssigned).toLocaleDateString('ru-RU');
    
    // Оценка или статус
    let gradeHTML = '';
    if (assignment.grade !== null) {
        gradeHTML = `
            <div class="assignment-grade">
                <div class="grade-label">Оценка</div>
                <div class="grade-value">
                    ${assignment.grade}<span class="grade-max">/${assignment.maxGrade}</span>
                </div>
            </div>
        `;
    }
    
    // Кнопки действий
    let actionButtons = '';
    if (assignment.status === 'pending') {
        actionButtons = `
            <button class="action-btn btn-view" onclick="viewAssignment(${assignment.id})">
                <i class="fas fa-eye"></i> Просмотр
            </button>
            <button class="action-btn btn-submit" onclick="submitAssignment(${assignment.id})">
                <i class="fas fa-paper-plane"></i> Сдать
            </button>
        `;
    } else if (assignment.status === 'resubmit') {
        actionButtons = `
            <button class="action-btn btn-view" onclick="viewAssignment(${assignment.id})">
                <i class="fas fa-eye"></i> Комментарий
            </button>
            <button class="action-btn btn-redo" onclick="resubmitAssignment(${assignment.id})">
                <i class="fas fa-redo"></i> Исправить
            </button>
        `;
    } else {
        actionButtons = `
            <button class="action-btn btn-view" onclick="viewAssignment(${assignment.id})">
                <i class="fas fa-eye"></i> Подробнее
            </button>
        `;
    }
    
    card.innerHTML = `
        <div class="assignment-header">
            <div class="assignment-type">
                <div class="type-icon">
                    <i class="fas ${typeIcon}"></i>
                </div>
                <div class="type-info">
                    <h4>${assignment.type === 'homework' ? 'Домашнее задание' : 
                          assignment.type === 'test' ? 'Тест' : 'Контрольная работа'}</h4>
                    <h3>${assignment.title}</h3>
                </div>
            </div>
            <div class="assignment-status status-${assignment.status}">
                ${statusText}
            </div>
        </div>
        
        <div class="assignment-details">
            <p>${assignment.description}</p>
        </div>
        
        <div class="assignment-meta">
            <div class="meta-item">
                <i class="far fa-calendar-plus"></i>
                <span>Выдано: ${assignedDate}</span>
            </div>
            <div class="meta-item">
                <i class="far fa-calendar-check"></i>
                <span>Сдать до: ${dueDate}</span>
            </div>
        </div>
        
        ${gradeHTML}
        
        <div class="assignment-actions">
            ${actionButtons}
        </div>
    `;
    
    return card;
}

// ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
function updateAssignmentsCount(count) {
    const countElement = document.querySelector('.assignments-count');
    if (countElement) {
        countElement.textContent = ${count} ${getRussianPlural(count, ['задание', 'задания', 'заданий'])};
    }
}

function updateHeaderTitle(filter) {
    const titles = {
        'checked': { arabic: 'الواجبات المُصحَّحة', latin: 'Проверенные задания' },
        'pending': { arabic: 'الواجبات تحت التصحيح', latin: 'Задания на проверке' },
        'resubmit': { arabic: 'واجبات إعادة التسليم', latin: 'Пересдача заданий' },
        'errors': { arabic: 'الواجبات بالأخطاء', latin: 'Задания с ошибками' },
        'tests': { arabic: 'الاختبارات', latin: 'Тесты' },
        'exams': { arabic: 'الامتحانات', latin: 'Контрольные работы' },
        'all': { arabic: 'الواجبات المنزلية', latin: 'Все задания' }
    };
    
    const title = titles[filter] || titles['all'];
    const arabicTitle = document.querySelector('.arabic-title');
    const latinTitle = document.querySelector('.latin-title');
    
    if (arabicTitle) arabicTitle.textContent = title.arabic;
    if (latinTitle) latinTitle.textContent = title.latin;
}

// ===== МОДАЛЬНОЕ ОКНО =====
function initModal() {
    console.log('Инициализация модального окна...');
    
    const modal = document.getElementById('assignmentModal');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Закрытие по крестику
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function viewAssignment(id) {
    console.log(`Просмотр задания ID: ${id}`);
    
    const assignment = assignmentsData.find(a => a.id === id);
    if (!assignment) {
        showNotification('Задание не найдено', 'error');
        return;
    }
    
    const modal = document.getElementById('assignmentModal');
    const modalBody = document.getElementById('modalBody');
    
    // Форматируем даты
    const dueDate = new Date(assignment.dateDue).toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const assignedDate = new Date(assignment.dateAssigned).toLocaleDateString('ru-RU');
    
    // Статус текстом
    const statusText = {
        'checked': 'Проверено',
        'pending': 'Ожидает проверки',
        'resubmit': 'Требуется пересдача',
        'error': 'Содержит ошибки'
    }[assignment.status] || assignment.status;
    
    // Тип задания
    const typeText = {
        'homework': 'Домашнее задание',
        'test': 'Тест',
        'exam': 'Контрольная работа'
    }[assignment.type] || 'Задание';
    
    // Комментарий учителя
    let teacherCommentHTML = '';
    if (assignment.teacherComment) {
        teacherCommentHTML = `
            <div class="teacher-comment"><h4><i class="fas fa-chalkboard-teacher"></i> Комментарий учителя</h4>
                <div class="comment-content">
                    <div class="comment-text">
                        <p>${assignment.teacherComment}</p>
                    </div>
                    ${assignment.teacherAudio ? `
                    <div class="comment-audio">
                        <button class="audio-btn" onclick="playAudio('${assignment.teacherAudio}')">
                            <i class="fas fa-play-circle"></i> Прослушать голосовой комментарий
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Вложения
    let attachmentsHTML = '';
    if (assignment.attachments && assignment.attachments.length > 0) {
        attachmentsHTML = `
            <div class="assignment-attachments">
                <h4><i class="fas fa-paperclip"></i> Прикреплённые файлы</h4>
                <div class="attachments-list">
                    ${assignment.attachments.map(file => `
                        <a href="#" class="attachment-item" onclick="downloadFile('${file}')">
                            <i class="fas ${getFileIcon(file)}"></i>
                            <span>${file}</span>
                            <i class="fas fa-download"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Кнопки действий
    let actionButtonsHTML = '';
    if (assignment.status === 'pending') {
        actionButtonsHTML = `
            <div class="modal-actions">
                <button class="modal-btn btn-primary" onclick="submitAssignment(${assignment.id})">
                    <i class="fas fa-paper-plane"></i> Отправить на проверку
                </button>
                <button class="modal-btn btn-secondary" onclick="askQuestion(${assignment.id})">
                    <i class="fas fa-question-circle"></i> Задать вопрос
                </button>
            </div>
        `;
    } else if (assignment.status === 'resubmit') {
        actionButtonsHTML = `
            <div class="modal-actions">
                <button class="modal-btn btn-primary" onclick="resubmitAssignment(${assignment.id})">
                    <i class="fas fa-redo"></i> Отправить исправленную работу
                </button>
                <button class="modal-btn btn-secondary" onclick="requestHelp(${assignment.id})">
                    <i class="fas fa-hands-helping"></i> Запросить помощь
                </button>
            </div>
        `;
    }
    
    // Заполняем модальное окно
    modalBody.innerHTML = `
        <div class="modal-assignment">
            <!-- Заголовок -->
            <div class="modal-header">
                <div class="modal-type-badge">
                    <i class="fas ${assignment.type === 'homework' ? 'fa-book-open' : 
                                   assignment.type === 'test' ? 'fa-question-circle' : 'fa-clipboard-check'}"></i>
                    <span>${typeText}</span>
                </div>
                <div class="modal-status-badge status-${assignment.status}">
                    ${statusText}
                </div>
            </div>
            
            <!-- Название -->
            <h2 class="modal-title">${assignment.title}</h2>
            
            <!-- Детали -->
            <div class="modal-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Дата выдачи:</span>
                    <span class="detail-value">${assignedDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Срок сдачи:</span>
                    <span class="detail-value">${dueDate}</span>
                </div>
                ${assignment.grade !== null ? `
                <div class="detail-item">
                    <span class="detail-label">Оценка:</span><span class="detail-value grade-${assignment.grade >= assignment.maxGrade * 0.8 ? 'good' : 
                                                     assignment.grade >= assignment.maxGrade * 0.6 ? 'medium' : 'poor'}">
                        ${assignment.grade}/${assignment.maxGrade}
                    </span>
                </div>
                ` : ''}
            </div>
            
            <!-- Описание -->
            <div class="modal-description">
                <h3><i class="fas fa-align-left"></i> Описание задания</h3>
                <p>${assignment.description}</p>
            </div>
            
            ${teacherCommentHTML}
            ${attachmentsHTML}
            ${actionButtonsHTML}
        </div>
    `;
    
    // Показываем модальное окно
    modal.classList.add('active');
    
    // Добавляем стили для модального окна
    addModalStyles();
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getRussianPlural(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'fa-file-pdf';
    if (ext === 'mp3' || ext === 'wav') return 'fa-file-audio';
    if (ext === 'jpg'  ext === 'png'  ext === 'gif') return 'fa-file-image';
    return 'fa-file';
}

function initProgressCircles() {
    console.log('Инициализация кругов прогресса...');
    
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach(circle => {
        const percent = circle.getAttribute('data-percent');
        circle.style.background = conic-gradient(var(--hw-primary) 0% ${percent}%, #eee ${percent}% 100%);
    });
}

function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = hw-notification notification-${type};
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                        type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function addModalStyles() {
    // Добавляем стили для модального окна, если их ещё нет
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-assignment {
                font-family: 'Inter', sans-serif;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .modal-type-badge {
                background: rgba(138, 74, 95, 0.1);
                padding: 8px 15px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--hw-primary);
                font-weight: 500;
            }
            
            .modal-status-badge {
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .modal-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: 2rem;
                color: var(--hw-primary-dark);
                margin-bottom: 25px;
            }
            
            .modal-details-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                background: rgba(138, 74, 95, 0.05);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 30px;
            }
            
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid rgba(138, 74, 95, 0.1);
            }
            
            .detail-item:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                color: var(--hw-text-light);
                font-size: 0.9rem;
            }
            
            .detail-value {
                color: var(--hw-text);
                font-weight: 600;
                font-size: 1rem;
            }
            
            .grade-good { color: #4CAF50; }
            .grade-medium { color: #FF9800; }
            .grade-poor { color: #F44336; }
            
            .modal-description {
                margin-bottom: 30px;
            }
            
            .modal-description h3 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.3rem;
                color: var(--hw-primary-dark);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .modal-description p {
                line-height: 1.6;
                color: var(--hw-text);
                font-size: 1rem;
            }
            
            .teacher-comment {
                background: rgba(212, 165, 116, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid rgba(212, 165, 116, 0.2);
            }
            
            .teacher-comment h4 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                color: var(--hw-primary-dark);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .comment-text p {
                line-height: 1.6;
                color: var(--hw-text);
                font-size: 1rem;
                margin-bottom: 15px;
            }
            
            .audio-btn {
                background: var(--hw-primary);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 12px;
                font-family: 'Inter', sans-serif;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
            }
            
            .audio-btn:hover {
                background: var(--hw-primary-dark);
                transform: translateY(-2px);
            }
            
            .assignment-attachments {
                margin-bottom: 30px;
            }
            
            .assignment-attachments h4 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                color: var(--hw-primary-dark);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .attachments-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .attachment-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: rgba(138, 74, 95, 0.05);
                border-radius: 12px;
                text-decoration: none;color: var(--hw-text);
                transition: all 0.3s ease;
                border: 1px solid transparent;
            }
            
            .attachment-item:hover {
                background: rgba(138, 74, 95, 0.1);
                border-color: var(--hw-primary-light);
                transform: translateX(5px);
            }
            
            .attachment-item i:first-child {
                font-size: 1.2rem;
                color: var(--hw-primary);
                width: 24px;
            }
            
            .attachment-item span {
                flex: 1;
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
            }
            
            .attachment-item i:last-child {
                color: var(--hw-primary-light);
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid var(--hw-border);
            }
            
            .modal-btn {
                flex: 1;
                padding: 15px;
                border-radius: 12px;
                font-family: 'Inter', sans-serif;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
                border: none;
            }
            
            .btn-primary {
                background: var(--hw-primary);
                color: white;
            }
            
            .btn-primary:hover {
                background: var(--hw-primary-dark);
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(138, 74, 95, 0.3);
            }
            
            .btn-secondary {
                background: rgba(138, 74, 95, 0.1);
                color: var(--hw-primary);
                border: 1px solid rgba(138, 74, 95, 0.3);
            }
            
            .btn-secondary:hover {
                background: rgba(138, 74, 95, 0.2);
            }
            
            .hw-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--hw-primary);
            }
            
            .hw-notification.show {
                transform: translateX(0);
            }
            
            .notification-error {
                border-left-color: var(--hw-status-error);
            }
            
            .notification-success {
                border-left-color: var(--hw-status-checked);
            }
            
            .hw-notification i {
                font-size: 1.2rem;
            }
            
            .notification-error i {
                color: var(--hw-status-error);
            }
            
            .notification-success i {
                color: var(--hw-status-checked);
            }
            
            .hw-notification span {
                font-family: 'Inter', sans-serif;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== ФУНКЦИИ ДЕЙСТВИЙ =====
function submitAssignment(id) {
    console.log(`Сдача задания ID: ${id}`);
    showNotification('Задание отправлено на проверку!', 'success');
    
    // В реальном проекте здесь будет отправка на сервер
    setTimeout(() => {
        document.getElementById('assignmentModal').classList.remove('active');
    }, 1500);
}function resubmitAssignment(id) {
    console.log(`Пересдача задания ID: ${id}`);
    showNotification('Исправленная работа отправлена', 'success');
    
    // В реальном проекте здесь будет отправка на сервер
    setTimeout(() => {
        document.getElementById('assignmentModal').classList.remove('active');
    }, 1500);
}

function askQuestion(id) {
    console.log(`Вопрос по заданию ID: ${id}`);
    showNotification('Вопрос отправлен учителю');
    
    // Перенаправляем в чат
    setTimeout(() => {
        window.location.href = 'class.html';
    }, 1000);
}

function requestHelp(id) {
    console.log(`Запрос помощи по заданию ID: ${id}`);
    showNotification('Запрос на помощь отправлен');
}

function playAudio(filename) {
    console.log(`Воспроизведение аудио: ${filename}`);
    showNotification('Аудио комментарий воспроизводится...');
    
    // В реальном проекте здесь будет воспроизведение аудио
    // new Audio(`/audio/${filename}`).play();
}

function downloadFile(filename) {
    console.log(`Скачивание файла: ${filename}`);
    showNotification(`Файл "${filename}" скачивается...`);
    
    // В реальном проекте здесь будет скачивание файла
    // window.open(`/files/${filename}`, '_blank');
}

// ===== ЭКСПОРТ ДЛЯ ОТЛАДКИ =====
window.homeworkDebug = {
    assignments: assignmentsData,
    renderAssignments,
    viewAssignment,
    showNotification
};

console.log('✅ Homework модуль готов!');