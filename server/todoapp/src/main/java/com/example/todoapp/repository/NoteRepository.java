package com.example.todoapp.repository;

import com.example.todoapp.entities.Note;
import com.example.todoapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findAllByUserOrderByPositionAsc(User user);

    @Query("SELECT MAX(n.position) FROM Note n WHERE n.user = :user")
    Integer findMaxPositionByUser(@Param("user") User user);
}
