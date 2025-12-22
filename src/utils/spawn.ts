import { spawn, ChildProcess } from 'child_process';

class ProcessManager {
  private child: ChildProcess | null = null;

  startProgram(command: string, args: string[]) {
    let stoppedPrevious = false;
    if (this.child) {
      console.log('已有进程在运行，先停止它');
      stoppedPrevious = this.stopProgram();
    }
    this.child = spawn(command, args, { stdio: 'inherit', shell: false });

    this.child.on('error', (err) => {
      console.error('启动失败:', err);
    });

    this.child.on('exit', (code, signal) => {
      console.log(`进程已退出，退出码: ${code}, 信号: ${signal}`);
      this.child = null;
    });
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

      // 等待短暂时间，如果进程仍存在则尝试强制终止
      try {
        setTimeout(() => {
          try {
            if (pid && process.kill(pid, 0)) {
              try {
                process.kill(pid, 'SIGKILL');
              } catch (e) {
                console.error('SIGKILL 发送失败', e);
              }
            }
          } catch (e) {
            // process.kill(pid,0) 在 Windows 上可能抛出，这里忽略
          }
        }, 500);
      } catch (e) {
        // ignore
      }

      this.child = null;
      return true;
    } else {
      console.log('没有正在运行的进程');
      return false;
    }
  }
}

const manager = new ProcessManager();

// 导出的 API：startForward / stopForward
// 使用 socat 将本地端口转发到远端 ip:port，需系统安装 socat
export function startForward(localPort: number, remoteIp: string, remotePort: number) {
  const args = [`TCP-LISTEN:${localPort},reuseaddr,fork`, `TCP:${remoteIp}:${remotePort}`];
  const stoppedPrevious = manager.startProgram('socat', args);
  return { started: true, stoppedPrevious };
}

export function stopForward() {
  const stopped = manager.stopProgram();
  return { stopped };
}