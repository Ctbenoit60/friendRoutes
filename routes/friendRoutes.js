const express = require("express");
const router = express.Router();
const friends = require('../models/friends');

// TODO - #1: Add support to the 'filter' endpoint for a new query parameter 'letter' which filters friends by starting letter
router.get('/filter', (req, res) => {
    let filterGender = req.query.gender;
    let filterLetter = req.query.letter;
    let matchingFriends = [...friends];

    if (filterGender) {
        matchingFriends = matchingFriends.filter(friend => friend.gender === filterGender);
    }

    if (filterLetter) {
        matchingFriends = matchingFriends.filter(friend => friend.name.startsWith(filterLetter.toUpperCase()));
    }

    if (matchingFriends.length > 0) {
        res.status(200).json(matchingFriends);
    } else {
        res.status(404).json({ error: "No friends matching the specified criteria" });
    }
});

// TODO - #2: Modify the 'info' route to only return the user-agent, content-type, and accept header data
router.get('/info', (req, res) => {
    const userAgent = req.get('user-agent');
    const contentType = req.get('content-type');
    const accept = req.get('accept');
    res.json({ userAgent, contentType, accept });
});

// TODO - #3: Modify the dynamic GET route to return a single friend object matching the dynamic 'id' request parameter
router.get('/:id', (req, res) => {
    let friendId = req.params.id;
    let foundFriend = friends.find(friend => friend.id == friendId);

    if (foundFriend) {
        res.status(200).json(foundFriend);
    } else {
        res.status(404).json({ error: "Friend not found" });
    }
});

// TODO - #4: Complete the PUT route which will update data for an existing friend
router.put('/:id', (req, res) => {
    let friendId = req.params.id;
    let updatedFriend = req.body;
    let index = friends.findIndex(friend => friend.id == friendId);

    if (index !== -1) {
        // Add basic data validation here
        if (!updatedFriend.name || !updatedFriend.gender) {
            res.status(400).json({ error: 'Friend object must contain a name and gender' });
            return;
        }

        friends[index] = { ...friends[index], ...updatedFriend };
        res.status(200).json({ result: 'Updated friend with ID ' + friendId, data: friends[index] });
    } else {
        res.status(404).json({ error: "Friend not found" });
    }
});

module.exports = router;
