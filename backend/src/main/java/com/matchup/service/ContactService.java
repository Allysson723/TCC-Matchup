package com.matchup.service;

import com.matchup.dto.ContactDto;
import com.matchup.dto.MessageDto;
import com.matchup.enums.MessageType;
import com.matchup.model.Contact;
import com.matchup.model.User;
import com.matchup.model.message.AudioMessage;
import com.matchup.model.message.ImageMessage;
import com.matchup.model.message.Message;
import com.matchup.model.message.TextMessage;
import com.matchup.repository.ContactRepository;
import com.matchup.repository.UserRepository;
import com.matchup.repository.message.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactService {

    public static final int MESSAGE_LIMIT = 50;

    private final ContactRepository contactRepository;

    private final MessageRepository messageRepository;

    private final ImageService imageService;

    private final UserRepository userRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository, MessageRepository messageRepository, ImageService imageService, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.messageRepository = messageRepository;
        this.imageService = imageService;
        this.userRepository = userRepository;
    }


    @Transactional
    public List<ContactDto> getContactsByUser1Id(long user1Id) {
        /*if (contactRepository.findContactsByUser1Id(user1Id).isEmpty()) return null;*/
        List<Contact> contactList = contactRepository.findContactsByUser1Id(user1Id).get();
        System.out.println(contactList);
        List<ContactDto> contactDtoList = new ArrayList<>();
        List<Message> messageList;

        for (Contact contact : contactList) {
            var user2 = contact.getUser2();
            var lastMessageOp = messageRepository.findLastMessageByUser1IdAndUser2Id(user1.getId(), user2.getId());

            ContactDto contactDto = ContactDto.builder()
                    .id(contact.getId())
                    .user1Id(user1.getId())
                    .user2Id(user2.getId())
                    .user2Username(user2.getUsername())
                    .unreadMessages(messageRepository.countUnreadMessagesByReceiverAndSenderUsernames(user1.getUsername(), user2.getUsername()))
                    /*.pinned()*/
                    .profilePicture(imageService.getFormattedProfilePictureById(user2.getId(), 64))
                    .displayed(contact.isDisplayed())
                    .bio(user2.getBio())
                    .build();

            if(lastMessageOp.isPresent()){
                var lastMessage = lastMessageOp.get();
                MessageDto lastMessageDto = MessageDto.builder()
                        .id(lastMessage.getId())
                        .date(lastMessage.getDate())
                        .receiverId(lastMessage.getReceiver().getId())
                        .messageType(lastMessage.getClass().getSimpleName())
                        .hashedText(lastMessage.getClass().getSimpleName().equals("TextMessage") ? ((TextMessage)lastMessage).getHashedText(): "")
                        .build();
                contactDto.setLastMessage(lastMessageDto);
            }
            contactDtoList.add(contactDto);

            /*messageList = messageRepository.findMessagesBySenderIdAndReceiverId(contactDto.getUser1Id(), contactDto.getUser2Id()).get();
            //setting message limit
            messageList = messageList.stream().limit(MESSAGE_LIMIT).collect(Collectors.toList());
            System.out.println(messageList);*/

            /*for (Message message : messageList) {
                MessageDto messageDto = new MessageDto();
                messageDto.setId(message.getId());
                messageDto.setDate(message.getDate());
                messageDto.setSenderId(message.getSender().getId());
                messageDto.setReceiverId(message.getReceiver().getId());
                messageDto.setViewed(message.isViewed());
                String messageType = message.getClass().getSimpleName();

                switch (messageType) {
                    case "TextMessage" -> {
                        messageDto.setMessageType(MessageType.TEXT);
                        TextMessage textMessage = (TextMessage) message;
                        messageDto.setHashedText(textMessage.getHashedText());
                    }
                    case "AudioMessage" -> {
                        messageDto.setMessageType(MessageType.AUDIO);
                        AudioMessage audioMessage = (AudioMessage) message;
                        messageDto.setHashedAudio(audioMessage.getHashedAudio().getHashedAudio().toString());
                    }
                    case "ImageMessage" -> {
                        messageDto.setMessageType(MessageType.IMAGE);
                        ImageMessage imageMessage = (ImageMessage) message;
                        //messageDto.setHashedImage(imageMessage.getHashedImage()); //requires convertion
                    }
                    default -> {
                        System.out.println("Tipo de mensagem desconhecido: " + messageType);
                    }
                }
                messageDtoList.add(messageDto);
            }*/
            //contactDto.setMessages(messageDtoList);
            //System.out.println("\n-------------------------" + contactDto.getMessages() + "\n---------------------");

        }
        System.out.println(contactList);
        System.out.println("contactdto:" + contactDtoList);
        return contactDtoList;

    }

}
