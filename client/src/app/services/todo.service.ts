// src/app/services/todo.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  content: string;
  done: boolean;
  position: number;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = 'http://localhost:8080/api/todos'; // ändra om nödvändigt

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const payload = { ...todo }; // spridningsoperator, kopia av objektet
    console.log("Skickar till backend:", payload);
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, payload);
  }

  updateOrder(orderUpdates: { id: number; position: number; }[]) {
    return this.http.post(`${this.apiUrl}/reorder`, orderUpdates);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
