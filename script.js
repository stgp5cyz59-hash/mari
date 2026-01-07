// ===== ИНИЦИАЛИЗАЦИЯ =====
// ДЕБАГ - проверка что есть на странице
console.log("=== ДЕБАГ СТРАНИЦЫ ===");
console.log("Все section:", document.querySelectorAll('section').length);
console.log("Все элементы с классом:", {
    'choice-cards': document.querySelector('.choice-cards'),
    'path-section': document.querySelector('.path-section'),
    'cta-button': document.querySelector('.cta-button'),
    'startJourney': document.getElementById('startJourney')
});

// Покажем все ID на странице
const allIds = [];
document.querySelectorAll('[id]').forEach(el => allIds.push(el.id));
console.log("Все ID на странице:", allIds);

// Покажем все классы с 'choice' или 'path'
const allClasses = [];
document.querySelectorAll('[class]').forEach(el => {
    el.className.split(' ').forEach(cls => {
        if (cls.includes('choice')  cls.includes('path')  cls.includes('card')) {
            allClasses.push(cls);
        }
    });
});
console.log("Классы с choice/path/card:", [...new Set(allClasses)]);
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 MA'RIFA загружен");
    initNavigation();
    initAnimations();
    initScrollEffects();
    initButtonEffects();
    
    // Предзагрузка изображения
    preloadBackgroundImage();
});

// ===== ПРЕДЗАГРУЗКА ФОНА =====
function preloadBackgroundImage() {
    const img = new Image();
    img.src = 'images/nebo11.jpg';
    
    img.onload = function() {
        console.log('✅ Фоновое изображение загружено');
        document.body.classList.add('image-loaded');
    };
    
    img.onerror = function() {
        console.log('❌ Ошибка загрузки фона');
        document.querySelector('.background-image').style.background = 
            'linear-gradient(135deg, var(--color-overlay) 0%, var(--color-overlay-light) 100%)';
    };
}

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    console.log("🔧 Инициализация навигации...");
    
    const menuToggle = document.getElementById('menuToggle');
    const startJourney = document.getElementById('startJourney');
    
    // Полумесяц
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const crescent = this.querySelector('.crescent-shape');
            crescent.style.transform = 'rotate(180deg)';
            crescent.style.boxShadow = 'inset 5px 0 0 0 var(--color-secondary)';
            
            setTimeout(() => {
                crescent.style.transform = 'rotate(0deg)';
                crescent.style.boxShadow = 'inset -5px 0 0 0 var(--color-white)';
            }, 300);
        });
    }
    
    // КНОПКА "НАЧАТЬ ОБУЧЕНИЕ" - ИСПРАВЛЕННАЯ ВЕРСИЯ
    if (startJourney) {
        console.log('🎯 Кнопка "Начать обучение" найдена');
        
        startJourney.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🖱️ Нажата кнопка "Начать обучение"');
            
            // Анимация кнопки
            this.style.transform = 'scale(0.95)';
            createButtonParticles(this);
            
            // Плавный скролл к карточкам выбора
            setTimeout(() => {
                // Ищем карточки выбора
                const choiceCards = document.querySelector('.choice-cards');
                const pathSection = document.querySelector('.path-section');
                
                console.log('choiceCards:', choiceCards);
                console.log('pathSection:', pathSection);
                
                const targetElement = choiceCards || pathSection;
                
                if (targetElement) {
                    console.log('📍 Нашли цель для скролла');
                    
                    // РАСЧЁТ ИДЕАЛЬНОЙ ПОЗИЦИИ
                    const elementRect = targetElement.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const currentScroll = window.pageYOffset;
                    
                    // Настройка: насколько выше от нижнего края экрана (в пикселях)
                    // МЕНЯЙ ЭТО ЧИСЛО ДЛЯ РЕГУЛИРОВКИ ВЫСОТЫ:
                    const PX_FROM_BOTTOM = 180; // ← 180px от нижнего края экрана
                    
                    // Формула: позиция элемента - высота окна + высота элемента + отступ
                    const targetScroll = elementRect.top + currentScroll - 
                                         windowHeight + elementRect.height + PX_FROM_BOTTOM;
                    
                    console.log(`📏 Параметры:`);
                    console.log(`- Высота окна: ${windowHeight}px`);
                    console.log(`- Высота элемента: ${elementRect.height}px`);
                    console.log(`- Отступ снизу: ${PX_FROM_BOTTOM}px`);
                    console.log(`- Целевой скролл: ${Math.round(targetScroll)}px`);
                    
                    // Плавный скролл
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });// Подсказка для отладки
                    console.log(`🎯 Карточки будут показаны в ${PX_FROM_BOTTOM}px от нижнего края экрана`);
                    console.log(`💡 Чтобы изменить высоту, поменяй PX_FROM_BOTTOM на другое число`);
                    
                } else {
                    console.log('❌ Не нашли карточки, скроллим вниз');
                    window.scrollBy({
                        top: 800,
                        behavior: 'smooth'
                    });
                }
                
                this.style.transform = 'scale(1)';
            }, 200);
        });
    } else {
        console.log('❌ Кнопка "Начать обучение" не найдена!');
    }
    
    // Эффект навигации при скролле
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.2)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
            nav.style.backdropFilter = 'blur(15px)';
            nav.style.boxShadow = 'none';
        }
    });
}

// ===== АНИМАЦИИ =====
function initAnimations() {
    console.log("✨ Запуск анимаций...");
    
    // Появление элементов с задержкой
    const elementsToAnimate = [
        '.arabic-title-container',
        '.latin-title-container',
        '.slogan-container',
        '.cta-container'
    ];
    
    elementsToAnimate.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 300 + 500);
        }
    });
    
    // Анимация звёзд
    animateStars();
    animateOrnaments();
}

function animateStars() {
    const stars = document.querySelectorAll('.floating-star');
    if (!stars.length) return;
    
    setInterval(() => {
        stars.forEach(star => {
            if (Math.random() > 0.7) {
                star.animate([
                    { opacity: 0.3, transform: 'scale(1)' },
                    { opacity: 1, transform: 'scale(2)' },
                    { opacity: 0.3, transform: 'scale(1)' }
                ], {
                    duration: 1000,
                    easing: 'ease-in-out'
                });
            }
        });
    }, 2000);
}

function animateOrnaments() {
    const ornaments = document.querySelectorAll('.arabic-ornament');
    if (!ornaments.length) return;
    
    setInterval(() => {
        ornaments.forEach(ornament => {
            if (Math.random() > 0.8) {
                ornament.animate([
                    { opacity: 0.1, transform: 'rotate(0deg)' },
                    { opacity: 0.4, transform: 'rotate(180deg)' },
                    { opacity: 0.1, transform: 'rotate(360deg)' }
                ], {
                    duration: 2000,
                    easing: 'ease-in-out'
                });
            }
        });
    }, 3000);
}

// ===== ЭФФЕКТЫ ПРИ СКРОЛЛЕ =====
function initScrollEffects() {
    // Параллакс фона
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const backgroundImage = document.querySelector('.background-image');
        
        if (backgroundImage) {
            const yPos = scrolled * 0.3;
            backgroundImage.style.transform = translateY(${yPos}px);
        }
        
        // Появление секций
        const contentSection = document.querySelector('.content-section');
        if (contentSection) {
            const sectionRect = contentSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (sectionRect.top < windowHeight * 0.8) {
                contentSection.style.opacity = '1';
                contentSection.style.transform = 'translateY(0)';
            }
        }
    });
    
    // Инициализация секций
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
        contentSection.style.opacity = '0';
        contentSection.style.transform = 'translateY(30px)';
        contentSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
}

// ===== ЭФФЕКТЫ КНОПОК =====
function initButtonEffects() {
    // Главная кнопка
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
            this.style.borderColor = 'var(--color-secondary)';
            
            for (let i = 0; i < 5; i++) {
                createButtonParticle(this);
            }
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
    }
    
    // Карточки фич
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) icon.style.transform = 'scale(1.15) rotate(15deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) icon.style.transform = 'scale(1.1) rotate(10deg)';
        });
    });
    
    // Карточки выбора
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
    });
}

// ===== ЧАСТИЦЫ =====
function createButtonParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'button-particle';
        
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--color-secondary-light);
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            z-index: 1000;
            pointer-events: none;
            filter: blur(0.5px);
            opacity: 0;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
            { transform: translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0), opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => particle.remove(), 600);
    }
}

function createButtonParticle(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particle = document.createElement('div');
    particle.className = 'button-particle';
    
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: var(--color-secondary-light);
        border-radius: 50%;
        left: ${centerX}px;
        top: ${centerY}px;
        z-index: 1000;
        pointer-events: none;
        filter: blur(0.5px);
        opacity: 0;
    `;
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 10;
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;
    
    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 0.6 },
        { transform: translate(${targetX - centerX}px, ${targetY - centerY}px) scale(0), opacity: 0 }
    ], {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    setTimeout(() => particle.remove(), 400);
}

// ===== CSS ДЛЯ ЧАСТИЦ =====
const style = document.createElement('style');
style.textContent = `
    .button-particle {
        animation: particleFade 0.6s ease-out forwards;
    }
    
    @keyframes particleFade {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(style);

// ===== ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ =====
setInterval(() => {
    const arabicTitle = document.querySelector('.arabic-title');
    if (arabicTitle && Math.random() > 0.7) {
        arabicTitle.animate([
            { textShadow: '0 2px 20px rgba(0, 0, 0, 0.4), 0 4px 40px rgba(138, 74, 95, 0.3)' },
            { textShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 8px 60px rgba(138, 74, 95, 0.4)' },
            { textShadow: '0 2px 20px rgba(0, 0, 0, 0.4), 0 4px 40px rgba(138, 74, 95, 0.3)' }
        ], {
            duration: 2000,
            easing: 'ease-in-out'
        });
    }
}, 5000);

// ===== СОЗДАНИЕ ДЕКОРАТИВНЫХ ЭЛЕМЕНТОВ =====
function createFallingStars() {
    const container = document.getElementById('fallingStars');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'falling-star';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDuration = (3 + Math.random() * 5) + 's';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.backgroundColor = rgba(245, 213, 166, ${0.5 + Math.random() * 0.5});
        container.appendChild(star);
    }
}

function createFloatingParticles() {
    const container = document.getElementById('floatingParticles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
        container.appendChild(particle);
    }
}

// ===== ФИНАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ =====
window.addEventListener('load', function() {
    console.log("🌈 Все ресурсы загружены");
    
    createFallingStars();
    createFloatingParticles();
    
    // Проверка авторизации
    const user = JSON.parse(localStorage.getItem('marifa_currentUser'));
    if (user) {
        console.log(`👋 Добро пожаловать, ${user.name}!`);
        
        // Можно добавить кастомное поведение для авторизованных
        const startButton = document.getElementById('startJourney');
        if (startButton && user.role === 'student') {
            startButton.innerHTML = '<i class="fas fa-graduation-cap"></i> Продолжить обучение';
        }
    }
    
    console.log("✅ MA'RIFA полностью готов!");
});

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function debugScroll() {
    console.log('=== ДЕБАГ СКРОЛЛА ===');
    const choiceCards = document.querySelector('.choice-cards');
    if (choiceCards) {
        const rect = choiceCards.getBoundingClientRect();
        console.log('Позиция .choice-cards:');
        console.log('- top:', rect.top, 'px от верха окна');
        console.log('- height:', rect.height, 'px');
        console.log('- bottom:', rect.bottom, 'px от верха окна');
        console.log('- pageYOffset:', window.pageYOffset, 'px');
        console.log('- window.innerHeight:', window.innerHeight, 'px');
    }
}

// Экспортируем для отладки
window.debugMarifa = {
    debugScroll,
    getUser: () => JSON.parse(localStorage.getItem('marifa_currentUser')),
    getStats: () => JSON.parse(localStorage.getItem('marifa_study_progress') || '{}')
};