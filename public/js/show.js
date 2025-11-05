const contentList = document.getElementById('contentList');
const messageDiv = document.getElementById('message');
const showEndpoint = 'http://8.140.244.241:3000/content/show'; // 获取内容的接口
const deleteEndpoint = '/content/delete'; // 删除内容的接口
const fileInfoEndpoint = '/content/'; // 图片展示接口

// 加载内容
async function loadContent() {
    try {
        const response = await fetch(showEndpoint);
        const data = await response.json();

        contentList.innerHTML = ''; // 清空内容列表

        data.forEach(item => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';

            const contentText = document.createElement('p');
            contentText.className = 'content-text';
            contentText.textContent = `内容: ${item.content}`;

            const imgInfo = document.createElement('p');
            imgInfo.className = 'content-text';
            imgInfo.textContent = `图片信息: ${item.imgInfo}`;

            contentItem.appendChild(contentText);
            contentItem.appendChild(imgInfo);

            // 如果 imgInfo 非空，添加图片展示按钮
            if (item.imgInfo && item.imgInfo.trim() !== '') {
                const viewImgBtn = document.createElement('button');
                viewImgBtn.className = 'delete-btn'; // 使用相同样式
                viewImgBtn.style.backgroundColor = '#007bff'; // 修改颜色为蓝色
                viewImgBtn.textContent = '查看图片';
                viewImgBtn.onclick = () => displayImage(item.imgInfo, contentItem);
                contentItem.appendChild(viewImgBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = () => deleteContent(item.id);

            contentItem.appendChild(deleteBtn);

            contentList.appendChild(contentItem);
        });
    } catch (error) {
        console.error('加载内容失败:', error);
        showMessage('加载内容失败，请检查网络连接或接口地址。', 'error');
    }
}

// 展示图片
async function displayImage(imgInfo, contentItem) {
    try {
        const imageUrl = `${fileInfoEndpoint}${encodeURIComponent(imgInfo)}`;
        const existingImg = contentItem.querySelector('.content-img');
        
        // 如果图片已经存在，则不重复加载
        if (existingImg) return;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = '图片加载失败';
        img.className = 'content-img';

        contentItem.appendChild(img);
    } catch (error) {
        console.error('图片加载失败:', error);
        showMessage('图片加载失败，请检查网络连接或接口地址。', 'error');
    }
}

// 删除内容
async function deleteContent(id) {
    if (!confirm('确定要删除这条内容吗？')) return;

    try {
        const response = await fetch(deleteEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // 通过请求体传递 id 参数
        });

        if (response.ok) {
            showMessage('删除成功！', 'success');
            loadContent(); // 重新加载内容
        } else {
            showMessage(`删除失败: ${response.status} ${response.statusText}`, 'error');
        }
    } catch (error) {
        console.error('删除失败:', error);
        showMessage('删除失败，请检查网络连接或接口地址。', 'error');
    }
}

// 显示消息
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 页面加载时获取内容
loadContent();