// 整合所有统计和追踪相关功能

// LeanCloud 初始化
const { Query, User } = AV;
AV.init({
    appId: "MtJITlnYUT0UQCFMafGOhEQq-gzGzoHsz",
    appKey: "kwIo9qXgTCFxGNFDKSdbsJc5",
    serverURL: "https://mtjitlny.lc-cn-n1-shared.com"
});

// 访问追踪类
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

// 管理后台类
class AdminPanel {
    constructor() {
        this.initializeAdmin();
    }

    async initializeAdmin() {
        // 管理后台初始化逻辑
    }

    async loadStats() {
        await Promise.all([
            this.updateVisitCounts(),
            this.updateVisitsChart(),
            this.updateVisitsTable()
        ]);
    }

    async updateVisitCounts() {
        const query = new AV.Query('Visit');
        
        // 总访问量
        const totalVisits = await query.count();
        document.getElementById('totalVisits').textContent = totalVisits;

        // 独立访客
        const uniqueVisitorsQuery = new AV.Query('Visit');
        const uniqueVisitors = await uniqueVisitorsQuery.distinct('ip');
        document.getElementById('uniqueVisitors').textContent = uniqueVisitors.length;

        // 今日访问
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayQuery = new AV.Query('Visit');
        todayQuery.greaterThanOrEqualTo('timestamp', today);
        const todayVisits = await todayQuery.count();
        document.getElementById('todayVisits').textContent = todayVisits;
    }

    // ... 其他管理面板相关方法 ...
}

// 导出到全局
window.VisitTracker = VisitTracker;
window.AdminPanel = AdminPanel; 