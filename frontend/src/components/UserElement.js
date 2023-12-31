import React from "react";
import {
    Box,
    Badge,
    Stack,
    Avatar,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import {Chat} from "phosphor-react";
import {client, socket} from "../socket";
import {useNavigate} from "react-router-dom";
import {ROUTE_PROFILE} from "../routes";
import {useDispatch, useSelector} from "react-redux";
import {dispatch} from "../redux/store";
import {ChangeContactDisplay, SetCurrentConversation, SetCurrentConversationFake} from "../redux/slices/conversation";
import {SelectConversation} from "../redux/slices/app";
import ChatComponent from "../pages/dashboard/Conversation";


const StyledChatBox = styled(Box)(({theme}) => ({
    "&:hover": {
        cursor: "pointer",
    },
}));

const StyledBadge = styled(Badge)(({theme}) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

const UserElement = ({img, firstName, lastName, online, _id}) => {
    const {user_id} = useSelector((state) => state.auth);
    const theme = useTheme();

    const name = `${firstName} ${lastName}`;

    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            variant="dot"
                        >
                            <Avatar alt={name} src={img}/>
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img}/>
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Button
                        onClick={() => {
                            socket.emit("friend_request", {to: _id, from: user_id}, () => {
                                alert("request sent");
                            });
                        }}
                    >
                        Send Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendRequestElement = ({
                                  img,
                                  firstName,
                                  lastName,
                                  incoming,
                                  missed,
                                  online,
                                  id,
                              }) => {
    const {user_id} = useSelector((state) => state.auth);
    const theme = useTheme();

    const name = `${firstName} ${lastName}`;

    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            variant="dot"
                        >
                            <Avatar alt={name} src={img}/>
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img}/>
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Button
                        onClick={() => {
                            //  emit "accept_request" event
                            socket.emit("accept_request", {request_id: id});
                        }}
                    >
                        Accept Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

// FriendElement

const FriendElement = ({
                           username,
                           profilePicture,
                           incoming,
                           missed,
                           online,
                           id,
                           handleClose
                       }) => {
    const theme = useTheme();
    const {user_id} = useSelector((state) => state.auth);
    const {conversations} = useSelector((state) => state.conversation.direct_chat);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const name = `${username}`;

    const handleShowContact = (id) => {
        client.publish({
            destination: `/app/change-contact-display`,
            body: JSON.stringify({id: id})
        });
        dispatch(ChangeContactDisplay(id));
    };

    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack
                    direction="row"
                    alignItems={"center"} spacing={2}
                    onClick={() => navigate(`${ROUTE_PROFILE}/${username}`)}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            variant="dot"
                        >
                            <Avatar alt={name} src={profilePicture}/>
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={profilePicture}/>
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{username}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <IconButton
                        onClick={() => {

                            let filteredContact = conversations.length != 0 ?
                                conversations.filter(contact => contact.name == username) : [];

                            if (filteredContact && filteredContact.length != 0) {
                                let contact = filteredContact[0];
                                if (!contact.displayed) {
                                    contact = {...contact, displayed: true}
                                    handleShowContact(filteredContact[0].id);
                                }
                                dispatch(SelectConversation({room_id: contact.id}));
                            } else {
                                const contact_fake = {
                                    name: username,
                                    online: true,
                                    img: profilePicture,
                                    user_id: id,
                                }
                                console.log("contact_fake");
                                dispatch(SetCurrentConversationFake(contact_fake));
                            }
                            handleClose();

                        }}
                    >
                        <Chat/>
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

export {UserElement, FriendRequestElement, FriendElement};
