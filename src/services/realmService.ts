import type { Context } from "hono";
import { RealmDao } from "../db/SQL";
import { startForward } from "../utils/spawn";

// 与 contentService 保持一致的简单授权检查（如果需要，可修改）
const REQUIRED_AUTH = 'cC321321..';

export async function add(c: Context) {
    //const authorization = c.req.header("Authorization");
    //if (authorization !== REQUIRED_AUTH) {
    //    return c.json({ message: 'Unauthorized' }, 401);
    //}
    console.log('add realm called');
    const body = await c.req.json();
    const ip = body.ip;
    const port = body.port;
    const remark = body.remark || null;
    if (!ip || !port) {
        return c.json({ message: 'IP和端口不能为空' }, 400);
    }

    // 校验 IP 和端口
    const ipRegex = /^[a-zA-Z0-9.]+$/;
    if (!ipRegex.test(ip)) {
        return c.json({ message: 'IP 地址只能包含字符、数字和点' }, 400);
    }

    if (!port || isNaN(port) || port < 1 || port > 65535) {
        return c.json({ message: '端口必须是 1 到 65535 之间的数字' }, 400);
    }


    const realmDao = new RealmDao();
    const id = realmDao.create(ip.toString(), Number(port), remark ? remark.toString() : undefined);
    return c.json({ message: 'created', id }, 201);
}

export function list(c: Context) {
    

    const realmDao = new RealmDao();
    const items = realmDao.findAll();
    return c.json(items);
}

export async function remove(c: Context) {
    

    const body = await c.req.json();
    const id = body.id;
    if (!id) {
        return c.json({ message: 'id 不能为空' }, 400);
    }

    const realmDao = new RealmDao();
    realmDao.deleteById(Number(id));
    return c.text('remove success');
}

// 将本地 6666 转发到 realm 表中指定 id 的 ip:port
export async function forward(c: Context) {
    

    const body = await c.req.json();
    const id = body.id;
    if (!id) {
        return c.json({ message: 'id 不能为空' }, 400);
    }

    const realmDao = new RealmDao();
    const realm = realmDao.findById(Number(id));
    if (!realm) {
        return c.json({ message: '未找到对应 realm' }, 404);
    }

    const ip = realm.ip;
    const port = Number(realm.port);

    // 启动转发：本地 6666 -> ip:port
    try {
        startForward(53462, ip, port);
        return c.json({ message: 'forward started', id, target: `${ip}:${port}` });
    } catch (e) {
        console.error('forward error', e);
        return c.json({ message: 'forward failed', error: String(e) }, 500);
    }
}

export async function update(c: Context) {
    const authorization = c.req.header("Authorization");
    if (authorization !== REQUIRED_AUTH) {
        return c.json({ message: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const id = body.id;
    const ip = body.ip;
    const port = body.port;
    const remark = body.remark || null;

    if (!id || !ip || !port) {
        return c.json({ message: 'id、IP和端口不能为空' }, 400);
    }

    const realmDao = new RealmDao();
    realmDao.updateById(Number(id), ip.toString(), Number(port), remark ? remark.toString() : undefined);
    return c.json({ message: 'updated', id });
}