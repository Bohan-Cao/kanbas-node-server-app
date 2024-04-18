import "dotenv/config";
import AssignmentRoutes from "./Kanbas/assignments/routes.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import Hello from "./Hello.js";
import Lab5 from "./Lab5.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.set('trust proxy', 1)
let whitelist = [process.env.FRONTEND_URL]
    /** other domains if any */
let corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}
app.use(
    cors(corsOptions)
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 1000000,
        sameSite: 'none', // must be 'none' to enable cross-site delivery
        secure: true

    },
    name: "kanbans"
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: 'none', // must be 'none' to enable cross-site delivery
        secure: true,
        domain: process.env.HTTP_SERVER_DOMAIN,
        maxAge: 6000 * 1000000
    };
}

app.use(session(sessionOptions));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
Hello(app);
ModuleRoutes(app);
AssignmentRoutes(app);
CourseRoutes(app);
Lab5(app);
UserRoutes(app);
app.listen(process.env.PORT || 4000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});