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
        name,
        email,
        password
    };
    if (!user.name) {return res.status(400).json({
        statusCode: 400,
        message: "Name should be provided",
    })} else {
        users.push(user);
        const token = JWT.sign({name, email}, process.env.SECRET_KEY, {expiresIn: "24h"})
        res.json({token})
        return res.status(201);
    }
} catch {
        res.sendStatus(500);
    }
};

const loginUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const findUser = users.find((user) => user.name === name);
    if(!findUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })};
    try {
        if (await bcrypt.compare(req.body.password, findUser.password))
        {
            const token = JWT.sign({name, email}, process.env.SECRET_KEY, {expiresIn: "24h"})
            res.json({token})
        } else {
            return res.status(401).json({
                statusCode: 401,
                message: "Password does not match our records.",
            })
        }
    } catch {
        res.sendStatus(500);
    }
}

const getUser = (req, res) => {
    const id = req.params.id;
    const findUser = users.find((user) => user.id === id);
    if(!findUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })}
    res.json(findUser);
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const updateUser = users.find((user) => user.id === id);
    if(!updateUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })}
    if (name) {
        updateUser.name = name;
    }
    if (email) {
        updateUser.email = email;
    }
    if (password) {
        updateUser.password = hashPassword;
    }
    res.json(updateUser);
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    const deleteUser = users.find((user) => user.id === id);
    if(!deleteUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })};
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