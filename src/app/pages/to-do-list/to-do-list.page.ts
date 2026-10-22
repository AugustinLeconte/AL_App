import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonList, IonNote, IonItem, IonLabel, IonCheckbox} from '@ionic/angular';
import { TasksService } from '../../services/tasks/tasks.service';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { CreateTaskFormComponent } from '../../components/create-task-form/create-task-form.component';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.page.html',
  styleUrls: ['./to-do-list.page.scss'],
  imports: [IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonButtons, 
    IonBackButton, 
    IonButton, 
    IonIcon, 
    IonList, 
    IonNote, 
    DatePipe,
    CreateTaskFormComponent,
  IonItem, IonLabel, IonCheckbox]
})
export class ToDoListPage implements OnInit {
  private tasksSubscription!: Subscription;

  public tasks: any[] = [];
  public today: Date = new Date();
  public isCreateTaskFormOpen: boolean = false;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksSubscription = this.tasksService.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  public deleteTask(taskId: string) {
    this.tasksService.deleteTask(taskId);
  }

  public toggleTaskStatus(taskId: string) {
    this.tasksService.toggleTaskStatus(taskId);
  }

  public updateTask(task: Task) {
    this.tasksService.updateTask(task);
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  public getTimeRemaining(expirationDate: Date): string {
    if (!expirationDate) return '';

    const now = new Date().getTime();
    const target = new Date(expirationDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return 'Expiré';
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `Reste ${days} j`;
    } else if (hours > 0) {
      return `Reste ${hours} h`;
    } else {
      return `Reste ${minutes} min`;
    }
  }

}
