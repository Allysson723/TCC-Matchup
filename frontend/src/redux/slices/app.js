import {createSlice} from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import {client, socket} from "../../socket";
// import S3 from "../../utils/s3";
import {v4} from 'uuid';
import S3 from "../../utils/s3";
import {S3_BUCKET_NAME} from "../../config";
import {sl} from "date-fns/locale";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {RefreshToken} from "./auth";
// ----------------------------------------------------------------------

const initialState = {
    user: {},
    sideBar: {
        open: false,
        type: "CONTACT", // can be CONTACT, STARRED, SHARED
    },
    //profilePicture: null,
    isLoggedIn: false,
    isUserUpdated: false,
    tab: 0, // [0, 1, 2, 3]
    snackbar: {
        open: null,
        severity: null,
        message: null,
    },
    users: [], // all users of app who are not friends and not requested yet
    all_users: [],
    friends: [], // all friends
    friendRequests: [], // all friend requests
    notifications: [],
    chat_type: null,
    room_id: null,
    call_logs: [],
    lastEndedFriendshipList: [],
    lastBlocker: [],
    lastUnblocker: [],
    lastFriendshipResponse: [],
    isWebSocketsConnected: false
};


const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        resetState: (state) => initialState,
        fetchCallLogs(state, action) {
            state.call_logs = action.payload.call_logs;
        },
        fetchUser(state, action) {
            state.user = action.payload.user;
        },
        updateUser(state, action) {
            state.user = action.payload.user;
        },
        // Toggle Sidebar
        toggleSideBar(state) {
            state.sideBar.open = !state.sideBar.open;
        },
        updateSideBarType(state, action) {
            state.sideBar.type = action.payload.type;
        },
        updateTab(state, action) {
            state.tab = action.payload.tab;
        },

        openSnackBar(state, action) {
            console.log(action.payload);
            state.snackbar.open = true;
            state.snackbar.severity = action.payload.severity;
            state.snackbar.message = action.payload.message;
        },
        closeSnackBar(state) {
            console.log("This is getting executed");
            state.snackbar.open = false;
            state.snackbar.message = null;
        },
        updateUsers(state, action) {
            state.users = action.payload.users;
        },
        updateAllUsers(state, action) {
            state.all_users = action.payload.users;
        },
        updateFriends(state, action) {
            state.friends = action.payload.friends;
        },
        updateFriendRequests(state, action) {
            state.friendRequests = action.payload.requests;
        },
        /*updateProfilePicture(state, action) {
            state.profilePicture = action.payload.profilePicture;
        },*/
        selectConversation(state, action) {
            state.chat_type = "individual";
            state.room_id = action.payload.room_id;
            console.log("room_id:" + state.room_id);
        },
        clearUser(state, action) {
            state.user = null;
            state.isLoggedIn = false;
            state.isUserUpdated = false;
        },
        setIsUserUpdated(state, action) {
            state.isUserUpdated = action.payload.isUserUpdated;
        },
        setClient(state, action) {
            state.client = action.payload.client;
        },
        getNotifications(state, action) {
            state.notifications = action.payload.notifications;
        },
        addNotification(state, action) {
            if (!state.notifications) {
                state.notifications = [action.payload.notification];
            } else {
                state.notifications = [...state.notifications, action.payload.notification];
            }
            //state.notifications.push(action.payload.notification);
        },
        removeNotification(state, action) {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload.notificationId);
        },
        removeNotificationBySenderId(state, action) {
            state.notifications = state.notifications.filter(notification => notification.senderId !== action.payload.senderId);
        },
        updateLastFriendshipResponse(state, action) {
            state.lastFriendshipResponse = [action.payload.lastFriendshipResponse];
        },
        updateLastEndedFriendship(state, action) {
            state.lastEndedFriendshipList = [action.payload.lastEndedFriendship];
        },
        updateLastBlocker(state, action) {
            state.lastBlocker = [action.payload.lastBlocker];
        },
        updateLastUnblocker(state, action) {
            state.lastUnblocker = [action.payload.lastUnblocker];
        },
        changeWebsocketsConnectionStatus(state, action) {
            state.isWebSocketsConnected = !state.isWebSocketsConnected;
        }
    },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const closeSnackBar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
};

export const ChangeWebsocketsConnectionStatus = () => async (dispatch, getState) => {
    dispatch(slice.actions.changeWebsocketsConnectionStatus());
};

export const GetNotifications = () => async (dispatch, getState) => {
    await axios
        .get(
            "http://localhost:8080/api/notification/get",

            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().auth.token}`,
                },
            }
        )
        .then((response) => {
            console.log(response);
            dispatch(slice.actions.getNotifications({notifications: response.data}));
        })
        .catch((err) => {
            console.log(err);
        });
};


/*export const AddNotification = (notification) => async (dispatch, getState) => {
        dispatch(slice.actions.addNotification(notification));
};*/

export function AddNotification(notification) {
    console.log("APP");
    console.log(notification);
    return async (dispatch, getState) => {
        dispatch(slice.actions.addNotification({notification: notification}));
    };
}

export const RemoveNotification = (notificationId) => async (dispatch, getState) => {
    dispatch(slice.actions.removeNotification({notificationId: notificationId}));
};

export const UpdateLastEndedFriendship = (lastEndedFriendship) => async (dispatch, getState) => {
    dispatch(slice.actions.removeNotificationBySenderId({senderId: lastEndedFriendship}));
    dispatch(slice.actions.updateLastEndedFriendship({lastEndedFriendship: lastEndedFriendship}));

};

export const UpdateLastBlocker = (lastBlocker) => async (dispatch, getState) => {
    dispatch(slice.actions.updateLastBlocker({lastBlocker: lastBlocker}));
};

export const UpdateLastUnblocker = (lastUnblocker) => async (dispatch, getState) => {
    dispatch(slice.actions.updateLastUnblocker({lastUnblocker: lastUnblocker}));
};

export const showSnackbar =
    ({severity, message}) =>
        async (dispatch, getState) => {
            dispatch(
                slice.actions.openSnackBar({
                    message,
                    severity,
                })
            );

            setTimeout(() => {
                dispatch(slice.actions.closeSnackBar());
            }, 4000);
        };

export function ToggleSidebar() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.toggleSideBar());
    };
}

export function UpdateSidebarType(type) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateSideBarType({type}));
    };
}

export function UpdateTab(tab) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateTab(tab));
    };
}

export function ClearUser() {
    return async (dispatch, getState) => {
        dispatch(slice.actions.resetState());
    };
}

export function SetClient(client) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.setClient(client));
    };
}

export function FetchUsers() {
    return async (dispatch, getState) => {
        await axios
            .get(
                "/user/get-users",

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getState().auth.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateUsers({users: response.data.data}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function FetchAllUsers() {
    return async (dispatch, getState) => {
        await axios
            .get(
                "/user/get-all-verified-users",

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getState().auth.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateAllUsers({users: response.data.data}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function FetchFriends() {
    return async (dispatch, getState) => {
        await axios
            .get(
                "http://localhost:8080/api/friendship/get-friends",

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getState().auth.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateFriends({friends: response.data}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function FetchFriendRequests() {
    return async (dispatch, getState) => {
        await axios
            .get(
                "/user/get-requests",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getState().auth.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                dispatch(
                    slice.actions.updateFriendRequests({requests: response.data.data})
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export const SelectConversation = ({room_id}) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.selectConversation({room_id}));
    };
};

export const FetchCallLogs = () => {
    return async (dispatch, getState) => {
        axios
            .get("/user/get-call-logs", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().auth.token}`,
                },
            })
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.fetchCallLogs({call_logs: response.data.data}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
export const FetchUserProfile = () => {
    return async (dispatch, getState) => {
        axios
            .get("http://localhost:8080/api/user/get-me", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().auth.token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                dispatch(slice.actions.fetchUser({user: response.data}));
                dispatch(slice.actions.setIsUserUpdated({isUserUpdated: true}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
export const UpdateUserProfile = (formValues, wasUsernameChanged) => {
    return async (dispatch, getState) => {
        const file = formValues.profilePicture;
        console.log("DATA", formValues);
        console.log(getState().auth.token);
        axios
            .patch(
                "http://localhost:8080/api/update/user",
                formValues,
                {
                    headers: {
                        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
                        Authorization: `Bearer ${getState().auth.token}`
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                dispatch(slice.actions.updateUser({user: response.data}));
                if(wasUsernameChanged) dispatch(RefreshToken(response.data.token));
                dispatch(showSnackbar({severity: 'success', message: 'Perfil alterado com sucesso!'}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

/*
export const FetchProfilePicture = (width, height) => {
    return async (dispatch, getState) => {
        axios
            .get(
                `http://localhost:8080/api/get/user/profile-picture/by/id/?width=${width}&height=${height}`,

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getState().auth.token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                const imageUrl = `data:image/png;base64,${response.data.file.content}`;
                dispatch(slice.actions.updateProfilePicture({profilePicture: imageUrl}));
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
*/

export const RespondFriendshipSolicitation = (senderId, receiverId, accepted) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateLastFriendshipResponse({
            lastFriendshipResponse: {
                respondedId: receiverId,
                accepted: accepted
            }
        }));

        const solicitationResponseDto = {
            senderId: senderId,
            receiverId: receiverId,
            accepted: accepted
        };

        client.publish({
            destination: `/app/solicitation-response/`,
            body: JSON.stringify(solicitationResponseDto)
        });

    };
};

export const EndFriendship = (senderId, receiverId) => {
    return async (dispatch, getState) => {
        const endFriendshipDto = {
            senderId: senderId,
            receiverId: receiverId,
        };

        dispatch(slice.actions.removeNotificationBySenderId({senderId: receiverId}));

        client.publish({
            destination: `/app/friendship/end`,
            body: JSON.stringify(endFriendshipDto)
        });

    };
};

export const Block = (loggedUserId, receiverId) => {
    return async (dispatch, getState) => {
        const blockDto = {
            blockerId: loggedUserId,
            blockedId: receiverId
        };

        client.publish({
            destination: `/app/block`,
            body: JSON.stringify(blockDto)
        });

    };
};

export const Unblock = (loggedUserId, receiverId) => {
    return async (dispatch, getState) => {
        const unblockDto = {
            unblockerId: loggedUserId,
            unblockedId: receiverId,
        };

        client.publish({
            destination: `/app/unblock`,
            body: JSON.stringify(unblockDto)
        });

    };
};

