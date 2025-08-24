import Event from '../../models/event.js';


// GET /api/events
async function index(req, res) {
  try {
    const events = await Event.find({})
      .sort({ date: 1 })
      .populate('friend', 'name');
    res.status(200).json(events);
  } catch (e) {
    console.error('Error fetching events:', e);
    res.status(400).json({ msg: e.message });
  }
}

// POST /api/events
async function create(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');

    const event = await Event.create({
      title: req.body.title,
      date: req.body.date,
      type: req.body.type,
      friend: req.body.friend || undefined,
      recurring: req.body.recurring || 'never',
      notified: req.body.notified || false,
      description: req.body.description || '',
    });

    await event.populate('friend', 'name');
    res.status(201).json(event);
  } catch (e) {
    console.error('Error creating event:', e);
    res.status(400).json({ msg: e.message });
  }
}

// PUT /api/events/:id
async function update(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        date: req.body.date,
        type: req.body.type,
        friend: req.body.friend || undefined,
        recurring: req.body.recurring || false,
        notified: req.body.notified || false,
        description: req.body.description || '',
      },
      { new: true }
    ).populate('friend', 'name');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.status(200).json(event);
  } catch (e) {
    console.error('Error updating event:', e);
    res.status(400).json({ msg: e.message });
  }
}

// DELETE /api/events/:id
async function destroy(req, res) {
  try {
    if (!req.user) throw new Error('Not logged in');
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.status(200).json({ msg: 'Event deleted' });
  } catch (e) {
    console.error('Error deleting event:', e);
    res.status(400).json({ msg: e.message });
  }
}




export default { index, create, update, destroy };
export { index, create, update, destroy };