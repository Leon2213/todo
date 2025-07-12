package com.example.todoapp.services;

import com.example.todoapp.entities.User;
import com.example.todoapp.repository.UserRepository;
import com.example.todoapp.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Användarnamn finns redan.");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Felaktigt användarnamn eller lösenord"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Felaktigt användarnamn eller lösenord");
        }

        return jwtUtil.generateToken(username);
    }
}
