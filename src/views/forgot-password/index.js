import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    IconButton,
    InputAdornment,
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

// assets
import Logo from 'ui-component/Logo';

// ============================|| FIREBASE - LOGIN ||============================ //

const ForgotPassword = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const scriptedRef = useScriptRef();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                                                        Forgot Password
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Please enter your registered email address
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            initialValues={{
                                                email: ''
                                            }}
                                            validationSchema={Yup.object().shape({
                                                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                                            })}
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                try {
                                                    setDisableSubmit(true);
                                                    axios
                                                        .get(`${config.baseUrl}auth/forgot-password/send-otp?email=${values.email}`)
                                                        .then((response) => {
                                                            setDisableSubmit(false);
                                                            if (response.status) {
                                                                if (response.status === 200) {
                                                                    setCookie('email', values.email);
                                                                    navigate('/validate-otp', { email: values.email });
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
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: true });
                                                        setSubmitting(false);
                                                    }
                                                } catch (err) {
                                                    setDisableSubmit(false);
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: false });
                                                        setErrors({ submit: err.message });
                                                        setSubmitting(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                                <form noValidate onSubmit={handleSubmit}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-email-login"
                                                            type="email"
                                                            value={values.email}
                                                            name="email"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            label="Email"
                                                            inputProps={{}}
                                                        />
                                                        {touched.email && errors.email && (
                                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                                {errors.email}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                    {errors.submit && (
                                                        <Box sx={{ mt: 3 }}>
                                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                                        </Box>
                                                    )}

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

export default ForgotPassword;
