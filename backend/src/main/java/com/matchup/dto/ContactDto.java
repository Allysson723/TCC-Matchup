package com.matchup.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ContactDto {
    private long id;

    private long user1Id;

    private long user2Id;

    private String user2Username;

    private boolean displayed;

    private MessageDto lastMessage;

    private int unreadMessages;



    private boolean pinned;

    private String profilePicture;

    private String online;

    private String bio;
}
