import { Hono } from "hono";
import { download, remove, save, show } from '../services/contentService';
import { add as realmAdd, list as realmList, remove as realmRemove, forward as realmForward, update as realmUpdate } from '../services/realmService';

export const contentRoutes = new Hono();

contentRoutes.get('show', show);
contentRoutes.get(':filename', download);
contentRoutes.post('save', save);
contentRoutes.post('delete', remove);

export const realmRoutes = new Hono();

// Realm management routes
realmRoutes.post('add', realmAdd);
realmRoutes.post('delete', realmRemove);
realmRoutes.post('list', realmList);
realmRoutes.post('forward', realmForward);
realmRoutes.post('update', realmUpdate);
