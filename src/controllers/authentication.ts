import express from "express";
import { authentication, random } from "../helpers";

import { getUserByEmail, createUser } from "../db/users";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const salt = random();

        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        res.cookie('ELEVATED-SESSION', user.authentication.sessionToken, {domain: 'localhost', path: '/'})
        return res.status(200).json({ message: "Logged in", user }).end();

    } catch (error) {
        console.log(error);
        return res.status(400);
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;


        if (!email || !password || !username) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
        });

        return res.status(200).json({ message: "User created", user }).end();

    } catch (error) {
        console.log(error);
        return res.status(400)
    }
}