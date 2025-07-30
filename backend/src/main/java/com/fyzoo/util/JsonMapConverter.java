package com.fyzoo.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Converter(autoApply = false)
public class JsonMapConverter implements AttributeConverter<Map<String, Set<Long>>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Set<Long>> attribute) {
        if (attribute == null) return null;
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalArgumentException("Could not convert map to JSON string", e);
        }
    }

    @Override
    public Map<String, Set<Long>> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return new HashMap<>();
        try {
            return objectMapper.readValue(dbData, new TypeReference<Map<String, Set<Long>>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Could not convert JSON string to map", e);
        }
    }
} 