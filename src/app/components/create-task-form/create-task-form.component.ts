import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks/tasks.service';

@Component({
  selector: 'app-create-task-form',
  templateUrl: './create-task-form.component.html',
  styleUrls: ['./create-task-form.component.scss'],
  imports: [IonModal, 
    IonContent, 
    IonButton, 
    IonInput, 
    IonButtons, 
    IonTitle, 
    IonItem, 
    IonToolbar,
    CommonModule,
    IonHeader,
    ReactiveFormsModule,
    IonDatetime,
    IonDatetimeButton,
    IonLabel
  ],
})
export class CreateTaskFormComponent  implements OnInit {
  @Input() public isModalOpen: boolean = false;
  @Output() public closeModal = new EventEmitter();
  public taskForm!: FormGroup;
  public minDate = new Date().toISOString();

  constructor(private fb: FormBuilder, public tasksService: TasksService) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ["", Validators.required],
      note: [""],
      expirationDate: [this.toLocalIso(new Date()), Validators.required],
    })
  }

  public submitForm() {
    if (!this.taskForm.valid) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: this.taskForm.value.title,
      note: this.taskForm.value.note,
      expirationDate: this.taskForm.value.expirationDate,
      isDone: false
    };
    
    this.tasksService.addTask(newTask);
    this.taskForm.reset();
    this.closeModal.emit();
  }

  public cancel() {
    this.closeModal.emit();
  }

  public onWillDismiss(event: any) {}

  private toLocalIso(date: Date | string | null | undefined): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
          `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }
}
