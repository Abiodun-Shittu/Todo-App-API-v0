import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

import AppException from '../../utils/exceptions/AppException.js';

dotenv.config();
let users = [];

export function getUsers(req, res) {
    res.json(users)
};

export async function createUser(req, res, next) {
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

        users.push(user);
        const token = JWT.sign({name, email}, process.env.SECRET_KEY, {expiresIn: "24h"})
        res.json({token})

        return res.status(201).json({
            statusCode: 201,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

export async function loginUser(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const findUser = users.find((user) => user.email === email);

        if (await bcrypt.compare(password, findUser.password)) {
            const token = JWT.sign({name: findUser.name, email: findUser.email}, process.env.SECRET_KEY, {expiresIn: "24h"})

            resData.statusCode = 200;
            resData.message = "Success";
            resData.data = {
                token,
            };
        } else {
            throw new AppException(401, "Unable to authenticate user.");
        }

        return res.status(resData.statusCode).json(resData);
    } catch (err) {
        next(err);
    }
}

export function getUser(req, res) {
    const id = req.params.id;
    const findUser = users.find((user) => user.id === id);
    if(!findUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })}
    res.json(findUser);
};

export async function updateUser(req, res) {
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

export function deleteUser(req, res) {
    const id = req.params.id;
    const deleteUser = users.find((user) => user.id === id);
    if(!deleteUser) {return res.status(404).json({
        statusCode: 404,
        message: "Invalid Credentials",
    })};
    users = users.filter((user) => user.id !== id);
    res.json(users);
};