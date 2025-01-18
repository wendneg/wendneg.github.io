document.addEventListener('DOMContentLoaded', () => {
    // 背景亂碼效果
    const matrixBg = document.querySelector('.matrix-bg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    matrixBg.appendChild(canvas);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+';
    const fontSize = 14;
    let drops = [];

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    function draw() {
        // 調整這裡的透明度，0.05 改為 0.02 使背景更淡
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 調整亂碼的透明度，使用 rgba
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.font = fontSize + 'px monospace';

        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, y * fontSize);
            
            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        });
    }

    setInterval(draw, 33);

    // 頁面切換邏輯
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.cyber-nav a');

    function typeWriter(element, text, speed = 30) {
        // 如果正在打字，則返回
        if (element.dataset.typing === 'true') {
            return;
        }
        
        element.dataset.typing = 'true';
        let lines = text.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        
        function type() {
            if (lineIndex < lines.length) {
                if (charIndex < lines[lineIndex].length) {
                    element.textContent += lines[lineIndex][charIndex];
                    charIndex++;
                    setTimeout(type, speed);
                } else {
                    element.textContent += '\n';
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(type, speed * 3);
                }
            } else {
                // 打字結束後重置標記
                element.dataset.typing = 'false';
            }
        }
        
        element.textContent = '';
        type();
    }

    function showSection(sectionId) {
        // 檢查目標區塊是否已經是活動狀態
        const targetSection = document.querySelector(sectionId);
        if (targetSection.classList.contains('active')) {
            return;
        }

        // 更新按鈕狀態
        navLinks.forEach(link => {
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 添加退出動畫
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.add('section-exit');
                setTimeout(() => {
                    section.classList.remove('active', 'section-exit');
                }, 500);
            }
        });

        // 添加進入動畫
        setTimeout(() => {
            targetSection.classList.add('active', 'section-enter');
            
            // 啟動打字機效果
            const typingElements = targetSection.querySelectorAll('.typing-text');
            typingElements.forEach(element => {
                const text = element.textContent;
                typeWriter(element, text, 30);
            });

            setTimeout(() => {
                targetSection.classList.remove('section-enter');
            }, 500);
        }, 500);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showSection(targetId);
        });
    });

    // 修改預設顯示邏輯
    function initializePage() {
        const homeSection = document.querySelector('#home');
        homeSection.classList.add('active');
        navLinks[0].classList.add('active');
    }

    initializePage();

    function copyDiscord(event) {
        event.preventDefault();
        const discordId = "malware.cmd";
        navigator.clipboard.writeText(discordId).then(() => {
            const button = event.currentTarget.querySelector('.btn-glitch-text');
            const originalText = button.textContent;
            button.textContent = "[COPIED!]";
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }
});