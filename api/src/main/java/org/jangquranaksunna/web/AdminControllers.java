package org.jangquranaksunna.web;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminControllers {

    private record Pagination(int page, int size, long total, int totalPages, boolean hasNext, boolean hasPrevious) {}
    private record PaginatedResponse<T>(List<T> data, Pagination pagination) {}

    private <T> ResponseEntity<PaginatedResponse<T>> empty(int page, int size) {
        int p = Math.max(1, page);
        int s = Math.max(1, size);
        return ResponseEntity.ok(new PaginatedResponse<>(List.of(), new Pagination(p, s, 0, 0, false, false)));
    }

    @GetMapping("/users")
    public ResponseEntity<?> users(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return empty(page, size);
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> teachers(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return empty(page, size);
    }

    @GetMapping("/mosques")
    public ResponseEntity<?> mosques(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return empty(page, size);
    }

    @GetMapping("/contents")
    public ResponseEntity<?> contents(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return empty(page, size);
    }
}
