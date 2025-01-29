// 头像相关功能
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