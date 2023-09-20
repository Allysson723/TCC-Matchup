import {
    Alert,
    Box,
    Button,
    Checkbox, Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import theme from "../../theme";
import {ROUTE_SIGN_IN} from "../../App";
import React, {useEffect} from "react";
import {User} from "../../model/user";
import {NavigateFunction, useNavigate} from "react-router-dom";
import AppBarHome from "../../containers/AppBarHome";
import logo from '../img/logo-matchup2.png'

var loggedUser: User;

var history: NavigateFunction;

function setUser() {
    loggedUser = JSON.parse('' + localStorage.getItem('user'));
}

export const getUser = () => {
    setUser();
    return loggedUser;
}

function logout() {
    localStorage.clear();
    history(ROUTE_SIGN_IN);
}

const Home = () => {
    history = useNavigate();
    setUser();

    console.log('HOME');
    console.log(loggedUser);
    return (
        <AppBarHome></AppBarHome>
        /*<Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                /!*sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: 550,
                    minWidth: 450,
                    width: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: `1px solid${theme.palette.primary.main}`,
                    padding: '40px',
                    borderRadius: '16px',
                }}*!/
            >
                {/!*!//<Avatar  src='/src/assets/brand/logo-matchup.jpeg'/>*!/}

                {/!*<Typography component="h1" variant="h5">
                    Eae {loggedUser.name}
                </Typography>*!/}

            </Box>
        </Container>*/
    )

}

export default Home;
