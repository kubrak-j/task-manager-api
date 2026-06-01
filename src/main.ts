import express from "express";
import { prisma } from './prisma.js';
import { Prisma } from '@prisma/client';
import * as z from "zod";

const app = express();
app.use(express.json());
const port = 8000;

app.listen(port, () => {
    console.log(`The server is running`);
    console.log(`listening on port ${port}`);
});

const postTaskSchema = z.object({
    title: z.string(),
    difficult: z.string(),
});

const patchTaskSchema = z.object({
    completed: z.boolean(),
});

app.get(`/tasks`, async (req, res) => {
    try {
        const allTasks = await prisma.task.findMany();
        res.json(allTasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get(`/tasks/:id`, async (req, res) => {
    try {
        const taskId = Number(req.params.id);
        const foundTask = await prisma.task.findUnique({ 
            where: { 
                id: taskId
            } 
        });
        if(foundTask === null){
            return res.status(404).json({message: "Task not found"});
        }
        res.json(foundTask);  
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }   
});

app.post(`/tasks`, async (req, res) => {
    try {
        const parsed = postTaskSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({ message: parsed.error.issues });
        }

        const newTask = await prisma.task.create({ 
            data: { 
                title: parsed.data.title,
                difficult: parsed.data.difficult,
                completed: false,
            } 
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.patch(`/tasks/:id`, async (req, res) => {
    try {
        const parsed = patchTaskSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message: parsed.error.issues});
        }
        const taskId = Number(req.params.id);
        const patchedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                completed: parsed.data.completed
            }
        });
        res.json(patchedTask);
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === `P2025`) {
                return res.status(404).json({ message: "Task not found" });
            }
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete(`/tasks/:id`, async (req, res) => {
    try {
        const taskId = Number(req.params.id);
        const deletedTask = await prisma.task.delete({
            where: { 
                id: taskId 
            },
        });
        res.json(deletedTask);
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === `P2025`) {
                return res.status(404).json({ message: "Task not found" });
            }
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
