import { spawn, ChildProcess } from 'child_process';

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

  stopProgram() {
    if (this.child) {
      console.log('正在终止进程...');
      const pid = this.child.pid;

      try {
        this.child.kill('SIGTERM');
      } catch (e) {
        console.error('SIGTERM 发送失败', e);
      }

      return new Promise((resolve) => {
        this.child?.on('exit', () => {
          console.log('进程已成功终止');
          this.child = null;
          resolve(true);
        });

        // 如果进程未响应 SIGTERM，强制终止
        setTimeout(() => {
          try {
            if (pid && process.kill(pid, 0)) {
              process.kill(pid, 'SIGKILL');
            }
          } catch (e) {
            console.error('SIGKILL 发送失败', e);
          }
          this.child = null;
          resolve(true);
        }, 500);
      });
    } else {
      console.log('没有正在运行的进程');
      return Promise.resolve(false);
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

export function stopForward() {
  const stopped = manager.stopProgram();
  return { stopped };
}