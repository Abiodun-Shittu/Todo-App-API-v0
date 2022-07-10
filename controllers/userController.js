import { v4 as uuidv4 } from 'uuid';

// Create an array to store user data
let users = [];

const getUsers = (req, res) => {
    res.json(users)
};

const createUser = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const user = {
        id: uuidv4(),
        email,
        name,
    };
    if (!user.name) {return res.status(400).send('A name should be provided')}
    users.push(user);
    res.status(201).json(user);
};

const getUser = (req, res) => {
    const id = req.params.id;
    const findUser = users.find((user) => user.id === id);
    if(!findUser) {return res.status(404).send('The User with this ID does not exist')}
    res.json(findUser);
};

const updateUser = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const updateUser = users.find((user) => user.id === id);
    if(!updateUser) {return res.status(404).send('The User with this ID does not exist')}
    if (name) {
        updateUser.name = name;
    }
    if (email) {
        updateUser.email = email;
    }
    res.json(updateUser);
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    const deleteUser = users.find((user) => user.id === id);
    if(!deleteUser) {return res.status(404).send('The User with this ID does not exist')};
    users = users.filter((user) => user.id !== id);
    res.json(users);
};

export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};