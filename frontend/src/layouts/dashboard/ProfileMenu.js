import React, {useEffect} from "react";
import {Avatar, Box, Fade, Menu, MenuItem, Stack} from "@mui/material";

import {faker} from "@faker-js/faker";

import {Profile_Menu} from "../../data";
import {useDispatch, useSelector} from "react-redux";
import {LogoutUser} from "../../redux/slices/auth";
import {socket} from "../../socket";
import {useNavigate} from "react-router-dom";
import {AWS_S3_REGION, S3_BUCKET_NAME} from "../../config";
import {ClearUser} from "../../redux/slices/app";
import {ROUTE_INTERESTS, ROUTE_MY_PROFILE, ROUTE_REGISTER_INTERESTS} from "../../routes";
import Grid from "@mui/material/Grid";
import {ClearConversation} from "../../redux/slices/conversation";

const ProfileMenu = () => {
    const {user} = useSelector((state) => state.app);
    const {user_id} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const user_name = user?.userName;
    const user_img = user?.formattedProfilePicture;

    return (
        <>
            <Avatar
                id="profile-positioned-button"
                aria-controls={openMenu ? "profile-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                alt={user_name}
                src={user_img}
                onClick={handleClick}
            />
            <Menu
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                TransitionComponent={Fade}
                id="profile-positioned-menu"
                aria-labelledby="profile-positioned-button"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box p={1}>
                    <Stack spacing={1}>
                        {Profile_Menu.map((el, idx) => (
                            <>
                                {((idx == 1 && user.access == "ADMIN") || (idx != 1)) && (
                                    <MenuItem onClick={handleClose}>
                                        <Stack
                                            onClick={() => {
                                                if (idx === 0) {
                                                    navigate(ROUTE_MY_PROFILE);
                                                } else if (idx === 1) {
                                                    navigate(ROUTE_REGISTER_INTERESTS);
                                                } else if (idx === 2) {
                                                    navigate(`${ROUTE_INTERESTS}/${user.username}`);
                                                } else if (idx === 3) {
                                                    navigate("/settings");
                                                } else {
                                                    dispatch(LogoutUser());
                                                    dispatch(ClearUser());
                                                    dispatch(ClearConversation());
                                                    //socket.disconnect();
                                                    localStorage.removeItem("user_id");
                                                    //socket.emit("end", {user_id});
                                                }
                                            }}
                                            sx={{width: 100}}
                                            direction="row"
                                            alignItems={"center"}
                                            justifyContent="space-between"
                                        >
                                            <span>{el.title}</span>
                                            {el.icon}
                                        </Stack>{" "}
                                    </MenuItem>)}
                            </>
                        ))}
                    </Stack>
                </Box>
            </Menu>
        </>
    );
};

export default ProfileMenu;
