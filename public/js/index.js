const form = document.getElementById('submissionForm');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const endpoint = 'http://8.140.244.241:3000/content/save'; // 目标接口地址


form.addEventListener('submit', async function(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    messageDiv.style.display = 'none';

    // 1. 创建 FormData 对象
    const formData = new FormData();
    
    // 2. 获取并添加文本内容
    const content = document.getElementById('content').value;
    formData.append('content', content);

    // 3. 获取并添加图片文件
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];
    
    if (imageFile) {
        // 将文件添加到 FormData，字段名为 'image'
        formData.append('image', imageFile, imageFile.name); 
    }

    try {
        // 4. 发起 POST 请求
        // 关键：当使用 FormData 包含文件时，fetch 不需要手动设置 Content-Type 
        // 浏览器会自动设置 Content-Type 为 multipart/form-data 并带上正确的 boundary
        const pw = localStorage.getItem('password');
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: 'token' + pw
            },
            body: formData, 
        });

        const result = await response.json();

        // 5. 处理响应
        if (response.ok) {
            showMessage('提交成功！服务器返回: ' + JSON.stringify(result), 'success');
            form.reset(); // 提交成功后清空表单
        } else {
            showMessage(`提交失败: ${response.status} ${response.statusText}`, 'error');
        }

    } catch (error) {
        console.error('Fetch Error:', error);
        showMessage('请求发送失败，请检查网络连接或接口地址。', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交';
    }
});

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type; // 设置样式
    messageDiv.style.display = 'block';
}