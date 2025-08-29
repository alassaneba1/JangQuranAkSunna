package org.jangquranaksunna.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final Key key;
    private final long ttlSeconds;

    public JwtService(
            @Value("${security.jwt.secret:dev-secret-change-me}") String secret,
            @Value("${security.jwt.ttl-seconds:86400}") long ttlSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.ttlSeconds = ttlSeconds;
    }

    public String generate(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(ttlSeconds)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
