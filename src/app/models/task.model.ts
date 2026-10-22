export interface Task {
    id: string;
    title: string;
    note: string;
    expirationDate: Date;
    isDone: boolean;
}