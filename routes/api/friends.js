import express from 'express';
import { index, create, update, destroy , show } from '../../controllers/api/friends.js';
const router = express.Router();
// GET /api/friends list all friend
router.get('/', index);
// POST /api/friend-> create new friend
router.post('/', create);
// PUT /api/friend/:id -> update friend
router.put('/:id', update);
// DELETE /api/friends/:id -> delete friend
router.delete('/:id', destroy);
// GET /api/friends/:id -> show friend
router.get('/:id', show);
export default router;