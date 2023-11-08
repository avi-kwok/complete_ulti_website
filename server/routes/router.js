
import express from 'express';
import * as services from '../services/render.js';
import * as controller from '../controller/controller.js';

const route = express.Router();

route.get('/', services.homeRoutes);

route.get('/add-user', services.add_user);
route.get('/update-user', services.update_user);

route.get('/leaderboard', controller.leaderboard);


//match-history
route.get('/match-history', controller.match_history);
route.post('/api/matchHistory', controller.createMatchHistory);
route.delete('/api/matchHistory/:id', controller.deleteMatchHistory);
route.get('/api/matchHistory/:id', controller.getMatchHistoryById);


//live-tracking
route.get('/start-game', controller.startGame);
route.get('/live-tracking', controller.liveTracking);
route.put('/api/updateEventList', controller.updateEventList);

route.get('/game-over', controller.gameOver);

// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.deleteUser);

//found in leaderboard
route.put('/api/users', controller.hardReset)
export default route;
