package com.matchup.repository;

import com.matchup.enums.FriendshipStatus;
import com.matchup.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE (f.user.id = :user1Id AND f.friend.id = :user2Id) OR (f.user.id = :user2Id AND f.friend.id = :user1Id)")
    boolean existsByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    Optional<Friendship> findById(long id);

    @Query("SELECT f FROM Friendship f WHERE (f.user.id = :user1Id AND f.friend.id = :user2Id) OR (f.user.id = :user2Id AND f.friend.id = :user1Id)")
    Optional<Friendship> findByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT f.status FROM Friendship f WHERE (f.user.id = :user1Id AND f.friend.id = :user2Id) OR (f.user.id = :user2Id AND f.friend.id = :user1Id)")
    Optional<String> findStatusByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
