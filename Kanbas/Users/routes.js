import * as dao from "./dao.js";

let currentUser = null;
export default function UserRoutes(app) {
    const createUser = async(req, res) => {
        const result = dao.findUserByUsername(req.body.username)
        console.log("result is")
        console.log(result)
        if (result) {
            const result_new = {
                code: 400,
                message: "username already exist!"
            }
            res.json(result_new)
        } else {
            const user = await dao.createUser(req.body);
            console.log("req.body")
            console.log(req.body)
            res.json(user);
        }
    };

    const deleteUser = async(req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    const findAllUsers = async(req, res) => {
        const { role } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    const findUserById = async(req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const updateUser = async(req, res) => {
        const { userId } = req.params;
        const status = await dao.updateUser(userId, req.body);
        currentUser = await dao.findUserById(userId);
        res.json(status);
    };
    const signup = async(req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signin = async(req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            console.log("req.session.user")
            console.log(req.session.currentUser)
            res.json(currentUser);
        } else {
            const reuslt = {
                code: 200,
                message: "username is not exist,please check"
            }
            res.json(reuslt);
        }
    };
    const signout = (req, res) => {
        req.session.destory;
        res.sendStatus(200);
    };
    const profile = async(req, res) => {
        const currentUser = req.session["currentUser"];
        console.log(req.session["currentUser"])
        console.log("current user is =>")
        console.log(currentUser)
        if (!currentUser) {
            const result = {
                code: 200,
                message: "user info not work"
            }
            res.json(result);
        } else {
            res.json(currentUser);
        }
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}