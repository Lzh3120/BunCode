document.addEventListener('DOMContentLoaded', () => {
    const pw = localStorage.getItem('password');
    if (pw) {
        // 已有密码则直接跳转到主页
        location.href = 'index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const msg = document.getElementById('message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value.trim();
        if (!password) {
            msg.textContent = '请输入密码';
            return;
        }

        // 存入 localStorage
        localStorage.setItem('password', password);

        // 跳转回首页
        location.href = 'index.html';
    });
});