

import axios from 'axios';

export const homeRoutes = async (req, res) => {
    try {
        const response = await axios.get('https://ultideploy.onrender.com/api/users');
        res.render('index', { users: response.data });
    } catch (err) {
        res.send(err);
    }
};

export const add_user = (req, res) => {
    res.render('add_user');
};

export const update_user = async (req, res) => {
    try {
        const userdata = await axios.get('https://ultideploy.onrender.com/api/users', { params: { id: req.query.id } });
        res.render("update_user", { user: userdata.data });
    } catch (err) {
        res.send(err);
    }
};
