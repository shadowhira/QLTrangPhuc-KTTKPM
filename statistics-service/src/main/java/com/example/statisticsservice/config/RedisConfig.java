package com.example.statisticsservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Cấu hình Redis cho việc lưu trữ cache
 */
@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * Cấu hình Redis Cache Manager
     *
     * @param connectionFactory Redis connection factory
     * @return RedisCacheManager đã được cấu hình
     */
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        // Cấu hình serializer cho key và value
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60)) // TTL mặc định là 60 phút
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));

        // Tạo cache manager với cấu hình đã định nghĩa
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(cacheConfig)
                .withCacheConfiguration("thongKeDoanhThu",
                        cacheConfig.entryTtl(Duration.ofMinutes(30))) // TTL 30 phút cho cache thống kê doanh thu
                .withCacheConfiguration("thongKeDoanhThuKhachHang",
                        cacheConfig.entryTtl(Duration.ofMinutes(30))) // TTL 30 phút cho cache thống kê doanh thu khách hàng
                .build();
    }
}
