import type { Application, Request, Response } from "express";
import express from "express";

const app: Application = express();
const port = 5000; // The port your express server will be running on.

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

import taskRoutes from "./routes/taskRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

// Todo routes
app.use("/api/todos", todoRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
