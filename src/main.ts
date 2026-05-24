import express from "express";

const app = express();
const port = 8000;

interface Task {
    id: number;
    title: string;
    difficult: string;
    completed: boolean;
};

const tasks: Task[] = [
    {id: 1, title: `walk the dog`, difficult: `easy`, completed: false},
    {id: 2, title: `go to the gym`, difficult: `hard`, completed: false},
    {id: 3, title: `take a shower`, difficult: `easy`, completed: false},
    {id: 4, title: `read a chapter of book`, difficult: `medium`, completed: false},
    {id: 5, title: `practice French`, difficult: `hard`, completed: false}
];

app.listen(8000, () => {
    console.log(`The server is running`);
    console.log(`listening on port ${port}`);
});

app.get(`/tasks`, (req, res) => {
    res.json(tasks);
});

app.get(`/tasks/:id`, (req, res) => {
    const taskId : number = Number(req.params.id);
    const foundTask = tasks.find(item => item.id === taskId);
        
    if(!foundTask){
        return res.status(404).json({message: "Task not found"});
    }

    res.json(foundTask);   
});
