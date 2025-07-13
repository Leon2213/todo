package com.example.todoapp.services;

import com.example.todoapp.dtos.reqeusts.CreateNoteRequest;
import com.example.todoapp.dtos.reqeusts.NoteOrderUpdateRequest;
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
        return noteRepository.findAllByUserOrderByPositionAsc(getCurrentUser()).stream()
                .map(note -> new NoteResponse(note.getId(), note.getContent(), note.isDone()))
                .collect(Collectors.toList());
    }

    public NoteResponse createNote(CreateNoteRequest request) {
        Note note = new Note();
        note.setContent(request.content());
        note.setDone(request.done());
        note.setUser(getCurrentUser());

        // Hitta högsta position för användarens todos och lägg till 1
        Integer maxPosition = noteRepository.findMaxPositionByUser(getCurrentUser());
        note.setPosition(maxPosition == null ? 0 : maxPosition + 1);

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
        note.setDone(request.done());
        Note updated = noteRepository.save(note);
        return new NoteResponse(updated.getId(), updated.getContent(), updated.isDone());
    }

    public void updateNoteOrder(List<NoteOrderUpdateRequest> orderUpdates) {
        User user = getCurrentUser();

        List<Note> notesToUpdate = orderUpdates.stream()
                .map(update -> {
                    Note note = noteRepository.findById(update.id())
                            .orElseThrow(() -> new RuntimeException("Note not found: " + update.id()));

                    if (!note.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Du får inte ändra denna todo.");
                    }

                    note.setPosition(update.position());
                    return note;
                })
                .collect(Collectors.toList());

        noteRepository.saveAll(notesToUpdate);
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
