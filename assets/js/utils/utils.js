// 整合所有工具函数
const Utils = {
    // 从 util.js
    navList: function($this) {
        // ... 导航列表生成代码
    },
    
    panel: function(userConfig) {
        // ... 面板配置代码
    },
    
    // 从其他地方整合的工具函数
    formatDate: function(date) {
        return new Date(date).toLocaleString();
    },
    
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text);
    }
};

window.Utils = Utils; 