import {createSlice} from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import {showSnackbar} from "./app";
import {AxiosResponse} from "axios";

// ----------------------------------------------------------------------

const initialState = {
    isLoggedIn: false,
    token: "",
    isLoading: false,
    user: null,
    user_id: null,
    userPasswordId: null,
    email: "",
    error: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetState: (state) => initialState,
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.user_id = action.payload.user_id;
        },
        refreshToken(state, action) {
            state.token = action.payload.newToken;
        },
        signOut(state, action) {
            state.isLoggedIn = false;
            state.user_id = null
        },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
        },
        setUserPasswordId(state, action) {
            state.userPasswordId = action.payload.userPasswordId;
        }
    },
});

// Reducer
export default slice.reducer;

export function NewPassword(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));

        await axios
            .post(
                "/auth/reset-password",
                {
                    ...formValues,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);
                dispatch(
                    slice.actions.logIn({
                        isLoggedIn: true,
                        token: response.data.token,
                    })
                );
                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: true})
                );
            });
    };
}

export function ForgotPassword(email) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));

        try {
            let userPasswordId;
            userPasswordId = await axios.post(`http://localhost:8080/api/forgot-password/confirm-email?email=${email}`);
            if (!userPasswordId) {
                dispatch(showSnackbar({severity: "warning", message: "Email inválido!"}));
            } else {
                dispatch(slice.actions.setUserPasswordId({userPasswordId: userPasswordId.data}));
                window.location.href = "/auth/verify";
                /*dispatch(showSnackbar({severity: "success", message: "Email confirmado"}));*/

            }
            return userPasswordId.data;
        } catch (error) {
            throw error;
        }

        /*await axios
            .post(
                "http://localhost:8080/api/forgot-password/confirm-email",
                {
                    ...formValues,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);

                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: true})
                );
            });*/
    };
}

export function VerifyCode(code) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));

        try {
            let response;
            response = await axios.post(`http://localhost:8080/api/forgot-password/verify-code/${code}/${getState().userPasswordId}`);
            return response.data;
        } catch (error) {
            throw error;
        }

        /*await axios
            .post(
                "http://localhost:8080/api/forgot-password/confirm-email",
                {
                    ...formValues,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);

                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: true})
                );
            });*/
    };
}

export function LoginUser(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));
        await axios
            .post(
                "http://localhost:8080/api/auth/authenticate",
                {
                    ...formValues
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);
                dispatch(
                    slice.actions.logIn({
                        isLoggedIn: true,
                        token: response.data.token,
                        user_id: response.data.user_id,
                    })
                );
                window.localStorage.setItem("user_id", response.data.user_id);
                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    showSnackbar({severity: "warning", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: true})
                );
            });
    };
}

export function RefreshToken(newToken) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.refreshToken({newToken: newToken}));
    };
}

export function LogoutUser() {
    return async (dispatch, getState) => {

        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getState().auth.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response);

        } catch (error) {
            console.error(error);
        }

        window.localStorage.removeItem("user_id");
        dispatch(slice.actions.signOut());
        dispatch(slice.actions.resetState);

    };
}

export function RegisterUser(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));

        await axios
            .post(
                "http://localhost:8080/api/auth/register",
                {
                    ...formValues,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);
                dispatch(
                    slice.actions.logIn({
                        isLoggedIn: true,
                        token: response.data.token,
                        user_id: response.data.user_id,
                    })
                );
                window.localStorage.setItem("user_id", response.data.user_id);

              /*  dispatch(
                    slice.actions.updateRegisterEmail({email: formValues.email})
                );*/

                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({error: true, isLoading: false})
                );
            })
            /*.finally(() => {
                if (!getState().auth.error) {
                    window.location.href = "/auth/verify";
                }
            });*/
    };
}

export function VerifyEmail(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({isLoading: true, error: false}));

        await axios
            .post(
                "/auth/verify",
                {
                    ...formValues,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(function (response) {
                console.log(response);
                dispatch(slice.actions.updateRegisterEmail({email: ""}));
                window.localStorage.setItem("user_id", response.data.user_id);
                dispatch(
                    slice.actions.logIn({
                        isLoggedIn: true,
                        token: response.data.token,
                    })
                );


                dispatch(
                    showSnackbar({severity: "success", message: response.data.message})
                );
                dispatch(
                    slice.actions.updateIsLoading({isLoading: false, error: false})
                );
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({severity: "error", message: error.message}));
                dispatch(
                    slice.actions.updateIsLoading({error: true, isLoading: false})
                );
            });
    };
}
