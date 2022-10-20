import { useState, useRef, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    ClickAwayListener,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Modal,
    OutlinedInput,
    Paper,
    Popper,
    Select,
    Slide,
    Snackbar,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import config from 'config';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CardWrapper = styled(Card)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll'
};

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleLogout = async () => {
        axios
            .get(`${config.baseUrl}auth/logout`, {
                headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': cookies.userId }
            })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/login');
                    localStorage.clear();
                    removeCookies('auth');
                    removeCookies('role');
                    removeCookies('roles');
                    removeCookies('division');
                } else {
                    setResponseStatus(response.data.status);
                    setResponseMessage(response.data.message);
                    setSnackbarOpen(true);
                }
            });
    };

    const handleChangeRole = (event) => {
        setCookies('role', event.target.value);
        if (location.pathname === '/dashboard') {
            window.location.reload();
        } else {
            window.location.replace('/dashboard');
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleChangePasswordOpen = () => {
        handleClose(false);
        setChangePasswordOpen(true);
    };

    const handleChangePasswordClose = () => {
        setChangePasswordOpen(false);
    };

    const handleClickShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleClickShowVerifyPassword = () => {
        setShowVerifyPassword(!showVerifyPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={`data:image/jpeg;image/png;image/jpg;image/jpeg;base64,${sessionStorage.getItem('photo')}`}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <CardWrapper sx={{ bgcolor: 'primary.light' }}>
                                        <Box sx={{ p: 2 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="subtitle-1" fontSize={15} style={{ fontStyle: 'italic' }}>
                                                        Greetings...
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="subtitle-1"
                                                        fontSize={15}
                                                        sx={{ fontWeight: 400 }}
                                                    >
                                                        {cookies.employeeName}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Chip
                                                label={cookies.jobTitle?.jobTitleName}
                                                size="small"
                                                sx={{
                                                    bgcolor: theme.palette.primary.dark,
                                                    color: theme.palette.background.default
                                                }}
                                                style={{ marginTop: 10 }}
                                            />
                                        </Box>
                                    </CardWrapper>
                                    <Box sx={{ p: 2 }}>
                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 350,
                                                minWidth: 300,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': {
                                                    mt: 0.5
                                                }
                                            }}
                                        >
                                            <ListItem alignItems="center">
                                                <ToggleButtonGroup
                                                    color="secondary"
                                                    exclusive
                                                    value={cookies.role}
                                                    onChange={handleChangeRole}
                                                >
                                                    {cookies.roles.map((item) => (
                                                        <ToggleButton id={item} value={item}>
                                                            {item}
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                            </ListItem>
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 0}
                                                onClick={handleChangePasswordOpen}
                                            >
                                                <ListItemIcon>
                                                    <IconSettings stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Change Password</Typography>} />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 4}
                                                onClick={handleLogout}
                                            >
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            <Modal
                id="change-password"
                open={changePasswordOpen}
                onClose={handleChangePasswordClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <MainCard sx={modalStyle} title="Change Password">
                    <Formik
                        initialValues={{
                            oldPassword: '',
                            newPassword: '',
                            verifyPassword: ''
                        }}
                        validationSchema={Yup.object().shape({})}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    email: cookies.username,
                                    oldPassword: values.oldPassword,
                                    newPassword: values.newPassword
                                };

                                if (values.newPassword !== values.verifyPassword) {
                                    setResponseStatus('warning');
                                    setResponseMessage('Password doesnt match!');
                                    setSnackbarOpen(true);
                                    setDisableSubmit(false);
                                } else {
                                    axios
                                        .post(`${config.baseUrl}auth/change-password`, body, {
                                            headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': cookies.userId }
                                        })
                                        .then((response) => {
                                            if (response.status) {
                                                setResponseStatus(response.data.status);
                                                setResponseMessage(response.data.message);
                                                handleChangePasswordClose();
                                                setSnackbarOpen(true);
                                                setDisableSubmit(false);
                                            } else {
                                                setResponseStatus(response.status);
                                                setResponseMessage(response.message);
                                                handleChangePasswordClose();
                                                setSnackbarOpen(true);
                                                setDisableSubmit(false);
                                            }
                                        })
                                        .catch((error) => {
                                            setResponseStatus('error');
                                            setResponseMessage('Oops Internal Server Error!');
                                            handleChangePasswordClose();
                                            setDisableSubmit(false);
                                            setSnackbarOpen(true);
                                            setDisableSubmit(false);
                                        });
                                }
                            } catch (err) {
                                setResponseStatus('error');
                                setResponseMessage('Oops Internal Server Error!');
                                handleChangePasswordClose();
                                setSnackbarOpen(true);
                                setDisableSubmit(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.oldPassword && errors.oldPassword)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password-login">Old Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password-login"
                                                type={showOldPassword ? 'text' : 'password'}
                                                value={values.oldPassword}
                                                name="oldPassword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowOldPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            size="large"
                                                        >
                                                            {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Old Password"
                                                inputProps={{}}
                                            />
                                            {touched.oldPassword && errors.oldPassword && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    {errors.oldPassword}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.newPassword && errors.newPassword)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password-login">New Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password-login"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={values.newPassword}
                                                name="newPassword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowNewPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            size="large"
                                                        >
                                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="New Password"
                                                inputProps={{}}
                                            />
                                            {touched.newPassword && errors.newPassword && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    {errors.newPassword}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.verifyPassword && errors.verifyPassword)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password-login">Verify Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password-login"
                                                type={showVerifyPassword ? 'text' : 'password'}
                                                value={values.verifyPassword}
                                                name="verifyPassword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowVerifyPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            size="large"
                                                        >
                                                            {showVerifyPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                                inputProps={{}}
                                            />
                                            {touched.verifyPassword && errors.verifyPassword && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    {errors.verifyPassword}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            disabled={disableSubmit}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            {disableSubmit ? <CircularProgress size="1.5rem" color="primary" /> : 'Submit'}
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </MainCard>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={Slide}
            >
                <Alert onClose={handleSnackbarClose} severity={responseStatus} sx={{ width: '100%' }}>
                    {responseMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProfileSection;
