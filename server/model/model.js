
import mongoose from 'mongoose';

const matchHistorySchema = new mongoose.Schema({
    order: {
        type: Number,
        unique: true,
        required: true,
    },
    team: String,
    win: Boolean,
    ourScore: Number,
    theirScore: Number,
    date: String,
    od: String,
    location: String,
    eventList: Array
});


const schema = new mongoose.Schema({
    name: String,
    age: String,
    number: String,
    gender: String,
    position: String,
    contact: String,
    status: String,
    note: String,
    assists: Number,
    goals: Number,
    turnovers: Number,
    blocks: Number,
    pointsPlayed: Number,
    cAssists: Number,
    cGoals: Number,
    cTurnovers: Number,
    cBlocks: Number,
    cPointsPlayed: Number
});

const MatchHistory = mongoose.model('MatchHistory', matchHistorySchema);
const Userdb = mongoose.model('userdb', schema);

export { MatchHistory, Userdb };
