package com.example.todoapp.repository;

import com.example.todoapp.entities.Note;
import com.example.todoapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByUser(User user);
}
