/*import logo from '../../img/logo.ico'*/
import * as React from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    CssBaseline,
    MenuItem,
    Tab,
    Tabs,
    Typography,
    Menu,
    Tooltip, Grid,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GamesIcon from '@mui/icons-material/Games';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
/*import {
    ROUTE_ABOUT_US,
    ROUTE_INTEREST_MANAGEMENT,
    ROUTE_PREMIUM,
    ROUTE_PROFILE,
    ROUTE_REGISTER_INTERESTS,
    ROUTE_SETTINGS, ROUTE_SIGN_IN
} from "../../App";*/
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
/*import ToggleColorModeButton from "../../components/ToggleColorModeButton";*/
/*import ProfilePicture from "../../components/ProfilePicture";
import NotificationsMenu from "../../components/contact/NotificationsMenu";
import ContactPage from "../../pages/ContactPage";*/
import {USER_ACCESS} from "../../model/user";
import {useDispatch, useSelector} from "react-redux";
import AntSwitch from "../../components/AntSwitch";
import {LogoutUser} from "../../redux/slices/auth";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const settings = ['Perfil', 'Configurações', 'Contato', 'Gerenciar Interesses', 'Cadastrar Interesses', 'Plano Premium', '', 'Sair'];
const menuIcons: { [key: string]: React.ReactElement } = {
    'Perfil': <AccountCircleIcon sx={{mr: '10px'}} color={'primary'}/>,
    'Configurações': <SettingsIcon sx={{mr: '10px'}} color={'primary'}/>,
    'Gerenciar Interesses': <SportsEsportsIcon sx={{mr: '10px'}} color={'primary'}/>,
    'Cadastrar Interesses': <GamesIcon sx={{mr: '10px'}} color={'primary'}/>,
    'Contato': <ContactMailIcon sx={{mr: '10px'}} color={'primary'}/>,
    'Sair': <ExitToAppIcon sx={{mr: '10px'}} color={'primary'}/>,
    '': <ExitToAppIcon sx={{mr: '10px'}} color={'primary'}/>/*<ToggleColorModeButton buttonText='Mudar Tema'/>*//*<AntSwitch
        defaultChecked={theme.palette.mode === "dark"}
        onChange={onToggleMode}
    />*/,
};

interface AppBarHomeProps {

}

const AppBarHome: React.FC<AppBarHomeProps> = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const {user} = useSelector((state: any) => state.app);
    const dispatch = useDispatch();
    const theme = useSelector((state: any) => state.theme);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: number;
        value: number;
    }

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box bgcolor={theme.palette.background.default}>
            <CssBaseline/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={8} md={6}>
                    <AppBar
                        position="static"
                        color="default"
                        elevation={0}
                        sx={{
                            border: (theme) => `1px solid ${theme.palette.primary.dark}`,
                            marginTop: '15px',
                            borderRadius: '40px',
                            bgcolor: 'background.default',
                        }}>
                        <Container>
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: {xs: 'none', md: 'flex'},
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {/*<img src={logo + ''}/>*/}
                                </Typography>

                                <Box bgcolor={theme.palette.background.default}
                                     sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            display: {xs: 'block', md: 'none'},
                                        }}
                                    >
                                        {/* //{pages.map((page) => (*/}
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Box justifyContent={'center'} sx={{
                                                display: {md: 'flex'},
                                            }}>
                                                <Tabs
                                                    value={value}
                                                    onChange={handleChange}
                                                >
                                                    <Tab icon={<PersonAddIcon/>} iconPosition="start" label="Encontro"/>
                                                    <Tab icon={<HomeIcon/>} iconPosition="start" label="Menu"/>
                                                    <Tab icon={<GroupIcon/>} iconPosition="start" label="Contatos"/>
                                                </Tabs>
                                            </Box>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: {xs: 'flex', md: 'none'},
                                        flexGrow: 1,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {/*<img src={logo + ''}/>*/}
                                </Typography>
                                <Box justifyContent={'center'} sx={{
                                    flexGrow: 1,
                                    display: {xs: 'none', md: 'flex'},
                                    bgcolor: `theme.palette.background.default`
                                }}>
                                    <Toolbar sx={{display: 'flex', justifyContent: 'center'}}>
                                        <Box>
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                            >
                                                <Tab icon={<PersonAddIcon/>} iconPosition="start" label="Encontro"/>
                                                <Tab icon={<HomeIcon/>} iconPosition="start" label="Menu"/>
                                                <Tab icon={<GroupIcon/>} iconPosition="start" label="Contatos"/>
                                            </Tabs>
                                        </Box>
                                    </Toolbar>
                                    {/*{pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page}
                                </Button>
                            ))}*/}
                                </Box>
                                <Grid sx={{mr: '30px', ml: '20px'}}>
                                    {/*<NotificationsMenu></NotificationsMenu>*/}
                                </Grid>
                                <Box sx={{flexGrow: 0}}>
                                    <Tooltip title="Abrir opções">
                                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                            {/*{user && <ProfilePicture id={user?.id} small={true}></ProfilePicture>}*/}
                                        </IconButton>
                                    </Tooltip>
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
                                        {settings.map((setting) => {
                                            console.log('')
                                            if (setting === 'Cadastrar Interesses' && user && user?.access !== USER_ACCESS.ADMIN) return;

                                            return (
                                                <MenuItem
                                                    key={setting}
                                                    onClick={() => {
                                                        handleCloseUserMenu();
                                                        switch (setting) {
                                                            case 'Perfil':
                                                                if (!user) {
                                                                    console.error("Erro: Usuário não está logado.");
                                                                    return;
                                                                }
                                                                /*navigate(`${ROUTE_PROFILE}/${user?.username}`);*/
                                                                break;
                                                            case 'Configurações':
                                                                /*navigate(ROUTE_SETTINGS);*/
                                                                break;
                                                            case 'Contato':
                                                                /*navigate(ROUTE_ABOUT_US);*/
                                                                break;
                                                            case 'Gerenciar Interesses':
                                                                navigate("gerenciamento_de_interesses");
                                                                break;
                                                            case 'Cadastrar Interesses':
                                                                navigate("cadastro_de_interesses");
                                                                break;
                                                            case 'Plano Premium':
                                                                /*navigate(ROUTE_PREMIUM);*/
                                                                break;
                                                            case 'Sair':
                                                                /*dispatch(LogoutUser());*/
                                                                navigate("login");
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }}
                                                >
                                                    {menuIcons[setting]}
                                                    <Typography textAlign="center">{setting}</Typography>
                                                </MenuItem>
                                            );
                                        })}

                                    </Menu>
                                </Box>
                            </Toolbar>
                        </Container>
                    </AppBar>
                </Grid>
            </Grid>

            <Grid container justifyContent={'center'} sx={{height: '75vh'}}>
                <Grid item md={10} sm={11} xs={12} sx={{height: '75vh'}}>
                    <CustomTabPanel value={value} index={0}>
                        {/*<NotificationsMenu></NotificationsMenu>*/}
                        {/*<ContactPage/>*/}
                    </CustomTabPanel>
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'}>
                <Grid item md={10} sm={11} xs={12}>
                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                </Grid>
            </Grid>
            <Grid container justifyContent={'center'}>
                <Grid item md={10} sm={11} xs={12}>
                    <CustomTabPanel value={value} index={2}>

                    </CustomTabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AppBarHome;
