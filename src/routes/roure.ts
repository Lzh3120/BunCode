import { Hono } from "hono";
import {download, save, show} from '../services/contentService'

export const contentRoutes = new Hono()

contentRoutes.get('show', show)
contentRoutes.get(':filename', download)
contentRoutes.post('save', save)
