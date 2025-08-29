package org.jangquranaksunna.web;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.jangquranaksunna.domain.entity.User;
import org.jangquranaksunna.domain.repository.UserRepository;
import org.jangquranaksunna.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class AuthController {

    private record ApiResponse<T>(T data, boolean success, String message, String timestamp) {}
    private record LoginRequest(String email, String password, Boolean rememberMe) {}

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        User user = (User) auth.getPrincipal();
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());
        String token = jwtService.generate(user.getEmail(), claims);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        return ResponseEntity.ok(new ApiResponse<>(data, true, "OK", Instant.now().toString()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) auth.getPrincipal();
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("name", user.getName());
        data.put("roles", user.getRoles());
        data.put("lang", user.getLang());
        data.put("status", user.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(data, true, "OK", Instant.now().toString()));
    }
}
