package org.jangquranaksunna.security;

import jakarta.annotation.PostConstruct;
import java.util.Optional;
import org.jangquranaksunna.domain.entity.User;
import org.jangquranaksunna.domain.entity.User.Role;
import org.jangquranaksunna.domain.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserSecurityConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSecurityConfig(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    @PostConstruct
    public void seedAdmin() {
        Optional<User> existing = userRepository.findByEmail("alassane.ba.pro@gmail.com");
        if (existing.isEmpty()) {
            User admin = User.builder()
                    .email("alassane.ba.pro@gmail.com")
                    .passwordHash(passwordEncoder.encode("Baalsane12@"))
                    .name("Admin")
                    .build();
            admin.addRole(Role.ADMIN);
            userRepository.save(admin);
        }
    }
}
