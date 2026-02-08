/**
 * Gold Mello Website - JavaScript
 * Обработка навигации, форм и интерактивности
 */

(function() {
    'use strict';

    // ============================================
    // Инициализация
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initActiveNavigation();
        initContactForm();
    });

    // ============================================
    // Плавная прокрутка для навигационных ссылок
    // ============================================
    function initSmoothScroll() {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Пропускаем пустые якоря
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Активное состояние навигации при прокрутке
    // ============================================
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        function updateActiveNav() {
            let current = '';
            const scrollPosition = window.pageYOffset + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Обновление при прокрутке
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Начальное обновление
        updateActiveNav();
    }

    // ============================================
    // Обработка формы обратной связи
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение данных формы
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Валидация
            if (!validateForm(data)) {
                return;
            }
            
            // Имитация отправки (в реальном проекте здесь будет AJAX запрос)
            handleFormSubmit(data);
        });
    }

    // ============================================
    // Валидация формы
    // ============================================
    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.name || data.name.trim().length < 2) {
            showMessage('Пожалуйста, введите ваше имя (минимум 2 символа)', 'error');
            return false;
        }
        
        if (!data.email || !emailRegex.test(data.email)) {
            showMessage('Пожалуйста, введите корректный email адрес', 'error');
            return false;
        }
        
        if (!data.subject || data.subject.trim().length < 3) {
            showMessage('Пожалуйста, введите тему сообщения (минимум 3 символа)', 'error');
            return false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            showMessage('Пожалуйста, введите сообщение (минимум 10 символов)', 'error');
            return false;
        }
        
        return true;
    }

    // ============================================
    // Обработка отправки формы
    // ============================================
    function handleFormSubmit(data) {
        const submitButton = document.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        
        // Показываем состояние загрузки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        
        // Имитация отправки (задержка 1.5 секунды)
        setTimeout(function() {
            // В реальном проекте здесь будет AJAX запрос к серверу
            console.log('Отправка формы:', data);
            
            // Показываем сообщение об успехе
            showMessage('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Сброс формы
            document.getElementById('contactForm').reset();
            
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    }

    // ============================================
    // Показ сообщений пользователю
    // ============================================
    function showMessage(text, type) {
        // Удаляем существующие сообщения
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Создаём новое сообщение
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        message.setAttribute('role', 'alert');
        
        // Добавляем стили
        message.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            font-weight: 500;
            ${type === 'success' 
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Вставляем сообщение перед формой
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(message, form);
        
        // Автоматически удаляем сообщение через 5 секунд
        setTimeout(function() {
            message.style.transition = 'opacity 0.3s';
            message.style.opacity = '0';
            setTimeout(function() {
                message.remove();
            }, 300);
        }, 5000);
        
        // Прокрутка к сообщению
        message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

})();
