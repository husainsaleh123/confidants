// routes/api/stories.js
import express from 'express';
import { index, create, userIndex, update, destroy , show } from '../../controllers/api/stories.js';

const router = express.Router();

// GET /api/stories/all -> list all stories
router.get('/all', index);

// GET /api/stories -> list all stories of the user
router.get('/', userIndex);

// POST /api/stories-> create new hoot
router.post('/', create);

// PUT /api/stories/:id -> update story
router.put('/:id', update);

// DELETE /api/stories/:id -> delete story
router.delete('/:id', destroy);

// GET /api/stories/:id -> list all stories
router.get('/:id', show);

export default router;