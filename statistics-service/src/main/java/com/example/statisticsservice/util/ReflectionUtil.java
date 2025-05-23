package com.example.statisticsservice.util;

import java.lang.reflect.Field;
import java.util.Arrays;

/**
 * Utility class for working with reflection
 */
public class ReflectionUtil {

    /**
     * Get field value from object using reflection
     *
     * @param object    Object to get field value from
     * @param fieldName Field name
     * @return Field value
     */
    public static Object getFieldValue(Object object, String fieldName) {
        try {
            Field field = findField(object.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                return field.get(object);
            }
        } catch (Exception e) {
            System.err.println("Error getting field value: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Set field value to object using reflection
     *
     * @param object    Object to set field value to
     * @param fieldName Field name
     * @param value     Value to set
     */
    public static void setFieldValue(Object object, String fieldName, Object value) {
        try {
            Field field = findField(object.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                field.set(object, value);
            }
        } catch (Exception e) {
            System.err.println("Error setting field value: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Find field in class or its superclasses
     *
     * @param clazz     Class to search in
     * @param fieldName Field name
     * @return Field or null if not found
     */
    private static Field findField(Class<?> clazz, String fieldName) {
        return Arrays.stream(clazz.getDeclaredFields())
                .filter(field -> field.getName().equals(fieldName))
                .findFirst()
                .orElseGet(() -> {
                    Class<?> superclass = clazz.getSuperclass();
                    if (superclass != null && superclass != Object.class) {
                        return findField(superclass, fieldName);
                    }
                    return null;
                });
    }
}
