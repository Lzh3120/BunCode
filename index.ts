import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import qs from 'qs';
import { JSDOM } from 'jsdom';

// 創建一個自動管理 Cookie 的 axios 實例
const jar = new CookieJar();
const client = wrapper(axios.create({ 
  jar, 
  withCredentials: true,
  baseURL: 'https://b.wmsxwd-j.men' 
}));

// 通用的標頭設置
const commonHeaders = {
  'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
  'accept-language': 'zh-CN,zh;q=0.9',
};

async function startScraping() {
  try {
    console.log('--- 步驟 1: 正在登錄 ---');
    
    const loginData = {
      email: '1753647334@qq.com', // 請確保這是正確的賬號
      passwd: 'qazxsw123',
      remember_me: 'on',
      code: ''
    };

    const loginPageResponse = await client.post('/auth/login', qs.stringify(loginData), {
      headers: {
        ...commonHeaders,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        'referer': 'https://b.wmsxwd-j.men/auth/login'
      }
    });
    console.log(loginPageResponse);
    console.log('--- 步驟 2: 請求用戶頁面 ---');
    
    const userPageResponse = await client.get('/user', {
      headers: {
        ...commonHeaders,
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'referer': 'https://b.wmsxwd-j.men/'
      }
    });

    const html = userPageResponse.data;
    
    console.log('--- 步驟 3: 篩選目標鏈接 ---');

    // 方法 A: 使用正則表達式精確匹配 IP 和端口
    const targetPattern = /http:\/\/154\.17\.6\.60:36750[^\s'"]+/g;
    const matches = html.match(targetPattern);

    if (matches && matches.length > 0) {
      // 去重並打印
      const uniqueLinks = Array.from(new Set(matches));
      console.log('找到以下目標鏈接：');
      uniqueLinks.forEach(link => console.log(`🔗 ${link}`));
    } else {
      console.log('未在頁面中找到匹配 http://154.17.6.60:36750 的鏈接。');
      
      // 方法 B: 如果鏈接隱藏在 a 標籤裡，可以嘗試 DOM 解析
      /*
      const dom = new JSDOM(html);
      const links = dom.window.document.querySelectorAll('a');
      links.forEach(a => {
        if (a.href.startsWith('http://154.17.6.60:36750')) {
          console.log('DOM 找到鏈接:', a.href);
        }
      });
      */
    }

  } catch (error: any) {
    console.error('執行過程中發生錯誤:', error.message);
  }
}

startScraping();