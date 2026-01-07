// auth.js - Логика регистрации и входа

console.log("🔧 auth.js загружен");

// Простая функция для "хеширования" пароля (для демо)
function simpleHash(password) {
  return btoa(password); // Просто кодируем в base64 для демо
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 Страница загружена");

  // 1. Обработка выбора роли (Ученик/Учитель)
  const roleButtons = document.querySelectorAll(".role-btn");
  const levelSection = document.getElementById("levelSection");

  if (roleButtons.length > 0) {
    roleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Убираем активный класс у всех
        roleButtons.forEach((btn) => btn.classList.remove("active"));
        // Добавляем текущей кнопке
        this.classList.add("active");

        // Показываем/скрываем выбор уровня
        const role = this.getAttribute("data-role");
        if (levelSection) {
          if (role === "student") {
            levelSection.style.display = "block";
          } else {
            levelSection.style.display = "none";
          }
        }
      });
    });
  }

  // 2. Обработка формы регистрации
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    console.log("✅ Форма регистрации найдена");

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Отменяем стандартную отправку

      // Собираем данные
      const formData = {
        name: this.querySelector('input[type="text"]').value.trim(),
        email: this.querySelector('input[type="email"]').value.trim(),
        password: this.querySelectorAll('input[type="password"]')[0].value,
        confirmPassword: this.querySelectorAll('input[type="password"]')[1]
          .value,
        role:
          document
            .querySelector(".role-btn.active")
            ?.getAttribute("data-role") || "student",
        level: this.querySelector("select")?.value || null,
      };

      // ВАЛИДАЦИЯ
      // 1. Проверка паролей
      if (formData.password !== formData.confirmPassword) {
        showMessage("❌ Пароли не совпадают!", "error");
        return;
      }

      // 2. Длина пароля
      if (formData.password.length < 6) {
        showMessage("❌ Пароль должен быть минимум 6 символов", "error");
        return;
      }

      // 3. Проверка email
      if (!isValidEmail(formData.email)) {
        showMessage("❌ Введите корректный email", "error");
        return;
      }

      // 4. Проверка уровня (для ученика)
      if (formData.role === "student" && !formData.level) {
        showMessage("❌ Выберите ваш уровень подготовки", "error");
        return;
      }

      // ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ - СОХРАНЯЕМ

      // Получаем существующих пользователей
      let users = JSON.parse(localStorage.getItem("marifa_users") || "[]");

      // Проверяем, нет ли уже такого email
      const existingUser = users.find((u) => u.email === formData.email);
      if (existingUser) {
        showMessage("❌ Пользователь с таким email уже существует", "error");
        return;
      }

      // Создаём нового пользователя
      const newUser = {
        id: Date.now(), // уникальный ID
        name: formData.name,
        email: formData.email,
        password: simpleHash(formData.password), // "хешируем"
        role: formData.role,
        level: formData.level,
        registeredAt: new Date().toISOString(),
        onboarded: false, // ещё не проходил онбординг
      };

      // Добавляем в массив
      users.push(newUser);

      // Сохраняем в localStorage
      localStorage.setItem("marifa_users", JSON.stringify(users));

      // Сохраняем текущего пользователя для сессии
      localStorage.setItem(
        "marifa_currentUser",
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
      );
      // ь редирект для учителя
      if (userData.role === "teacher") {
        window.location.href = "teacher-dashboard.html";
        return;
      }

      console.log("✅ Пользователь сохранён:", newUser);

      // Показываем успех
      showMessage("✅ Аккаунт успешно создан!", "success");

      // Меняем кнопку
      const submitBtn = this.querySelector(".submit-btn");
      if (submitBtn) {
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Успешно!';
        submitBtn.style.background =
          "linear-gradient(135deg, #4CAF50, #2E7D32)";

        // Переход через 2 секунды
        setTimeout(() => {
          window.location.href = "onboarding.html";
        }, 2000);

        // Возвращаем кнопку через 1.5 сек (на всякий случай)
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = "";
        }, 1500);
      }
    });
  }

  // 3. Создаём тестовых пользователей если их нет
  initializeTestUsers();
});

// Функция показа сообщения
function showMessage(text, type = "info") {
  // Создаём элемент если его нет
  let messageDiv = document.getElementById("authMessage");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "authMessage";
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-family: 'Inter', sans-serif;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
    document.body.appendChild(messageDiv);

    // Добавляем анимацию
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);
  }

  // Устанавливаем цвет в зависимости от типа
  if (type === "error") {
    messageDiv.style.background = "linear-gradient(135deg, #f44336, #d32f2f)";
  } else if (type === "success") {
    messageDiv.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
  } else {
    messageDiv.style.background = "linear-gradient(135deg, #2196F3, #1976D2)";
  }

  messageDiv.textContent = text;

  // Автоскрытие через 5 секунд
  setTimeout(() => {
    messageDiv.style.animation = "slideIn 0.3s ease reverse";
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 300);
  }, 5000);
}

// Проверка email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Создаём тестовых пользователей если localStorage пустой
function initializeTestUsers() {
  const users = JSON.parse(localStorage.getItem("marifa_users") || "[]");

  if (users.length === 0) {
    const testUsers = [
      {
        id: 1,
        name: "Айша Рахимова",
        email: "student@marifa.ru",
        password: simpleHash("student123"),
        role: "student",
        level: "beginner",
        registeredAt: new Date().toISOString(),
        onboarded: true,
      },
      {
        id: 2,
        name: "Устаз Ахмад",
        email: "teacher@marifa.ru",
        password: simpleHash("teacher123"),
        role: "teacher",
        registeredAt: new Date().toISOString(),
        onboarded: true,
        experience: "10 лет преподавания",
      },
    ];

    localStorage.setItem("marifa_users", JSON.stringify(testUsers));
    console.log("👥 Тестовые пользователи созданы");
  }
}

// Функция для входа (будет использоваться в login.html)
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("marifa_users") || "[]");
  const user = users.find(
    (u) => u.email === email && u.password === simpleHash(password)
  );

  if (user) {
    // Сохраняем сессию
    localStorage.setItem(
      "marifa_currentUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
      })
    );

    return {
      success: true,
      user: user,
    };
  }

  return {
    success: false,
    message: "Неверный email или пароль",
  };
}

// Проверка авторизации (для других страниц)
function checkAuth() {
  const user = localStorage.getItem("marifa_currentUser");
  return user ? JSON.parse(user) : null;
}

// Выход
function logout() {
  localStorage.removeItem("marifa_currentUser");
  window.location.href = "index.html";
}
