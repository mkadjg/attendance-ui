import { useState } from 'react';
import { Link, useNavigate, useParams, useRoutes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AuthWrapper1 from '../pages/authentication/AuthWrapper1';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput,
    Slide,
    Snackbar,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

import axios from 'axios';
import config from 'config';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Logo from 'ui-component/Logo';
import OtpInput from 'react-otp-input';
import { GridBody } from '@mui/x-data-grid';

// ============================|| FIREBASE - LOGIN ||============================ //

const ValidateOtp = ({ route }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const scriptedRef = useScriptRef();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();
    const [otp, setOtp] = useState({ number: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleChange = (number) => {
        setOtp({ number });
    };

    const validate = (event) => {
        event.preventDefault();
        try {
            setDisableSubmit(true);
            const body = {
                email: cookies.email,
                otpNumber: otp.number
            };
            axios
                .post(`${config.baseUrl}auth/forgot-password/validate-otp`, body)
                .then((response) => {
                    setDisableSubmit(false);
                    if (response.status) {
                        if (response.status === 200) {
                            setCookie('tempToken', response.data?.data?.token);
                            navigate('/new-password');
                        } else {
                            setResponseStatus(response.data.status);
                            setResponseMessage(response.data.message);
                            setSnackbarOpen(true);
                        }
                    } else {
                        setResponseStatus('error');
                        setResponseMessage('Oops, Seomething went wrong!');
                        setSnackbarOpen(true);
                    }
                })
                .catch((error) => {
                    setDisableSubmit(false);
                    setResponseStatus(error.response.data.status);
                    setResponseMessage(error.response.data.message);
                    setSnackbarOpen(true);
                });
        } catch (err) {
            setDisableSubmit(false);
        }
    };

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center">
                                                    <Typography
                                                        color={theme.palette.primary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Enter Verification Code
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        The verification code has been sent to your email.
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik>
                                            {() => (
                                                <form noValidate onSubmit={validate}>
                                                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                                                        <OtpInput
                                                            id="outlined-adornment-otp"
                                                            value={otp.number}
                                                            name="number"
                                                            onChange={handleChange}
                                                            numInputs={6}
                                                            separator={<span>-</span>}
                                                            containerStyle="true"
                                                            inputStyle={{
                                                                width: '3rem',
                                                                height: '3rem',
                                                                margin: '0 0.6rem',
                                                                borderRadius: 4,
                                                                border: '1px solid rgba(0,0,0,0.3)',
                                                                fontSize: theme.fontSize,
                                                                fonsStyle: theme.fonsStyle
                                                            }}
                                                        />
                                                    </FormControl>
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
                                                                {disableSubmit ? (
                                                                    <CircularProgress size="1.5rem" color="primary" />
                                                                ) : (
                                                                    'Submit'
                                                                )}
                                                            </Button>
                                                        </AnimateButton>
                                                    </Box>
                                                </form>
                                            )}
                                        </Formik>
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
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default ValidateOtp;
