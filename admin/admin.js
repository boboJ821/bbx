// 初始化 LeanCloud
const { Query, User } = AV;
AV.init({
    appId: "你的AppID",
    appKey: "你的AppKey",
    serverURL: "你的服务器URL"
});

// 设置访问密码（建议使用更复杂的密码并定期更改）
const ACCESS_PASSWORD = "你的访问密码";

let visitsChart = null;

// 登录验证
function login(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ACCESS_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('statsContainer').style.display = 'block';
        loadStats();
    } else {
        alert('密码错误！');
    }
    return false;
}

// 加载统计数据
async function loadStats() {
    await Promise.all([
        updateVisitCounts(),
        updateVisitsChart(),
        updateVisitsTable()
    ]);
}

// 更新访问计数
async function updateVisitCounts() {
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

// 更新图表
async function updateVisitsChart() {
    const timeRange = document.getElementById('timeRange').value;
    const startDate = new Date();
    
    switch(timeRange) {
        case '24h':
            startDate.setHours(startDate.getHours() - 24);
            break;
        case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
    }

    const query = new AV.Query('Visit');
    query.greaterThanOrEqualTo('timestamp', startDate);
    query.ascending('timestamp');
    const visits = await query.find();

    // 处理数据
    const data = processChartData(visits, timeRange);
    
    // 更新图表
    if (visitsChart) {
        visitsChart.destroy();
    }

    const ctx = document.getElementById('visitsChart').getContext('2d');
    visitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '访问量',
                data: data.values,
                borderColor: '#49bf9d',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 更新访问表格
async function updateVisitsTable() {
    const query = new AV.Query('Visit');
    query.descending('timestamp');
    query.limit(50);
    const visits = await query.find();

    const tbody = document.getElementById('visitsTableBody');
    tbody.innerHTML = '';

    visits.forEach(visit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(visit.get('timestamp'))}</td>
            <td>${visit.get('ip')}</td>
            <td>${visit.get('referrer')}</td>
            <td>${visit.get('userAgent')}</td>
        `;
        tbody.appendChild(row);
    });
}

// 辅助函数
function formatDate(date) {
    return new Date(date).toLocaleString();
}

function processChartData(visits, timeRange) {
    // 根据时间范围处理数据
    const labels = [];
    const values = [];
    // ... 实现数据处理逻辑
    return { labels, values };
}

// 事件监听
document.getElementById('timeRange').addEventListener('change', loadStats); 