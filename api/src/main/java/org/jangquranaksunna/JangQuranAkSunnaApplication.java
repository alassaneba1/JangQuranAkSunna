package org.jangquranaksunna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JangQuranAkSunna - Plateforme d'Enseignement Islamique
 * 
 * Application principale Spring Boot pour l'API backend.
 * Cette application gère:
 * - L'authentification et l'autorisation
 * - La gestion des contenus (audio, vidéo, PDF, texte)
 * - Le moteur de recherche
 * - Les téléchargements hors-ligne sécurisés
 * - Le système de donations
 * - L'ingestion de contenus (YouTube, Telegram)
 * - La modération et les workflows de publication
 * 
 * @author JangQuranAkSunna Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableTransactionManagement
public class JangQuranAkSunnaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JangQuranAkSunnaApplication.class, args);
    }
}
