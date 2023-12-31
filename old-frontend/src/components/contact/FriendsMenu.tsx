import {useEffect, useState} from "react";
import {Box, Menu} from "@mui/material";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {useCustomTheme} from "../../contexts/CustomThemeContext";
import getTheme from "../../theme";
import {FriendPayload} from "../../model/user";
import FriendComponent from "./FriendComponent";
import GroupIcon from "@mui/icons-material/Group";
import {getFriendsByUserId} from "../../api/user_requests/friendship";
import {useLoggedUser} from "../../contexts/UserContext";

const FriendsMenu = () => {
    const {loggedUser} = useLoggedUser();
    const {theme: mode} = useCustomTheme();
    const theme = getTheme(mode);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [friends, setFriends] = useState<FriendPayload[]>();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = async (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);

    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const fetchFriends = async () => {
        if (!loggedUser) {
            console.error("Erro: Usuário não está logado.");
            return;
        }
        try {
            const fetchedFriends = await getFriendsByUserId(loggedUser.id);
            setFriends(fetchedFriends);
            return true;
        } catch (error) {
            console.error("Erro ao buscar amigos:", error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    /*const removeNotificationById = (idToRemove: bigint) => {
        if (!notifications || !setNotifications) return;
        const updatedNotifications = notifications.filter(notification => notification.id !== idToRemove);
        setNotifications(updatedNotifications);
    };*/

    return (
        <Box sx={{flexGrow: 0}}>
            <IconButton onClick={handleOpenUserMenu} title="Abrir opções">
                <GroupIcon sx={{color: `${theme.palette.text.primary}`}}/>
            </IconButton>
            <Menu

                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {friends && friends.map(friend => {
                    return (
                        <FriendComponent
                            key={friend.id.toString()}
                            id={friend.id}
                            username={friend.username}
                        />
                    );
                })}
            </Menu>
        </Box>
    );
};

export default FriendsMenu;