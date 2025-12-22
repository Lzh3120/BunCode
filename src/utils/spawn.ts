import { spawn, exec, execSync, ChildProcess } from 'child_process';

class ProcessManager {
  private child: ChildProcess | null = null;

  async startProgram(command: string, args: string[]) {
    let stoppedPrevious = false;
    if (this.child) {
      console.log('已有进程在运行，先停止它');
      stoppedPrevious = await this.stopProgram(); // 等待进程完全停止
    }

    this.child = spawn(command, args, { stdio: 'inherit', shell: false });

    console.log(`启动的进程 PID: ${this.child.pid}`);

    this.child.on('error', (err) => {
      console.error('启动失败:', err);
    });

    this.child.on('exit', (code, signal) => {
      console.log(`进程已退出，退出码: ${code}, 信号: ${signal}`);
      this.child = null;
    });

    return stoppedPrevious;
  }

  async stopProgram() {
    try {
      // 使用 ps -ef 查询进程
      const result = execSync(`ps -ef | grep '/root/soft/realm' | grep -v grep`).toString();
      const lines = result.split('\n').filter((line) => line.trim() !== '');

      if (lines.length === 0) {
        console.log('未找到正在运行的进程');
        return false;
      }

      for (const line of lines) {
        const columns = line.split(/\s+/);
        const pid = columns[1]; // 第二列是 PID
        console.log(`正在终止进程 PID: ${pid}`);
        process.kill(parseInt(pid), 'SIGTERM'); // 发送 SIGTERM 信号
      }

      console.log('进程已成功终止');
      this.child = null;
      return true;
    } catch (error) {
      console.error('终止进程时发生错误:', error);
      return false;
    }
  }
}

const manager = new ProcessManager();

// 导出的 API：startForward / stopForward
// 使用 socat 将本地端口转发到远端 ip:port，需系统安装 socat
export async function startForward(localPort: number, remoteIp: string, remotePort: number) {
  const args = ["-l", `0.0.0.0:${localPort}`, "-r", `${remoteIp}:${remotePort}`];
  const stoppedPrevious = await manager.startProgram('/root/soft/realm', args);
  return { started: true, stoppedPrevious };
}

export async function stopForward() {
  const stopped = await manager.stopProgram();
  return { stopped };
}