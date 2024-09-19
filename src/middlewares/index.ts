import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (req: express.Request, res:express.Response, next:express.NextFunction) => {
    try {
        const sessionToken = req.cookies["ELEVATED-SESSION"];

        if (!sessionToken) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        merge(req, { user: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.status(400);
    }
}