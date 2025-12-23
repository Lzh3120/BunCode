import { spawn, exec, execSync, ChildProcess } from 'child_process';


// 导出的 API：startForward / stopForward
// 使用 socat 将本地端口转发到远端 ip:port，需系统安装 socat
export async function startForward(localPort: number, remoteIp: string, remotePort: number) {
  // 1. 查找並殺死進程
  // pgrep -f 會匹配完整的命令行參數
  // 如果找不到進程，此命令會拋出異常，所以我們放入 try-catch
  try {
      execSync(`pkill -f /root/soft/realm`);
      console.log('舊進程已成功停止。');
  } catch (err) {
      console.log('未發現正在運行的相關進程，或進程已關閉。');
  }

  // 等待一小段時間確保資源釋放
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const args = ["-l", `0.0.0.0:${localPort}`, "-r", `${remoteIp}:${remotePort}`];

  // 2. 啓動新進程
  console.log(`正在執行命令: '/root/soft/realm' ${args.join(' ')}`);
  
  const child = spawn('/root/soft/realm', args, {
      detached: true,       // 使子進程獨立於主進程運行
      stdio: 'ignore'      // 如果不需要獲取日誌，可以忽略
  });

  // 讓子進程在後台運行
  child.unref();

  console.log(`realm 啓動成功 (PID: ${child.pid})`);

  return { started: true };
}
