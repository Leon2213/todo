package com.example.todoapp.controllers;

import com.example.todoapp.dtos.reqeusts.CreateNoteRequest;
import com.example.todoapp.dtos.reqeusts.NoteOrderUpdateRequest;
import com.example.todoapp.dtos.responses.NoteResponse;
import com.example.todoapp.services.NoteService;
import com.example.todoapp.services.AuthenticatedUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/todos")
public class NoteController {

    private final NoteService noteService;
    private final AuthenticatedUserService userService;

    public NoteController(NoteService noteService, AuthenticatedUserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getNotes() {
        return ResponseEntity.ok(noteService.getNotesForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@RequestBody CreateNoteRequest request) {
        return ResponseEntity.ok(noteService.createNote(request));
    }

    @PostMapping("/reorder")
    public ResponseEntity<?> reorderNotes(@RequestBody List<NoteOrderUpdateRequest> orderUpdates) {
        noteService.updateNoteOrder(orderUpdates);
        return ResponseEntity.ok("Note order updated");
    }


    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long id, @RequestBody CreateNoteRequest request) {
        return ResponseEntity.ok(noteService.updateNote(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}
