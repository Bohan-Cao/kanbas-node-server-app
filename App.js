import AssignmentRoutes from "./Kanbas/assignments/routes.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import Hello from "./Hello.js";
import Lab5 from "./Lab5.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());
Hello(app);
ModuleRoutes(app);
AssignmentRoutes(app)
CourseRoutes(app);
Lab5(app);
app.listen(process.env.PORT || 4000);