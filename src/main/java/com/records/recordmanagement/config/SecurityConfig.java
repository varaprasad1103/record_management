package com.records.recordmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for H2 Console
                .csrf(csrf -> csrf.disable())

                // Allow H2 Console frames
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Allow requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/jdbc:h2:mem:c5c5d07e-855c-4363-bc52-837b7df026ec").permitAll()
                        .anyRequest().permitAll()
                )

                // Default login (for now)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
