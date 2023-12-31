import {useCustomTheme} from "../../contexts/CustomThemeContext";
import getTheme from "../../theme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import {AppBar, TextField, Toolbar} from "@mui/material";
import {Message, MESSAGE_TYPE, TextMessageToBeSent} from "../../model/message";
import {useState} from "react";
import {Contact} from "../../model/contact";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';
import {useContact} from "../../contexts/ContactsContext";

/*import socket from "../../api/WebSocketService";*/


interface ChatFooterProps {
    contact: Contact;
    updateContactsWithMessage: (contactId: bigint, message: Message) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({contact}) => {
    const {sendTextMessage} = useContact();

    const {theme: mode} = useCustomTheme();
    const theme = getTheme(mode);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const message: TextMessageToBeSent = {
                senderId: contact.user1Id,
                receiverId: contact.user2Id,
                messageType: MESSAGE_TYPE.TEXT,
                hashedText: newMessage,
            };

            sendTextMessage(message);
        }
    }

    return (
        <Box>
            <CssBaseline/>
            <Grid
                container
                direction="row"
                mt={'10px'}
            >
                <Grid item xs={12} md={12}>
                    <AppBar
                        position="relative"
                        color="default"
                        elevation={0}
                        sx={{
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            borderRadius: '0px',
                            marginTop: '0px',
                            bgcolor: 'background.default',
                            top: 'auto',
                            bottom: 0,
                        }}
                    >
                        <Toolbar>
                            <Grid container alignItems="center">
                                <Grid item xs={10} justifyContent={'start'}>
                                    <TextField
                                        value={newMessage}
                                        fullWidth
                                        onChange={event => setNewMessage(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={2} justifyContent={'center'}>
                                    <IconButton onClick={handleSendMessage}>
                                        <SendIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ChatFooter;
