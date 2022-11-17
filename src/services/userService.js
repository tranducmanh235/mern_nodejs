import db from "../models/index";

import bcrypt from "bcryptjs";
import e from "express";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password"],
                    where: { email: email },
                    raw: true,
                });

                // có thể cùng thời điểm, ai đó xóa user nên phải check tiếp
                if (user) {
                    // ==> compare password
                    let check = bcrypt.compareSync(password, user.password); // false

                    // let check = true;

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";

                        // console.log(user);
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found";
                }
            } else {
                // user not found
                userData.errCode = 1;
                userData.errMessage = `Your's email is not exist. Please try other email`;
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
};
