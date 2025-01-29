// 技能动画相关功能
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