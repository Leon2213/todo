package com.example.todoapp.services;

import com.example.todoapp.dtos.reqeusts.CreateNoteRequest;
import com.example.todoapp.dtos.responses.NoteResponse;
import com.example.todoapp.entities.Note;
import com.example.todoapp.entities.User;
import com.example.todoapp.repository.NoteRepository;
import com.example.todoapp.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<NoteResponse> getNotesForCurrentUser() {
        return noteRepository.findAllByUser(getCurrentUser()).stream()
                .map(note -> new NoteResponse(note.getId(), note.getContent(), false))
                .collect(Collectors.toList());
    }

    public NoteResponse createNote(CreateNoteRequest request) {
        Note note = new Note();
        note.setContent(request.content());
        note.setUser(getCurrentUser());
        Note saved = noteRepository.save(note);
        return new NoteResponse(saved.getId(), saved.getContent(), false);
    }

    public NoteResponse updateNote(Long id, CreateNoteRequest request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Du får inte ändra denna todo.");
        }

        note.setContent(request.content());
        Note updated = noteRepository.save(note);
        return new NoteResponse(updated.getId(), updated.getContent(), false);
    }

    public void deleteNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Du får inte ta bort denna todo.");
        }

        noteRepository.delete(note);
    }
}
