import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // ✅ Load tasks from backend when component loads
    useEffect(() => {
        fetch("/todos")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching todos:", err));
    }, []);

    // ✅ Add new task
    const addTask = () => {
        if (!newTask.trim()) return;
        fetch("/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTask }),
        })
            .then((res) => res.json())
            .then((savedTask) => setTasks([...tasks, savedTask]))
            .catch((err) => console.error("Error adding task:", err));

        setNewTask("");
    };

    // ✅ Delete a task
    const deleteTask = (id) => {
        fetch(`/todos/${id}`, { method: "DELETE" })
            .then(() => setTasks(tasks.filter((task) => task.id !== id)))
            .catch((err) => console.error("Error deleting task:", err));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    📝 My ToDo App
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                        label="Add a new task"
                        variant="outlined"
                        fullWidth
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTask()}
                    />
                    <Button variant="contained" color="primary" onClick={addTask}>
                        Add
                    </Button>
                </Box>

                <List>
                    {tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            divider
                            secondaryAction={
                                <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={task.title} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}

export default App;
