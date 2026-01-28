package com.tracker.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

@Service
public class UserDetailService implements UserDetailsService {

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.client.password}")
    private String clientPassword;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if ("admin".equals(username)) {
            return User.builder()
                    .username("admin")
                    .password(adminPassword)
                    .roles("ADMIN")
                    .build();
        }

        if ("client".equals(username)) {
            return User.builder()
                    .username("client")
                    .password(clientPassword)
                    .roles("CLIENT")
                    .build();
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}
