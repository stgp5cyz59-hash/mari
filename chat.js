// Основной скрипт мессенджера - ИСПРАВЛЕННЫЙ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Мессенджер загружается...');
    
    // Элементы DOM
    const elements = {
        membersList: document.getElementById('membersList'),
        chatMessages: document.getElementById('chatMessages'),
        messageInput: document.getElementById('messageInput'),
        sendMessage: document.getElementById('sendMessage'),
        voiceMessageBtn: document.getElementById('voiceMessageBtn'),
        emojiBtn: document.getElementById('emojiBtn'),
        emojiPicker: document.getElementById('emojiPicker'),
        emojiGrid: document.getElementById('emojiGrid'),
        quickTemplates: document.getElementById('quickTemplates'),
        replyPreview: document.getElementById('replyPreview'),
        cancelReply: document.getElementById('cancelReply'),
        replyName: document.getElementById('replyName'),
        replyText: document.getElementById('replyText'),
        voiceRecorder: document.getElementById('voiceRecorder'),
        cancelRecording: document.getElementById('cancelRecording'),
        sendRecording: document.getElementById('sendRecording'),
        recorderWaveform: document.getElementById('recorderWaveform'),
        searchMembers: document.getElementById('searchMembers'),
        themeToggle: document.getElementById('themeToggle'),
        onlineCount: document.getElementById('onlineCount'),
        chatTitle: document.getElementById('chatTitle'),
        chatStatus: document.getElementById('chatStatus'),
        newGroup: document.getElementById('newGroup'),
        importantMessages: document.getElementById('importantMessages'),
        mediaGallery: document.getElementById('mediaGallery'),
        classSchedule: document.getElementById('classSchedule')
    };
    
    // Состояние приложения
    const state = {
        currentChat: 'group', // Начинаем с группового чата
        replyingTo: null,
        recording: false,
        recordingTime: 0,
        recordingInterval: null,
        nightTheme: localStorage.getItem('nightTheme') === 'true',
        emojiPickerVisible: false
    };
    
    // Инициализация
    function init() {
        console.log('Инициализация мессенджера...');
        
        // Применяем тему
        applyTheme();
        
        // Загружаем участников (с ГРУППОЙ в начале)
        loadMembers();
        
        // Загружаем чат (групповой по умолчанию)
        loadChat(state.currentChat);
        
        // Загружаем эмодзи
        loadEmojis();
        
        // Назначаем обработчики событий
        setupEventListeners();
        
        // Запускаем симуляцию активности
        simulateActivity();
        
        console.log('Мессенджер готов!');
    }
    
    // Применение темы
    function applyTheme() {
        if (state.nightTheme) {
            document.body.classList.add('night-theme');
            elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Дневная тема</span>';
        } else {
            document.body.classList.remove('night-theme');
            elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Ночная тема</span>';
        }
    }
    
    // Загрузка списка участников
    function loadMembers() {
        const { students, teacher } = chatData;
        
        // Очищаем список
        elements.membersList.innerHTML = '';
        
        // Добавляем ГРУППОВОЙ ЧАТ первым
        const groupElement = createGroupElement();
        elements.membersList.appendChild(groupElement);
        
        // Добавляем учителя
        const teacherElement = createMemberElement(teacher, true);
        elements.membersList.appendChild(teacherElement);
        
        // Добавляем учеников
        students.forEach(student => {
            const member = createMemberElement(student, false);
            elements.membersList.appendChild(member);
        });
        
        // Считаем онлайн
        const onlineCount = students.filter(s => s.online).length + 1; // + учитель
        elements.onlineCount.textContent = ${onlineCount} онлайн;
    }
    
    // Создание элемента группового чата
    function createGroupElement() {
        const div = document.createElement('div');
        div.className = member-card ${state.currentChat === 'group' ? 'active' : ''};
        div.dataset.user = 'group';
        
        div.innerHTML = `
            <div class="member-avatar teacher" style="background: #9B59B6">
                <span><i class="fas fa-users"></i></span>
                <div class="online-dot"></div>
            </div>
            <div class="member-info">
                <h4>Групповой чат <i class="fas fa-comments"></i></h4>
                <p class="member-status">20 участников • Онлайн</p>
            </div>
            <div class="unread-badge">5</div>
        `;
        
        div.addEventListener('click', () => {
            switchChat('group');
            
            // Снимаем активный класс со всех
            document.querySelectorAll('.member-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Добавляем активный класс текущему
            div.classList.add('active');
            
            // Убираем badge
            const badge = div.querySelector('.unread-badge');
            if (badge) badge.remove();
        });
        
        return div;
    }
    
    // Создание элемента участника
    function createMemberElement(user, isTeacher = false) {
        const div = document.createElement('div');
        div.className = member-card ${isTeacher ? 'teacher' : 'student'} ${state.currentChat === user.name.toLowerCase() ? 'active' : ''};
        div.dataset.user = user.name.toLowerCase();
        
        const status = user.online 
            ? 'Онлайн' 
            : Был(а) ${user.lastSeen || 'недавно'};
        
        div.innerHTML = `
            <div class="member-avatar ${isTeacher ? 'teacher' : 'student'}" style="background: ${user.color}">
                <span>${user.avatar}</span>
                ${user.online ? '<div class="online-dot"></div>' : ''}
            </div>
            <div class="member-info">
                <h4>${user.name} ${isTeacher ? '<i class="fas fa-crown"></i>' : ''}</h4>
                <p class="member-status">${status}</p>
            </div>
            ${Math.random() > 0.7 && !isTeacher ? '<div class="unread-badge">' + Math.floor(Math.random() * 5 + 1) + '</div>' : ''}
        `;
        
        div.addEventListener('click', () => {
            switchChat(user.name.toLowerCase());
            
            // Снимаем активный класс со всех
            document.querySelectorAll('.member-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Добавляем активный класс текущему
            div.classList.add('active');
            
            // Убираем badge
            const badge = div.querySelector('.unread-badge');
            if (badge) badge.remove();
        });
        
        return div;
    }
    
    // Переключение чата
    function switchChat(chatId) {
        state.currentChat = chatId;
        
        // Обновляем заголовок чата
        if (chatId === 'teacher') {
            elements.chatTitle.textContent = 'Устаз Тамил';
            elements.chatStatus.textContent = 'Онлайн • Печатает...';
        } else if (chatId === 'group') {
            elements.chatTitle.textContent = 'Групповой чат';
            elements.chatStatus.textContent = '20 участников • Онлайн';
        } else {
            const student = chatData.students.find(s => s.name.toLowerCase() === chatId);
            if (student) {
                elements.chatTitle.textContent = student.name;
                elements.chatStatus.textContent = student.online ? 'Онлайн' : Был(а) ${student.lastSeen || 'недавно'};
            }
        }
        
        // Загружаем сообщения
        loadChat(chatId);
    }
    
    // Загрузка сообщений чата
    function loadChat(chatId) {
        // Очищаем чат
        elements.chatMessages.innerHTML = '<div class="loading">Загрузка сообщений...</div>';
        
        // Получаем сообщения
        let messages = [];
        
        if (chatId === 'group') {
            messages = chatData.messages.group || [];
        } else if (chatId === 'teacher') {
            messages = chatData.messages.teacher || [];
        } else {
            messages = chatData.messages[chatId] || [];
        }
        
        // Очищаем чат и добавляем сообщения
        setTimeout(() => {
            elements.chatMessages.innerHTML = '';
            
            // Группируем по дате
            const groupedMessages = groupMessagesByDate(messages);
            
            // Добавляем сообщения
            Object.keys(groupedMessages).forEach(date => {
                // Добавляем разделитель даты
                if (date === 'today') {
                    addDateDivider('Сегодня');
                } else if (date === 'yesterday') {
                    addDateDivider('Вчера');
                } else {
                    addDateDivider(date);
                }
                
                // Добавляем сообщения
                groupedMessages[date].forEach(msg => {
                    addMessageToChat(msg);
                });
            });
            
            // Прокручиваем вниз
            scrollToBottom();
        }, 300);
    }
    
    // Группировка сообщений по дате
    function groupMessagesByDate(messages) {
        return messages.reduce((groups, message) => {
            const date = message.date || 'today';
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }
    
    // Добавление разделителя даты
    function addDateDivider(text) {
        const divider = document.createElement('div');
        divider.className = 'date-divider';
        divider.innerHTML = <span>${text}</span>;
        elements.chatMessages.appendChild(divider);
    }
    
    // Добавление сообщения в чат
    function addMessageToChat(messageData) {
        const message = createMessageElement(messageData);
        elements.chatMessages.appendChild(message);
        
        // Анимация появления
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Создание элемента сообщения
    function createMessageElement(data) {
        const div = document.createElement('div');
        const isCurrentUser = data.sender === 'current';
        const isTeacher = data.sender === 'teacher';
        
        div.className = message ${isCurrentUser ? 'outgoing' : 'incoming'} ${isTeacher ? 'teacher' : ''};
        div.dataset.id = data.id;
        
        // Аватар (только для входящих сообщений и не в групповом чате)
        let avatar = '';
        if (!isCurrentUser && state.currentChat !== 'group') {
            const sender = isTeacher ? chatData.teacher : 
                         chatData.students.find(s => s.name.toLowerCase() === data.sender);
            const color = sender ? sender.color : '#8a4a5f';
            const avatarText = sender ? sender.avatar : data.sender.charAt(0).toUpperCase();
            
            avatar = <div class="message-avatar" style="background: ${color}">${avatarText}</div>;
        } else if (!isCurrentUser && state.currentChat === 'group') {
            // В групповом чате показываем аватар для всех
            const sender = isTeacher ? chatData.teacher : 
                         chatData.students.find(s => s.name.toLowerCase() === data.sender);
            const color = sender ? sender.color : '#8a4a5f';
            const avatarText = sender ? sender.avatar : data.sender.charAt(0).toUpperCase();
            
            avatar = <div class="message-avatar" style="background: ${color}">${avatarText}</div>;
        }
        
        // Имя отправителя (только для группового чата и входящих)
        let senderName = '';
        if (!isCurrentUser && state.currentChat === 'group') {const sender = isTeacher ? chatData.teacher : 
                         chatData.students.find(s => s.name.toLowerCase() === data.sender);
            senderName = <div class="message-sender">${sender ? sender.name : data.sender} <span class="sender-time">${data.time}</span></div>;
        } else if (isTeacher) {
            senderName = <div class="message-sender">Устаз Тамил <span class="sender-time">${data.time}</span></div>;
        } else if (!isCurrentUser && !isTeacher && state.currentChat !== 'group') {
            const student = chatData.students.find(s => s.name.toLowerCase() === data.sender);
            senderName = <div class="message-sender">${student ? student.name : data.sender} <span class="sender-time">${data.time}</span></div>;
        }
        
        // Текст сообщения
        let messageText = '';
        if (data.type === 'arabic') {
            messageText = `
                <div class="arabic-text">${data.text}</div>
                ${data.translation ? <div class="translation"><em>${data.translation}</em></div> : ''}
            `;
        } else if (data.type === 'audio') {
            messageText = `
                <div class="audio-message">
                    <div class="audio-header">
                        <i class="fas fa-microphone-alt"></i>
                        <span>${data.text}</span>
                    </div>
                    <div class="audio-player">
                        <button class="play-btn"><i class="fas fa-play"></i></button>
                        <div class="audio-waveform">
                            ${generateWaveform()}
                        </div>
                        <span class="duration">${data.duration}</span>
                    </div>
                </div>
            `;
        } else {
            messageText = <div class="message-text">${data.text}</div>;
        }
        
        // Реакции
        let reactions = '';
        if (data.reactions) {
            reactions = `<div class="message-reactions">${Object.entries(data.reactions).map(([emoji, count]) => 
                <span class="reaction" data-emoji="${emoji}">${emoji} <span class="reaction-count">${count}</span></span>
            ).join('')}</div>`;
        }
        
        // Статус прочтения (только для исходящих)
        let status = '';
        if (isCurrentUser) {
            status = `<div class="message-status">
                <i class="fas fa-check${data.read ? '-double seen' : ''}"></i>
            </div>`;
        }
        
        // Время (для исходящих)
        let time = '';
        if (isCurrentUser) {
            time = <div class="message-time">${data.time}</div>;
        }
        
        div.innerHTML = `
            ${avatar}
            <div class="message-content">
                ${senderName}
                ${messageText}
                ${reactions}
            </div>
            ${status}
            ${time}
        `;
        
        div.style.opacity = '0';
        div.style.transform = 'translateY(10px)';
        div.style.transition = 'all 0.3s ease';
        
        // Обработчик клика для меню сообщения
        div.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showMessageMenu(data, div);
        });
        
        // Обычный клик для ответа
        div.addEventListener('click', function(e) {
            if (!e.target.closest('.reaction') && !e.target.closest('.play-btn')) {
                showReplyPreview(data);
            }
        });
        
        // Play кнопка для аудио
        const playBtn = div.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                simulateAudioPlayback(data);
            });
        }
        
        // Реакции
        const reactionElements = div.querySelectorAll('.reaction');
        reactionElements.forEach(reaction => {
            reaction.addEventListener('click', function(e) {
                e.stopPropagation();const emoji = this.dataset.emoji || this.querySelector('span:first-child').textContent;
                addReaction(data.id, emoji);
            });
        });
        
        return div;
    }
    
    // Генерация waveform для аудио
    function generateWaveform() {
        let waveform = '';
        for (let i = 0; i < 20; i++) {
            const height = Math.floor(Math.random() * 30) + 10;
            const delay = i * 0.1;
            waveform += <div class="wave-bar" style="height: ${height}px; animation-delay: ${delay}s;"></div>;
        }
        return waveform;
    }
    
    // Отправка сообщения - ИСПРАВЛЕНА
    function sendMessage() {
        const input = elements.messageInput;
        const text = input.textContent.trim();
        
        if (!text) {
            input.focus();
            return;
        }
        
        // Создаем объект сообщения
        const message = {
            id: Date.now(),
            sender: 'current',
            type: 'text',
            text: text,
            time: getCurrentTime(),
            date: 'today'
        };
        
        // Добавляем сообщение в чат
        addMessageToChat(message);
        
        // Очищаем поле ввода
        input.textContent = '';
        input.focus();
        
        // Скрываем шаблоны
        if (elements.quickTemplates) {
            elements.quickTemplates.style.display = 'none';
        }
        
        // Скрываем предпросмотр ответа если есть
        if (state.replyingTo && elements.replyPreview) {
            elements.replyPreview.style.display = 'none';
            state.replyingTo = null;
        }
        
        // Прокручиваем вниз
        scrollToBottom();
        
        // Симулируем ответ (если это не общий чат)
        if (state.currentChat !== 'group') {
            setTimeout(() => simulateReply(text), 1000 + Math.random() * 2000);
        }
        
        // Анимация отправки
        if (elements.sendMessage) {
            elements.sendMessage.style.transform = 'scale(0.9)';
            setTimeout(() => {
                elements.sendMessage.style.transform = 'scale(1)';
            }, 200);
        }
        
        showToast('Сообщение отправлено!');
    }
    
    // Загрузка эмодзи - ИСПРАВЛЕНА
    function loadEmojis() {
        const emojis = chatData.emojis;
        if (!elements.emojiGrid) return;
        
        elements.emojiGrid.innerHTML = '';
        
        // Показываем все эмодзи из первой категории по умолчанию
        const firstCategory = Object.keys(emojis)[0];
        emojis[firstCategory].forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.dataset.category = firstCategory;
            emojiElement.addEventListener('click', () => insertEmoji(emoji));
            elements.emojiGrid.appendChild(emojiElement);
        });
        
        // Обработчики для категорий
        document.querySelectorAll('.emoji-category').forEach(category => {
            category.addEventListener('click', function() {
                const categoryName = this.dataset.category;
                
                // Убираем активный класс у всех
                document.querySelectorAll('.emoji-category').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Добавляем текущему
                this.classList.add('active');
                
                // Очищаем и добавляем эмодзи выбранной категории
                elements.emojiGrid.innerHTML = '';
                emojis[categoryName].forEach(emoji => {
                    const emojiElement = document.createElement('div');
                    emojiElement.className = 'emoji-item';
                    emojiElement.textContent = emoji;
                    emojiElement.dataset.category = categoryName;
                    emojiElement.addEventListener('click', () => insertEmoji(emoji));
                    elements.emojiGrid.appendChild(emojiElement);
                });
            });
        });
    }
    
    // Вставка эмодзи в поле ввода
    function insertEmoji(emoji) {
        const input = elements.messageInput;
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Вставляем эмодзи в текущую позицию курсора
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        input.focus();
        
        // Скрываем панель эмодзи
        toggleEmojiPicker(false);
    }
    
    // Переключение панели эмодзи
    function toggleEmojiPicker(show) {
        state.emojiPickerVisible = show !== undefined ? show : !state.emojiPickerVisible;
        
        if (elements.emojiPicker) {
            elements.emojiPicker.style.display = state.emojiPickerVisible ? 'block' : 'none';
        }
        
        if (elements.emojiBtn) {
            if (state.emojiPickerVisible) {
                elements.emojiBtn.innerHTML = '<i class="fas fa-times"></i>';
                elements.emojiBtn.title = 'Закрыть эмодзи';
            } else {
                elements.emojiBtn.innerHTML = '<i class="far fa-smile"></i>';
                elements.emojiBtn.title = 'Эмодзи';
            }
        }
    }
    
    // Настройка обработчиков событий - ИСПРАВЛЕНА
    function setupEventListeners() {
        // Отправка сообщения
        if (elements.sendMessage) {
            elements.sendMessage.addEventListener('click', sendMessage);
        }
        
        // Enter для отправки
        if (elements.messageInput) {
            elements.messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
                
                // Показываем/скрываем шаблоны
                if (elements.quickTemplates) {
                    if (this.textContent.trim() === '') {
                        elements.quickTemplates.style.display = 'flex';
                    } else {
                        elements.quickTemplates.style.display = 'none';
                    }
                }
            });
            
            elements.messageInput.addEventListener('input', function() {
                if (elements.quickTemplates) {
                    if (this.textContent.trim() === '') {
                        elements.quickTemplates.style.display = 'flex';
                    } else {
                        elements.quickTemplates.style.display = 'none';
                    }
                }
            });
        }
        
        // Быстрые шаблоны
        if (elements.quickTemplates) {
            elements.quickTemplates.querySelectorAll('.template-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (elements.messageInput) {
                        elements.messageInput.textContent = this.dataset.text;
                        elements.messageInput.focus();
                        elements.quickTemplates.style.display = 'none';
                    }
                });
            });
        }
        
        // Эмодзи
        if (elements.emojiBtn) {
            elements.emojiBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleEmojiPicker();
            });
        }
        
        // Закрытие панели эмодзи при клике вне
        document.addEventListener('click', function(e) {
            if (state.emojiPickerVisible && 
                elements.emojiPicker && 
                !elements.emojiPicker.contains(e.target) && 
                e.target !== elements.emojiBtn) {
                toggleEmojiPicker(false);
            }
        });
        
        // Голосовые сообщения
        if (elements.voiceMessageBtn) {
            elements.voiceMessageBtn.addEventListener('click', startRecording);
        }
        
        if (elements.cancelRecording) {
            elements.cancelRecording.addEventListener('click', stopRecording);
        }
        
        if (elements.sendRecording) {
            elements.sendRecording.addEventListener('click', sendRecording);
        }
        
        // Отмена ответа
        if (elements.cancelReply) {
            elements.cancelReply.addEventListener('click', function() {
                if (elements.replyPreview) {
                    elements.replyPreview.style.display = 'none';
                }
                state.replyingTo = null;
            });
        }
        
        // Поиск участников
        if (elements.searchMembers) {
            elements.searchMembers.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                document.querySelectorAll('.member-card.student').forEach(card => {
                    const name = card.querySelector('h4').textContent.toLowerCase();
                    if (name.includes(searchTerm)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // Переключение темы - ИСПРАВЛЕНО
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', function() {
                state.nightTheme = !state.nightTheme;
                localStorage.setItem('nightTheme', state.nightTheme);
                applyTheme();
                showToast(state.nightTheme ? 'Ночная тема включена' : 'Дневная тема включена');
            });
        }
        
        // Быстрые действия - ПРОСТОЙ РАБОЧИЙ ВАРИАНТ
console.log('Начинаю настройку быстрых действий...');

// 1. Сначала найдем кнопки ПО НОВОМУ
const studyBtn = document.getElementById('studyMaterials');
const homeworkBtn = document.getElementById('homework');
const newGroupBtn = document.getElementById('newGroup');
const importantBtn = document.getElementById('importantMessages');

console.log('Найдены кнопки:', {
    study: !!studyBtn,
    homework: !!homeworkBtn,
    newGroup: !!newGroupBtn,
    important: !!importantBtn
});

// 2. Настроим переходы
if (studyBtn) {
    studyBtn.onclick = function() {
        console.log('Клик на Теория, переход на study.html');
        window.location.href = 'study.html';
    };
}

if (homeworkBtn) {
    homeworkBtn.onclick = function() {
        console.log('Клик на ДЗ, переход на homework.html');
        window.location.href = 'homework.html';
    };
}

// 3. Остальные кнопки
if (newGroupBtn) {
    newGroupBtn.onclick = function() {
        showToast('Создание новой группы...');
    };
}

if (importantBtn) {
    importantBtn.onclick = function() {
        showToast('Показаны важные сообщения');
    };
}

console.log('Быстрые действия настроены!');
        // Действия чата
        document.querySelectorAll('.chat-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i').className;
                showToast(`Действие: ${icon}`);
            });
        });
        
        // Закрытие модального окна по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('messageModal');
                if (modal) modal.classList.remove('active');
                
                if (elements.voiceRecorder) {
                    elements.voiceRecorder.style.display = 'none';
                }
                
                toggleEmojiPicker(false);
            }
        });
    }
    
    // Вспомогательные функции (остаются без изменений)
    function showReplyPreview(messageData) {
        const sender = messageData.sender === 'current' ? 'Вы' : 
                      messageData.sender === 'teacher' ? 'Устаз Тамил' : 
                      chatData.students.find(s => s.name.toLowerCase() === messageData.sender)?.name || messageData.sender;
        
        if (elements.replyName) elements.replyName.textContent = sender;
        if (elements.replyText) elements.replyText.textContent = messageData.text.length > 50 ? 
            messageData.text.substring(0, 50) + '...' : messageData.text;
        
        state.replyingTo = messageData.id;if (elements.replyPreview) {
            elements.replyPreview.style.display = 'block';
        }
        
        if (elements.messageInput) {
            elements.messageInput.focus();
        }
    }
    
    function addReaction(messageId, emoji) {
        const message = document.querySelector(`[data-id="${messageId}"]`);
        if (!message) return;
        
        let reactionsDiv = message.querySelector('.message-reactions');
        if (!reactionsDiv) {
            reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions';
            message.querySelector('.message-content').appendChild(reactionsDiv);
        }
        
        const existingReaction = Array.from(reactionsDiv.children).find(
            child => child.textContent.includes(emoji)
        );
        
        if (existingReaction) {
            const countSpan = existingReaction.querySelector('.reaction-count');
            if (countSpan) {
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
            }
        } else {
            const reaction = document.createElement('span');
            reaction.className = 'reaction';
            reaction.dataset.emoji = emoji;
            reaction.innerHTML = ${emoji} <span class="reaction-count">1</span>;
            reactionsDiv.appendChild(reaction);
            
            reaction.style.transform = 'scale(0)';
            setTimeout(() => {
                reaction.style.transition = 'transform 0.3s ease';
                reaction.style.transform = 'scale(1)';
            }, 10);
            
            reaction.addEventListener('click', function(e) {
                e.stopPropagation();
                this.remove();
            });
        }
        
        showToast(`Добавлена реакция ${emoji}`);
    }
    
    function startRecording() {
        state.recording = true;
        state.recordingTime = 0;
        
        if (elements.voiceRecorder) {
            elements.voiceRecorder.style.display = 'block';
        }
        
        generateRecordingWaveform();
        
        state.recordingInterval = setInterval(() => {
            state.recordingTime++;
            updateRecordingTime();
        }, 1000);
    }
    
    function stopRecording() {
        state.recording = false;
        if (state.recordingInterval) {
            clearInterval(state.recordingInterval);
        }
        if (elements.voiceRecorder) {
            elements.voiceRecorder.style.display = 'none';
        }
    }
    
    function sendRecording() {
        const duration = formatTime(state.recordingTime);
        
        const message = {
            id: Date.now(),
            sender: 'current',
            type: 'audio',
            text: 'Голосовое сообщение',
            duration: duration,
            time: getCurrentTime(),
            date: 'today'
        };
        
        addMessageToChat(message);
        stopRecording();
        scrollToBottom();
        
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: state.currentChat,
                type: 'text',
                text: state.currentChat === 'teacher' ? 
                    "Хорошее чтение! Продолжай в том же духе. ⭐" : 
                    "Круто! Слушала с удовольствием 🎧",
                time: getCurrentTime(),
                date: 'today',
                read: true
            };
            
            addMessageToChat(reply);
            scrollToBottom();
        }, 2000 + Math.random() * 3000);
    }
    
    function generateRecordingWaveform() {
        if (!elements.recorderWaveform) return;
        
        elements.recorderWaveform.innerHTML = '';
        
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            bar.style.setProperty('--i', i);
            elements.recorderWaveform.appendChild(bar);
        }
    }
    
    function updateRecordingTime() {
        const timeElement = document.querySelector('.recording-time');
        if (timeElement) {
            timeElement.textContent = formatTime(state.recordingTime);
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return ${mins}:${secs < 10 ? '0' : ''}${secs};
    }
    
    function getCurrentTime() {
        const now = new Date();
        return ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')};
    }
    
    function scrollToBottom() {
        setTimeout(() => {
            if (elements.chatMessages) {
                elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function simulateActivity() {
        setInterval(() => {
            const randomStudent = chatData.students[Math.floor(Math.random() * chatData.students.length)];
            randomStudent.online = !randomStudent.online;
            randomStudent.lastSeen = 'только что';
            loadMembers();
        }, 30000);
        
        setInterval(() => {
            if (state.currentChat === 'group' && Math.random() > 0.7) {
                const randomStudent = chatData.students[Math.floor(Math.random() * chatData.students.length)];
                const messages = [
                    "Кто сделал упражнение 5?",
                    "Когда контрольная?",
                    "Поделитесь конспектом пожалуйста!",
                    "Всем хорошего дня! ☀️",
                    "Кто идёт на дополнительное занятие?",
                    "Помогите с правилом идгам!",
                    "Завтра все будут на уроке?",
                    "Скиньте фото доски, пожалуйста"
                ];
                
                const message = {
                    id: Date.now(),
                    sender: randomStudent.name.toLowerCase(),
                    type: 'text',
                    text: messages[Math.floor(Math.random() * messages.length)],
                    time: getCurrentTime(),
                    date: 'today'
                };
                
                addMessageToChat(message);
                scrollToBottom();
            }
        }, 45000);
    }
    
    function simulateAudioPlayback(audioData) {
        showToast(`Воспроизведение: ${audioData.text}`);
        
        const message = document.querySelector(`[data-id="${audioData.id}"]`);
        if (message) {
            const waves = message.querySelectorAll('.wave-bar');
            waves.forEach((wave, i) => {
                wave.style.animation = 'wave 1s ease-in-out infinite';
                wave.style.animationDelay = ${i * 0.1}s;
            });
            
            setTimeout(() => {
                waves.forEach(wave => {
                    wave.style.animation = 'none';
                });
            }, 3000);
        }
    }
    
    function simulateReply(toText) {
        const replies = {
            teacher: [
                "Хороший вопрос! Давайте разберём на уроке.",
                "Правильно! Молодец!",
                "Нужно больше практиковать это правило.","Приходи на консультацию, объясню подробнее.",
                "Отличное чтение! Продолжай в том же духе."
            ],
            sabrina: [
                "Спасибо! 😊",
                "Поняла, сделаю!",
                "А ты сам(а) как думаешь?",
                "Давай вместе подготовимся!",
                "Удачи на контрольной! ✨"
            ],
            default: [
                "Ок",
                "Понял(а)",
                "Спасибо!",
                "Интересно...",
                "🤔",
                "Ага",
                "Понятно"
            ]
        };
        
        let replyPool = replies[state.currentChat] || replies.default;
        const replyText = replyPool[Math.floor(Math.random() * replyPool.length)];
        
        const message = {
            id: Date.now(),
            sender: state.currentChat,
            type: 'text',
            text: replyText,
            time: getCurrentTime(),
            date: 'today',
            read: true
        };
        
        addMessageToChat(message);
        scrollToBottom();
    }
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes wave {
            0%, 100% { height: 10px; }
            50% { height: 30px; }
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: var(--color-primary);
            font-family: 'Inter', sans-serif;
        }
        
        .audio-message {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 15px;
            margin-top: 5px;
        }
        
        .audio-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            color: var(--color-primary-dark);
            font-weight: 500;
        }
        
        .audio-player {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .play-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-secondary);
            border: none;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        
        .play-btn:hover {
            transform: scale(1.1);
            background: var(--color-secondary-dark);
        }
        
        .audio-waveform {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 3px;
            height: 40px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            padding: 0 10px;
        }
        
        .duration {
            font-family: 'Inter', monospace;
            font-size: 0.9rem;
            color: var(--color-primary);
            min-width: 45px;
            font-weight: 500;
        }
        
        .translation {
            margin-top: 10px;
            font-style: italic;
            color: var(--color-primary);
            font-size: 0.9rem;
            padding: 8px 12px;
            background: rgba(212, 165, 116, 0.1);
            border-radius: 10px;
            border-left: 3px solid var(--color-secondary);
        }
        
        .wave-bar {
            width: 4px;
            background: var(--color-secondary);
            border-radius: 2px;
            transition: height 0.3s ease;
        }
        
        .toast {
            font-family: 'Inter', sans-serif !important;
        }
    `;
    document.head.appendChild(style);
    
    // Запуск инициализации
    init();
});
// САМЫЙ ПРОСТОЙ СПОСОБ - ДОБАВЬ В КОНЕЦ ФАЙЛА
setTimeout(function() {
    console.log('Проверяю кнопки через 2 секунды...');
    
    const theoryBtn = document.querySelector('#studyMaterials');
    const hwBtn = document.querySelector('#homework');
    
    if (theoryBtn) {
        theoryBtn.onclick = function() {
            window.location = 'study.html';
        };
        console.log('Кнопка Теория настроена');
    }
    
    if (hwBtn) {
        hwBtn.onclick = function() {
            window.location = 'homework.html';
        };
        console.log('Кнопка ДЗ настроена');
    }
}, 2000);