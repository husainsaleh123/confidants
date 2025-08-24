// routes/api/interactions.js
import express from 'express';
import { create, userIndex, update, Destroy , Show } from '../../controllers/api/interactions.js';

const router = express.Router();


// GET /api/interactions -> list all interactions of the user
router.get('/', userIndex);

// POST /api/interactions-> create new interaction
router.post('/', create);

// PUT /api/interactions/:id -> update interaction
router.put('/:id', update);

// DELETE /api/interactions/:id -> delete interaction
router.delete('/:id', Destroy);

// GET /api/interactions/:id -> list all interactions
router.get('/:id', Show);

export default router;