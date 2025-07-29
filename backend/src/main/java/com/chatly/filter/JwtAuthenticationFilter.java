package com.chatly.filter;

import com.chatly.model.CustomUserDetails;
import com.chatly.model.User;
import com.chatly.repository.UserRepository;
import com.chatly.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Skip JWT auth for all /auth/** endpoints
        String path = request.getServletPath();
        return path.startsWith("/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader == null) {
            System.out.println("[JWT] No Authorization header present");
        } else if (!authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT] Authorization header does not start with 'Bearer '");
        } else {
            token = authHeader.substring(7);
            try {
                Claims claims = jwtUtil.extractClaims(token);
                email = claims.getSubject();
                System.out.println("[JWT] Extracted email from token: " + email);
            } catch (Exception e) {
                System.out.println("[JWT] Invalid JWT: " + e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                System.out.println("[JWT] No user found with email: " + email);
            } else if (jwtUtil.validateToken(token, user)) {
                System.out.println("[JWT] Token valid for user: " + email);
                CustomUserDetails userDetails = new CustomUserDetails(user);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("[JWT] Token invalid for user: " + email);
            }
        }

        filterChain.doFilter(request, response);
    }
}
