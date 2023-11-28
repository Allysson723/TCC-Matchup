import {ROUTE_PROFILE, ROUTE_SIGN_IN} from "../App";
import React, {useEffect, useState} from "react";
import {User} from "../model/user";
import {useNavigate} from "react-router-dom";
import AppBarHome from "../containers/appbars/AppBarHome";
import getTheme from "../theme";
import {useCustomTheme} from "../contexts/CustomThemeContext";
import {Contact} from "../model/contact";
import {Message} from "../model/message";
import {useLoggedUser} from "../contexts/UserContext";

export const removeProfilePicture = () => {
    localStorage.removeItem('profilePicture');
}

interface HomeProps {
    contacts: Contact[] | null;
    setContacts: React.Dispatch<React.SetStateAction<Contact[] | null>>;
    updateContactsWithMessage: (contactId: bigint, message: Message) => void;
}

const Home: React.FC<HomeProps> = ({contacts, setContacts, updateContactsWithMessage}) => {
    const {loggedUser, setLoggedUser, logout} = useLoggedUser();
    const { theme: mode } = useCustomTheme();
    const theme = getTheme(mode);
    const history = useNavigate();
    const [profileRoute, setProfileRoute] = useState(ROUTE_PROFILE);

    useEffect(() => {
        const userJSON = localStorage.getItem('user');
        if (!userJSON) {
            history(ROUTE_SIGN_IN);
        } else {
            const user = JSON.parse(userJSON);
            setLoggedUser(user);
            setProfileRoute(`/perfil/${user.username}`);
        }
    }, []);

    /*setUser();*/

    console.log('HOME');
    console.log(loggedUser);
    if (!loggedUser) return null;

    return (
        <AppBarHome contacts={contacts} setContacts={setContacts} updateContactsWithMessage={updateContactsWithMessage}></AppBarHome>


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
