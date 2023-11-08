import { MatchHistory, Userdb } from "../model/model.js";

export const create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty." });
        return;
    }

    const user = new Userdb({
        name: req.body.name,
        age: req.body.age,
        number: req.body.number,
        gender: req.body.gender,
        position: req.body.position,
        contact: req.body.contact,
        status: req.body.status,
        note: req.body.note,
        assists: 0,
        goals: 0,
        pointsPlayed: 0,
        turnovers: 0,
        blocks: 0,
        cAssists: 0,
        cGoals: 0,
        cTurnovers: 0,
        cBlocks: 0,
        cPointsPlayed: 0
    });

    user
        .save(user)
        .then(data => {
            res.redirect('/');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while trying to create a new player."
            });
        });
};

export const find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Player with ${id} not found` });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Player retrieving user with id ${id}` });
            });
    } else {
        Userdb.find()
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Could not retrieve player information." });
            });
    }
};

export const update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" });
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error while updating a player." });
        });
};

export const deleteUser = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete player with id ${id}.` });
            } else {
                res.send({
                    message: "Player was deleted successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete player with id=${id}`
            });
        });
};

export const leaderboard = (req, res) => {
    Userdb.find().exec((err, users) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Could not retrieve leaderboard information.' });
        } else {
            res.render('leaderboard', { users });
        }
    });
};

export const hardReset = async (req, res) => {
    const data = req.body
    try {
        const users = await Userdb.find().exec();
        let promises = [];

        users.forEach(async (user) => {
            user.cGoals = 0;
            user.cAssists = 0;
            user.cBlocks = 0;
            user.cTurnovers = 0;
            user.cPointsPlayed = 0;
            user.goals = 0;
            user.assists = 0;
            user.blocks = 0;
            user.turnovers = 0;
            user.pointsPlayed = 0;
            promises.push(user.save())
        })

        await Promise.all(promises);

        res.json({
            message: 'Event list updated successfully',
            users: promises,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





export const createMatchHistory = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty." });
        return;
    }

    try {
        // Find the highest order in existing match history entries
        const highestOrderMatch = await MatchHistory.findOne().sort({ order: -1 });
        // Calculate the new order for the new entry
        const newOrder = highestOrderMatch ? highestOrderMatch.order + 1 : 1;

        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();


        const currentDate = new Date(year, month, day)

        const enUSFormatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const matchHistory = new MatchHistory({
            order: newOrder,
            team: req.body.team,
            date: enUSFormatter.format(currentDate),
            od: req.body.od,
            location: req.body.location,
            win: false,
            ourScore: 0,
            theirScore: 0,
            eventList: []
        });

        // Save the new entry
        const data = await matchHistory.save();

        res.redirect('/live-tracking');
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error occurred while trying to create a new match history entry."
        });
    }
};

export const getMatchHistoryById = (req, res) => {
    const id = req.params.id;

    MatchHistory.findById(id)
        .then(matchHistoryData => {
            if (!matchHistoryData) {
                res.status(404).send({ message: `Match history with id ${id} not found` });
            } else {
                res.render('match_history', {matchHistoryData});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error occurred while retrieving match history data.'
            });
        });
};

export const match_history = (req, res) => {
    MatchHistory.find()
        .then(matchHistoryData => {
            res.render('match_history', { matchHistory: matchHistoryData });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error occurred while retrieving match history data.'
            });
        });
};

export const deleteMatchHistory = (req, res) => {
    const id = req.params.id;

    MatchHistory.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot delete player with id ${id}.` });
            } else {
                res.send({
                    message: "Player was deleted successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete player with id=${id}`
            });
        });
};


export const startGame = (req, res) => {
    Userdb.find().exec((err, users) => {
        if (err) {
            res.status(500).send({ message: err.message || 'Could not retrieve leaderboard information.' });
        } else {
            res.render('start_game', { users });
        }
    });
};


export const liveTracking = async (req, res) => {
    try {
        const users = await Userdb.find().exec();
        
        const matchHistoryData = await MatchHistory.find().exec();

        if (!users || !matchHistoryData) {
            res.status(500).send({ message: 'Could not access information.' });
            return;
        }

        const selectedMatch = matchHistoryData[matchHistoryData.length - 1]

        res.render('live_tracking', { users, selectedMatch: selectedMatch });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Could not access information.' });
    }
};

export const Action = {  
    GOAL: "Goal",
    ASSIST: "Assist",
    TURNOVER: "Turnover",
    BLOCK: "Block"
};

export const updateEventList = async (req, res) => {
    const { eventLine, playing } = req.body;
    let placeholder = false;

    try {
        const mostRecentMatch = await MatchHistory.findOne().sort({ order: -1 });
        const user = await Userdb.find().exec();

        let promises = [];



        user.forEach(async (user) => {
            playing.forEach((playingList) => {
                if (playingList == user.name) {
                    user.pointsPlayed++;
                    user.cPointsPlayed++;
                }
            });

            eventLine.forEach(eventInstance => {
                if (eventInstance != "point"){
                    if (eventInstance[0] == user.name) {
                        switch(eventInstance[1]){
                            case Action.GOAL:
                                user.goals++;
                                user.cGoals++;
                                break;
                            case Action.ASSIST:
                                user.assists++;
                                user.cAssists++;
                                break;
                            case Action.BLOCK:
                                user.blocks++;
                                user.cBlocks++;
                                break;
                            case Action.TURNOVER:
                                user.turnovers++;
                                user.cTurnovers++;
                                break;
                        }
                    }
                }
            })
            promises.push(user.save());
        });

        eventLine.forEach((e) => {
            mostRecentMatch.eventList.push(e);
            if (e.length >= 1) {
                if (e[1] == Action.GOAL) {
                    mostRecentMatch.ourScore++;
                    placeholder = true;
                }
            }
        });

        if (!placeholder) {
            mostRecentMatch.eventList.push("Opponents scored")
            mostRecentMatch.theirScore++;
        }

        mostRecentMatch.eventList.push(`${mostRecentMatch.ourScore}-${mostRecentMatch.theirScore}`)
        const updatedMatchHistory = await mostRecentMatch.save();

        await Promise.all(promises);

        res.json({
            message: 'Event list updated successfully',
            matchHistory: updatedMatchHistory,
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const gameOver = async (req, res) => {
    try {
        const users = await Userdb.find().exec();
        const matchHistoryData = await MatchHistory.find().exec();

        if (!users || !matchHistoryData) {
            res.status(500).send({ message: 'Could not access information.' });
            return;
        }

        users.forEach(user => {
            user.cGoals = 0;
            user.cAssists = 0;
            user.cBlocks = 0;
            user.cTurnovers = 0;
            user.cPointsPlayed = 0;
        });

        // Save the changes to each user
        const usersPromises = users.map(user => user.save());
        await Promise.all(usersPromises);

        const selectedMatch = matchHistoryData[matchHistoryData.length - 1];

        // Determine whether the team won or lost
        if (selectedMatch.ourScore >= selectedMatch.theirScore) {
            selectedMatch.win = true;
        } else {
            selectedMatch.win = false;
        }

        // Save the changes to the selectedMatch
        await selectedMatch.save();
        res.render('game_over.ejs', { users, selectedMatch: selectedMatch });

    } catch (err) {
        res.status(500).send({ message: err.message || 'Could not access information.' });
    }
};
