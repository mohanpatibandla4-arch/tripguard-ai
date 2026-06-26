package com.tripguard.user.entity;

import com.tripguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Column(length = 32)
    private String phoneNumber;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailAlertsEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean smsAlertsEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private String timezone = "UTC";
}
