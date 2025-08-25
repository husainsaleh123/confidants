import interaction from '../../models/interaction.js';
import mongoose from 'mongoose';


async function userIndex(req, res) {
    try {
        const interactions = await interaction.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'friendsInvolved'); // populate author and the friends involved

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
            friendsInvolved: req.body.friendsInvolved,
            date: req.body.date || Date.now(),
            type: req.body.type,
            notes: req.body.notes
        });

        await interaction.populate('author', 'friendsInvolved'); // populate author name
        res.status(201).json(newInteraction);
    } catch (e) {
        console.error('Error creating Interaction:', e);
        res.status(400).json({ msg: e.message });
    }
}

//update interaction

async function update(req, res) {
    try {
        if (!req.user) throw new Error('Not logged in');

        const interactionId = req.params.id;

        // Find the story and update fields
        const updatedInteraction = await interaction.findByIdAndUpdate(
            interactionId,
            {
                friendsInvolved: req.body.friendsInvolved,
                date: req.body.date,
                type: req.body.type,
                notes: req.body.notes
            },
            { new: true } // return the updated document
        );

        if (!updatedInteraction) throw new Error('Interaction not found');

        // Populate author and friendsInvolved
        await interaction.populate('author', 'friendsInvolved');

        res.status(200).json(interaction);
    } catch (e) {
        console.error('Error updating Interaction:', e);
        res.status(400).json({ msg: e.message });
    }
}


async function show(req, res) {
    try {
        const foundInteraction = await interaction.findById(req.params.id)
            .populate('author', 'friendsInvolved'); // populate author and the friends involved
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

    const deletedInteraction = await interaction.findById(req.params.id);
    if (!deletedInteraction) throw new Error('Interaction not found');

    // Only allow author to delete
    // if (!deletedInteraction.author || 
    //     !mongoose.Types.ObjectId(deletedInteraction.author).equals(req.user._id)) {
    //   throw new Error('Not authorized');
    // }

    // Delete the specific document
    await deletedInteraction.deleteOne();

    res.status(200).json({ msg: 'Interaction deleted successfully' });
  } catch (e) {
    console.error('Error deleting interaction:', e);
    res.status(400).json({ msg: e.message });
  }
}

export default { create, userIndex, update, destroy, show };
export { create, userIndex, update, destroy, show };