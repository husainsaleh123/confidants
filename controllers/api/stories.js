// import story from '../../models/story.js';
import Story from '../../models/story.js';

// GET /api/stories
async function index(req, res) {
    try {
        const stories = await Story.find({})
            .sort({ createdAt: -1 })
            .populate('author', 'friendsInvolved'); // populate author and the friends involved

        res.status(200).json(stories);
    } catch (e) {
        console.error('Error fetching hoots:', e);
        res.status(400).json({ msg: e.message });
    }
}
async function userIndex(req, res) {
    try {
        const stories = await Story.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'friendsInvolved'); // populate author and the friends involved

        res.status(200).json(stories);
    } catch (e) {
        console.error('Error fetching stories:', e);
        res.status(400).json({ msg: e.message });
    }
}
// POST /api/stories
async function create(req, res) {
    try {
        if (!req.user) throw new Error('Not logged in');

        const story = await Story.create({
            title: req.body.title,
            content: req.body.content,
            date: req.body.date || Date.now(),
            author: req.user._id,
            friendsInvolved: req.body.friendsInvolved,
            photos: req.body.photos,
            mood: req.body.mood,
            visibility: req.body.visibility
        });

        await Story.populate('author', 'friendsInvolved'); // populate author name
        res.status(201).json(story);
    } catch (e) {
        console.error('Error creating Story:', e);
        res.status(400).json({ msg: e.message });
    }
}

async function update(req, res) {
    try {
        if (!req.user) throw new Error('Not logged in');

        const storyId = req.params.id;

        // Find the story and update fields
        const story = await Story.findByIdAndUpdate(
            storyId,
            {
                title: req.body.title,
                content: req.body.content,
                date: req.body.date,
                friendsInvolved: req.body.friendsInvolved,
                photos: req.body.photos,
                mood: req.body.mood,
                visibility: req.body.visibility
            },
            { new: true } // return the updated document
        );

        if (!story) throw new Error('Story not found');

        // Populate author and friendsInvolved
        await Story.populate('author', 'friendsInvolved');

        res.status(200).json(story);
    } catch (e) {
        console.error('Error updating Story:', e);
        res.status(400).json({ msg: e.message });
    }
}

async function Show(req, res) {
    try {
        const story = await Story.findById(req.params.id)
            .populate('author', 'friendsInvolved'); // populate author and the friends involved
        if (!story) throw new Error('Story not found');
        res.status(200).json(story);
    } catch (e) {
        console.error('Error fetching story:', e);
        res.status(400).json({ msg: e.message });
    }
}
async function Destroy(req, res) {
    try {
         if (!req.user) throw new Error('Not logged in');

        const story = await Story.findById(req.params.id);
        if (!story) throw new Error('Story not found');

        // Optional: only allow author to delete
        if (!story.author.equals(req.user._id)) throw new Error('Not authorized');

        await story.deleteOne();

        res.status(200).json({ msg: 'Story deleted successfully' });
    } catch (e) {
        console.error('Error deleting story:', e);
        res.status(400).json({ msg: e.message });
    }
}

export default { index, create, userIndex, update, Destroy , Show};
export { index, create, userIndex, update, Destroy , Show };