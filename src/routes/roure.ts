import { Hono } from "hono";
import {download, remove, save, show} from '../services/contentService'

export const contentRoutes = new Hono()

contentRoutes.get('show', show)
contentRoutes.get(':filename', download)
contentRoutes.post('save', save)
contentRoutes.post('delete', remove)
