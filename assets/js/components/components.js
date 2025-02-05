// 整合所有组件的 JavaScript 功能

// Avatar 处理类
class AvatarHandler {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.avatarContainer = document.querySelector('.avatar-container');
        this.avatarSmall = this.avatarContainer.querySelector('.avatar-small');
        this.overlay = document.querySelector('.avatar-overlay');
        this.lightbox = document.querySelector('.avatar-lightbox');
    }

    bindEvents() {
        this.avatarContainer.addEventListener('click', () => this.showLightbox());
        this.overlay.addEventListener('click', () => this.closeLightbox());
        this.lightbox.addEventListener('click', () => this.closeLightbox());
    }

    showLightbox() {
        this.overlay.classList.add('active');
        this.lightbox.classList.add('active');
    }

    closeLightbox() {
        this.overlay.classList.remove('active');
        this.lightbox.classList.remove('active');
    }
}

// 技能动画类
class SkillsAnimation {
    constructor() {
        this.initializeObserver();
    }

    initializeObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percentage = entry.target.dataset.percentage;
                    entry.target.style.width = percentage + '%';
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-bar-fill')
            .forEach(bar => observer.observe(bar));
    }
}

// 微信组件类
class WeChatHandler {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.weixinIcon = document.querySelector('.icon.brands.fa-weixin');
        this.wechatQR = document.getElementById('wechatQR');
        this.closeQR = document.querySelector('.close-qr');
    }

    bindEvents() {
        this.weixinIcon.addEventListener('click', (e) => {
            e.preventDefault();
            this.wechatQR.style.display = 'flex';
        });

        this.closeQR.addEventListener('click', () => {
            this.wechatQR.style.display = 'none';
        });

        this.wechatQR.addEventListener('click', (e) => {
            if (e.target === this.wechatQR) {
                this.wechatQR.style.display = 'none';
            }
        });
    }
}

// 统一的组件初始化类
class ComponentManager {
    constructor() {
        this.initializeComponents();
    }

    initializeComponents() {
        this.avatar = new AvatarHandler();
        this.skills = new SkillsAnimation();
        this.wechat = new WeChatHandler();
    }
}

// 导出组件管理器
window.ComponentManager = ComponentManager; 