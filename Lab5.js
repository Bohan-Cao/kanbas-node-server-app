const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
};

const module = {
    id: "module1",
    name: "Introduction to NodeJS",
    description: "Learn NodeJS",
    course: "NodeJS 101"
};

const todos = [
    { id: 1, title: "Task 1", completed: false},
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
];

// Lab5 is a function that sets up routes for an Express application.
const Lab5 = (app) => {
    // Sets up a GET route at "/a5/welcome" that sends a welcome message
    app.get('/a5/welcome', (req, res) => {
        res.send('Welcome to Assignment 5');
    });
    app.get("/a5/assignment", (req, res) => {
        res.json(assignment);
    });
    app.get("/a5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });
    app.get("/a5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    });
    app.get("/a5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = parseInt(newScore);
        res.json(assignment.score);
    });
    app.get("/a5/assignment/completed/:newCompleted", (req, res) => {
        const { newCompleted } = req.params;
        assignment.completed = newCompleted;
        res.json(assignment.completed);
    });

    app.get("/a5/module", (req, res) => {
        res.json(module);
    });
    app.get("/a5/module/name", (req, res) => {
        res.json(module.name);
    });
    app.get("/a5/module/name/:newName", (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
    });
    app.get("/a5/module/description/:newDescription", (req, res) => {
        const { newDescription } = req.params;
        module.description = newDescription;
        res.json(module);
    });

    // Sets up a GET route at "/a5/add/:a/:b" for adding two numbers
    // :a and :b are URL parameters that will be used to capture numbers from the URL
    app.get("/a5/add/:a/:b", (req, res) => {
        // Extracts 'a' and 'b' from the request parameters
        const { a, b } = req.params;
        // Converts 'a' and 'b' to integers and adds them
        const sum = parseInt(a) + parseInt(b);
        // Sends the sum back as a response, converted to a string
        res.send(sum.toString());
    });

    app.get("/a5/subtract/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const sum = parseInt(a) - parseInt(b);
        res.send(sum.toString());
    });

    app.get("/a5/calculator", (req, res) => {
        const { a, b, operation } = req.query;
        let result = 0;
        switch (operation) {
            case "add":
                result = parseInt(a) + parseInt(b);
                break;
            case "subtract":
                result = parseInt(a) - parseInt(b);
                break;
            case "multiply":
                result = parseInt(a) * parseInt(b);
                break;
            case "divide":
                result = parseInt(a) / parseInt(b);
                break;
            default:
                result = "Invalid operation";
        }
        res.send(result.toString());
    });

    app.get("/a5/multiply/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const multiply = parseInt(a) * parseInt(b);
        res.send(multiply.toString());
    });

    app.get("/a5/divide/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const divide = parseInt(a) / parseInt(b);
        res.send(divide.toString());
    });

    app.post("/a5/todos", (req, res) => {
        const newTodo = {
            ...req.body,
            id: new Date().getTime(),
        };
        todos.push(newTodo);
        res.json(newTodo);
    });

    app.get("/a5/todos/create", (req, res) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
        };
        todos.push(newTodo);
        res.json(todos);
    });

    app.get("/a5/todos", (req, res) => {
        // Extract the 'completed' query parameter from the request.
        const { completed } = req.query;
        // Check if the 'completed' query parameter is provided.
        if (completed !== undefined) {
            // Convert the 'completed' string to a boolean. If 'completed' is "true", completedBool will be true, otherwise false.
            const completedBool = completed === "true";
            // Filter the 'todos' array to get only those todos whose 'completed' status matches the 'completed' query parameter.
            const completedTodos = todos.filter(
                (t) => t.completed === completedBool
            );
            // Respond with the filtered todos in JSON format.
            res.json(completedTodos);
            return;
        }
        // If the 'completed' query parameter is not provided, respond with all todos.
        res.json(todos);
    });

    app.delete("/a5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404)
                .json({ message: `Unable to delete Todo with ID ${id}` });
            return;
        }
        todos.splice(todos.indexOf(todo), 1);
        res.sendStatus(200);
    });

    app.put("/a5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404)
                .json({ message: `Unable to update Todo with ID ${id}` });
            return;
        }
        todo.title = req.body.title;
        todo.description = req.body.description;
        todo.due = req.body.due;
        todo.completed = req.body.completed;
        res.sendStatus(200);
    });

    app.get("/a5/todos/:id/delete", (req, res) => {
        // Extract the 'id' parameter from the URL.
        const { id } = req.params;
        // Find the todo item in the 'todos' array that matches the provided 'id'.
        // The 'parseInt' function is used to convert the 'id' from a string to an integer.
        const todo = todos.find((t) => t.id === parseInt(id));
        // Get the index of the found todo item in the 'todos' array.
        const todoIndex = todos.indexOf(todo);
        if (todoIndex !== -1) {
            // If the item was found, remove it from the 'todos' array using the 'splice' method.
            todos.splice(todoIndex, 1);
        }
        res.json(todos);
    })

    app.get("/a5/todos/:id/title/:title", (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
    });

    app.get("/a5/todos/:id/completed/:completed", (req, res) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.completed = completed;
        res.json(todos);
    })

    app.get("/a5/todos/:id/description/:description", (req, res) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.description = description;
        res.json(todos);
    })

    app.get("/a5/todos/:id", (req, res) => {
        const { id } = req.params;
        // Search the 'todos' array to find the todo item that matches the provided 'id'.
        // The 'parseInt' function is used to convert the 'id' from a string to an integer.
        const todo = todos.find((t) => t.id === parseInt(id));
        res.json(todo);
    });
};

export default Lab5;