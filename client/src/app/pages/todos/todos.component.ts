import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TodoService } from '../../services/todo.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Todo {
  id: number,
  content: string,
  done: boolean
  position: number
  color?: string
}

@Component({
  selector: 'app-todos',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, FormsModule, CommonModule, DragDropModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})

export class TodosComponent implements OnInit {

  colorOptions = ['#fffbcc', '#c8e6c9', '#bbdefb', '#ffcdd2']; // exempel: gul, grön, blå, röd
  colorPickerVisibleForTodoId: number | null = null;
  private baseUrl = 'http://localhost:8080/api/todos';
  todos: Array<Todo> = [];

  constructor(private http: HttpClient, private todoService: TodoService) {
  }

  ngOnInit() {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.putTodosRightOrder();
      },
      error: (err) => {
        console.error('Kunde inte hämta todos', err);
      }
    });
  }

  addTodo() {
    this.todoService.createTodo({ content: '', done: false }).subscribe((createdTodo) => {
      this.todos.push(createdTodo);
    });
  }

  removeTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  saveTodo(todo: Todo) {
    this.todoService.updateTodo(todo).subscribe({
      next: () => {
        console.log('Todo sparad');
      },
      error: (err) => {
        console.error('Fel vid sparande', err);
      }
    });
  }
  drop(event: CdkDragDrop<any[]>) {
    // Uppdatera lokal array efter drag-drop
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);

    // Uppdatera position på varje todo baserat på index i arrayen
    this.todos.forEach((todo, index) => {
      todo.position = index;
    });

    // Skapa en lista som ska skickas till backend med id och ny position
    const orderUpdates = this.todos.map(todo => ({
      id: todo.id,
      position: todo.position
    }));

    // Anropa tjänst som sparar ordningen på backend
    this.todoService.updateOrder(orderUpdates).subscribe({
      next: () => {
        console.log('Ny ordning sparad på servern');
      },
      error: (err) => {
        console.error('Fel vid sparande av ny ordning', err);
      }
    });
  }

  putTodosRightOrder() {
    this.todos = this.todos.sort((a, b) => a.position - b.position);
  }

  toggleColorPicker(todo: Todo) {
    if (this.colorPickerVisibleForTodoId === todo.id) {
      this.colorPickerVisibleForTodoId = null;
    } else {
      this.colorPickerVisibleForTodoId = todo.id;
    }
  }

  selectColor(todo: Todo, color: string) {
    todo.color = color;
    this.colorPickerVisibleForTodoId = null;
    this.saveTodo(todo);  // spara ändringen, du kan modifiera saveTodo för att hantera färg
  }


}


