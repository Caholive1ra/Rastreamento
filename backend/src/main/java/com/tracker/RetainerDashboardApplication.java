package com.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RetainerDashboardApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(RetainerDashboardApplication.class);
        app.setDefaultProperties(java.util.Collections.singletonMap("spring.profiles.default", "local"));
        app.run(args);
        System.out.println("Application started successfully");
    }
}
