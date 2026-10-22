import { Service } from '@angular/core';
import { Task } from '../../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Service()
export class TasksService {
    private readonly STORAGE_KEY = 'tasks';
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

    constructor() {
        this.loadTasksFromCache();
    }

    private loadTasksFromCache(): void {
        const cachedTasks = localStorage.getItem(this.STORAGE_KEY);
        if (cachedTasks) {
            try {
                const tasks: Task[] = JSON.parse(cachedTasks);
                this.tasksSubject.next(tasks);
            } catch (e) {
                console.error('Erreur lors du parsing des tâches depuis le localStorage', e);
                this.tasksSubject.next([]);
            }
        } else {
            this.tasksSubject.next([]);
        }
    }

    private sortTasks(tasks: Task[]): Task[] {
        return [...tasks].sort((a, b) => {
        if (a.isDone !== b.isDone) {
            return a.isDone ? 1 : -1;
        }

        const dateA = new Date(a.expirationDate).getTime();
        const dateB = new Date(b.expirationDate).getTime();
        return dateA - dateB;
        });
    }

    private updateTasks(tasks: Task[]): void {
        const sortedTasks = this.sortTasks(tasks);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedTasks));
        this.tasksSubject.next(sortedTasks);
    }

    public addTask(task: Task): void {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = [...currentTasks, task];
        this.updateTasks(updatedTasks);
    }

    public deleteTask(taskId: string): void {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.filter(task => task.id !== taskId);
        this.updateTasks(updatedTasks);
    }

    public toggleTaskStatus(taskId: string): void {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, isDone: !task.isDone };
            }
            return task;
        });
        this.updateTasks(updatedTasks);
    }

    public updateTask(updatedTask: Task): void {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.map(task => {
            if (task.id === updatedTask.id) {
                return { ...task, ...updatedTask };
            }
            return task;
        });
        this.updateTasks(updatedTasks);
    }
}