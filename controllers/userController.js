import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Create an array to store user data
let users = [];

const getUsers = (req, res) => {
    res.json(users)
};

const createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const name = req.body.name;
        const email = req.body.email;
        const password = hashPassword;
        const user = {
        id: uuidv4(),
        email,
        name,
        password
    };
    if (!user.name) {res.status(400).send('A name should be provided')}
    users.push(user);
    res.status(201);

    // Send JSON WEB TOKEN
    const token = JWT.sign(user, process.env.SECRET_KEY)
    res.json({token})
    } catch {
        res.status(500).sendStatus(500);
    }
};

const loginUser = async (req, res) => {
    const name = req.body.name;
    const findUser = users.find((user) => user.name === name);
    if(!findUser) {res.status(404).send('The User with this NAME does not exist')};
    try {
        if (await bcrypt.compare(req.body.password, findUser.password))
        {
            const token = JWT.sign(findUser, process.env.SECRET_KEY)
            res.json({token})
        } else {
            res.send('Password does not match')
        }
    } catch {
        res.status(500).sendStatus(500);
    }
}

const getUser = (req, res) => {
    const id = req.params.id;
    const findUser = users.find((user) => user.id === id);
    if(!findUser) {res.status(404).send('The User with this ID does not exist')}
    res.json(findUser);
};

const updateUser = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const updateUser = users.find((user) => user.id === id);
    if(!updateUser) {res.status(404).send('The User with this ID does not exist')}
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
    if(!deleteUser) {res.status(404).send('The User with this ID does not exist')};
    users = users.filter((user) => user.id !== id);
    res.json(users);
};

export default {
    getUsers,
    createUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
};