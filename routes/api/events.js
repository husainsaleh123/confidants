// routes/api/events.js
import express from 'express';
import { index, create, update, destroy, show  } from '../../controllers/api/events.js';

const router = express.Router();

// GET /api/events/all -> list all events
router.get('/', index);


// POST /api/events-> create new event
router.post('/', create);

// PUT /api/events/:id -> update events
router.put('/:id', update);

// DELETE /api/events/:id -> delete events
router.delete('/:id', destroy);

// GET /api/events/:id -> show an events
router.get('/:id', show);

export default router;