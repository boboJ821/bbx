// 初始化 LeanCloud
const { Query, User } = AV;
AV.init({
  appId: "MtJITlnYUT0UQCFMafGOhEQq-gzGzoHsz",
  appKey: "kwIo9qXgTCFxGNFDKSdbsJc5",
  serverURL: "https://mtjitlny.lc-cn-n1-shared.com"
});

class VisitTracker {
    constructor() {
        this.recordVisit();
    }

    async recordVisit() {
        try {
            // 获取访客IP
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();

            // 创建访问记录
            const Visit = AV.Object.extend('Visit');
            const visit = new Visit();
            
            visit.set({
                ip: ipData.ip,
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                path: window.location.pathname,
                timestamp: new Date(),
                screenResolution: `${window.screen.width}x${window.screen.height}`
            });

            await visit.save();
        } catch (error) {
            console.error('Error recording visit:', error);
        }
    }
}

// 初始化访问追踪
new VisitTracker(); 