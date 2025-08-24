import friend from "../../models/friend";
import friend from "../../models/friend";


//add- remove-, edit, list-, get- (friend)

// to get api/friends
async function index(req, res) {

    try {
        const friends = await friend.find({ user: req.user._id })
            .sort({ createdAt: -1 })
        res.status(200).json(friends);

    }
    catch (errors) {
        console.error("Error fetching friends:", errors);
        res.status(400).json({ messages: errors.message })
    }

}


// to add new friend
export async function create(req, res, next) {
    try {
        const { name, nickName, birthday, tags = [], likes = [], dislikes = [], neutral = [], lastContactDate, user } = req.body;

        if (!name || !nickName || !birthday) {
            return res.status(400).json({ message: "there is something missing (name, nickName or birthday) :( " });
        }

        const newFriend = await friend.create({
            name: name,
            nickName: nickName,
            birthday: birthday,
            tags: tags,
            likes: likes,
            dislikes: dislikes,
            neutral: neutral,
            lastContactDate: lastContactDate,
            user: user
        });
        res.status(201).json(newFriend);
    } catch (err) {
        next(err);
    }
}


// to show the friend

async function show(req, res) {
    try {
        const friend = await Friends.findById(req.params.id);
        res.status(200).json(friend);

    }

    catch (e) {
        res.status(400).json({ msg: e.message })
    }
}


// to list the friend

//     export async function listFriends(req, res, next) {
//   try {
//     const { q, tag } = req.query;
//     const page = toInt(req.query.page, 1);
//     const limit = toInt(req.query.limit, 10);
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (q) {
//       const rgx = new RegExp(q, 'i');
//       filter.$or = [{ name: rgx }, { nickName: rgx }];
//     }
//     if (tag) {
//       filter.tags = tag;
//     }

//     const [items, total] = await Promise.all([
//       friend.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
//       friend.countDocuments(filter),
//     ]);

//     res.json({
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit),
//       items,
//     });
//   } catch (err) {
//     next(err);
//   }
// }


//remove friend

export async function destroy(req, res, next) {
    try {
        const friend = await friend.findByIdAndDelete(req.params.id);
        if (!friend) return res.status(404).json({ message: 'Friend not found' });
        res.json({ message: 'Friend deleted' });
    } catch (err) {
        next(err);
    }
}



//edit friends
async function update(req, res) {
    try {
        if (!req.user) throw new Error("not logged in");

        const friendId = req.params.id;


        // Find the friend and update fields
        const friend = await friend.findByIdAndUpdate(

            {
                name: req.body.name,
                nickName: req.body.nickName,
                birthday: req.body.birthday,
                tags: req.body.tags,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
                neutral: req.body.neutral,
            })
    }catch (err) {
        next(err);
    }
}

export default { index, create, update, destroy, show };
export { index, create, update, destroy, show };

