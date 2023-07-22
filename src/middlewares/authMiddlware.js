// eslint-disable-next-line no-unused-vars
import _ from "lodash";
import Model from "../models/index.js";

import GlobalError from "../libs/globalError.js";

import { findUser } from "../services/index.js";
import { comparePassord } from "../libs/passwordOp.js";

const { user } = Model;

export const signinAuth = async (req, res, next) => {

    const { email, password } = req.body;
    const resultUser = await findUser(user, email);
    if (!resultUser) {
        return next(new GlobalError("Invalid user email", 400));
    }
    if (!(await comparePassord(password, resultUser.password))) {
        return next(new GlobalError("Invalid user password", 400));
    }

    if (resultUser && resultUser.toJSON().blocked) {
        return next(
        new GlobalError(
            "User is blocked, please contact the system administrator",
            401
        )
        );
    }
    req.user = resultUser.toJSON();
    next();
};