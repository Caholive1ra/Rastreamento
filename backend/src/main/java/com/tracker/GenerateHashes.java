package com.tracker;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHashes {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String adminPassword = "password123";
        String clientPassword = "client123";

        System.out.println("Admin password hash: " + encoder.encode(adminPassword));
        System.out.println("Client password hash: " + encoder.encode(clientPassword));
    }
}
