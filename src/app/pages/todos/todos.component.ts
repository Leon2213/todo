import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
    id: number,
    text: String,
    done: boolean
  }

@Component({
  selector: 'app-todos',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatCheckbox,FormsModule, CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {

  todos: Array<Todo> = [];

  addTodo(): void {
    this.todos.push({id: this.todos.length+1, text: "", done: false});
  }

  
  removeTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  
}
