// routes/api/stories.js
import express from 'express';
import { index, create, userIndex, update, destroy , show } from '../../controllers/api/stories.js';

// add multer for handling image files
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// CHANGED: ensure uploads dir exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// configure disk storage (keeps original ext)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

// image-only filter (png/jpg/jpeg/webp/gif)
const fileFilter = (_req, file, cb) => {
  const ok = /image\/(jpeg|jpg|png|webp|gif)/i.test(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};

const upload = multer({ storage, fileFilter });

// GET /api/stories/all -> list all stories
router.get('/all', index);

// GET /api/stories -> list all stories of the user
router.get('/', userIndex);

// CHANGED: accept multipart form-data with images sent as field name "media"
router.post('/', upload.array('media', 10), create);

// PUT /api/stories/:id -> update story
router.put('/:id', update);

// DELETE /api/stories/:id -> delete story
router.delete('/:id', destroy);

// GET /api/stories/:id -> list all stories
router.get('/:id', show);

export default router;