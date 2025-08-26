import interaction from '../../models/interaction.js';
import mongoose from 'mongoose';

async function userIndex(req, res) {
  try {
    const interactions = await interaction
      .find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate([{ path: 'friendsInvolved', select: 'name _id' },
                 { path: 'author', select: 'username _id' }]);

    res.status(200).json(interactions);
  } catch (e) {
    console.error('Error fetching interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

// POST /api/interactions
async function create(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');

    const newInteraction = await interaction.create({
      author: req.user._id,                 // <-- required so it appears in userIndex()
      friendsInvolved: req.body.friendsInvolved,
      date: req.body.date || Date.now(),
      type: req.body.type,
      notes: req.body.notes
    });

    await newInteraction.populate([
      { path: 'friendsInvolved', select: 'name _id' },
      { path: 'author', select: 'username _id' },
    ]);

    res.status(201).json(newInteraction);
  } catch (e) {
    console.error('Error creating Interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

// PUT /api/interactions/:id
async function update(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');

    const updatedInteraction = await interaction.findByIdAndUpdate(
      req.params.id,
      {
        friendsInvolved: req.body.friendsInvolved,
        date: req.body.date,
        type: req.body.type,
        notes: req.body.notes
      },
      { new: true }
    );

    if (!updatedInteraction) throw new Error('Interaction not found');

    await updatedInteraction.populate([
      { path: 'friendsInvolved', select: 'name _id' },
      { path: 'author', select: 'username _id' },
    ]);

    res.status(200).json(updatedInteraction); // <-- return the doc
  } catch (e) {
    console.error('Error updating Interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

async function show(req, res) {
  try {
    const foundInteraction = await interaction
      .findById(req.params.id)
      .populate([
        { path: 'friendsInvolved', select: 'name _id' },
        { path: 'author', select: 'username _id' },
      ]);

    if (!foundInteraction) throw new Error('Interaction not found');
    res.status(200).json(foundInteraction);
  } catch (e) {
    console.error('Error fetching interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

async function destroy(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');

    const doc = await interaction.findById(req.params.id);
    if (!doc) throw new Error('Interaction not found');

    await doc.deleteOne();
    res.status(200).json({ msg: 'Interaction deleted successfully' });
  } catch (e) {
    console.error('Error deleting interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

export default { create, userIndex, update, destroy, show };
export { create, userIndex, update, destroy, show };
