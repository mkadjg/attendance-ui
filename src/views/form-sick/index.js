import {
    Box,
    ButtonBase,
    IconButton,
    InputAdornment,
    Tooltip,
    OutlinedInput,
    Avatar,
    Modal,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Grid,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    FormHelperText,
    Button,
    Input,
    FilledInput,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    FormLabel,
    Select,
    MenuItem,
    FormGroup,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Alert,
    Slide,
    CircularProgress,
    Icon
} from '@mui/material';
import DataTable from 'react-data-table-component-with-filter';
import { useTheme, styled } from '@mui/material/styles';
import { maxHeight, shouldForwardProp } from '@mui/system';
import {
    IconPlus,
    IconNote,
    IconPencil,
    IconTrash,
    IconSearch,
    IconAdjustmentsHorizontal,
    IconCardboards,
    IconBuildingSkyscraper,
    IconMail,
    IconPhone,
    IconUserCheck,
    IconBinary,
    IconUser,
    IconCalendar,
    IconGlobe,
    IconId,
    IconNotes,
    IconFileCheck,
    IconFileText
} from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import config from 'config';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import MainCard from 'ui-component/cards/MainCard';
import Moment from 'react-moment';
import moment from 'moment';
import User1 from 'assets/images/users/user-round.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

// styles
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.secondary.dark,
        color: theme.palette.secondary.light
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

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.error.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.error.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const FormSick = () => {
    const [cookies, setCookie] = useCookies();
    const [startDate, setStartDate] = useState(Date.now());
    const [endDate, setEndDate] = useState(Date.now());
    const [subPartnerId, setSubPartnerId] = useState('');
    const [description, setDescription] = useState({ html: '', text: '' });
    const [file, setFile] = useState({ raw: '', preview: '' });
    const [partners, setPartners] = useState([]);
    const [employeeId, setEmployeeId] = useState(cookies?.employeeId);
    const [divisionId, setDivisionId] = useState(cookies.division.divisionId);
    const [userAuditId, setUserAuditId] = useState(cookies?.userId);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fileEvent, setFileEvent] = useState(null);
    const theme = useTheme();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleChangeFile = (event) => {
        if (event.target.files.length > 0) {
            setFileEvent(event);
            setFile({
                raw: event.target.files[0],
                preview: URL.createObjectURL(event.target.files[0])
            });
        } else {
            setFileEvent(null);
            setFile({
                raw: null,
                preview: null
            });
        }
    };

    const clearForm = () => {
        setSubPartnerId('');
        setStartDate(Date.now());
        setEndDate(Date.now());
        setDescription('');
        fileEvent.target.value = '';
        handleChangeFile(fileEvent);
    };

    const getSubPartner = () => {
        axios
            .get(`${config.baseUrl}absence/partner/?employeeId=${employeeId}&divisionId=${divisionId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setPartners(response.data.data);
                }
            });
    };

    const saveAttendanceSick = () => {
        try {
            setDisableSubmit(true);
            handleDialogClose();
            const body = {
                employeeId,
                subPartnerId,
                startDate,
                endDate,
                descriptionHtml: description.html,
                descriptionText: description.text
            };
            axios
                .post(`${config.baseUrl}absence/attendance/sick`, body, {
                    headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': userAuditId }
                })
                .then((response) => {
                    if (response.status) {
                        if (response.status === 200) {
                            const sickId = response.data?.data?.sickId;
                            const bodyFile = new FormData();
                            bodyFile.append('file', file.raw);
                            axios
                                .post(`${config.baseUrl}absence/attendance/upload-document/${sickId}`, bodyFile, {
                                    headers: {
                                        Authorization: `Bearer ${cookies.token}`,
                                        'user-audit-id': userAuditId
                                    }
                                })
                                .then((response) => {
                                    console.log(response);
                                });
                        }
                        setResponseStatus(response.data.status);
                        setResponseMessage(response.data.message);
                        setSnackbarOpen(true);
                        handleDialogClose();
                        setDisableSubmit(false);
                    } else {
                        setResponseStatus('error');
                        setResponseMessage('Oops Internal Server Error!');
                        setSnackbarOpen(true);
                        handleDialogClose();
                        setDisableSubmit(false);
                    }
                    clearForm();
                })
                .catch((error) => {
                    setResponseStatus('error');
                    setResponseMessage('Oops Internal Server Error!');
                    setSnackbarOpen(true);
                    handleDialogClose();
                    setDisableSubmit(false);
                    clearForm();
                });
        } catch (err) {
            setResponseStatus('error');
            setResponseMessage('Oops Internal Server Error!');
            setSnackbarOpen(true);
            handleDialogClose();
            setDisableSubmit(false);
            clearForm();
        }
    };

    useEffect(() => {
        getSubPartner();
    }, []);

    return (
        <Grid spacing={2} container>
            <Grid item xs={12}>
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            margin: 0,
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: '#F44336',
                                            color: '#fff'
                                        }}
                                    >
                                        <IconFileText />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={
                                        <Typography variant="h2" sx={{ color: '#F44336' }}>
                                            Form Sick
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                    <Formik
                        initialValues={{}}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            handleDialogOpen();
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid spacing={2} container>
                                    <Grid item xs={5}>
                                        <FormControl fullWidth style={{ marginBottom: 18 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={startDate}
                                                    onChange={(newValue) => {
                                                        setStartDate(newValue);
                                                    }}
                                                    minDate={new Date()}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl fullWidth style={{ marginBottom: 10 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={endDate}
                                                    onChange={(newValue) => {
                                                        setEndDate(newValue);
                                                    }}
                                                    minDate={startDate}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl fullWidth style={{ marginBottom: 18 }}>
                                            <InputLabel htmlFor="sub-partner-id">Sub Partner*</InputLabel>
                                            <Select
                                                id="sub-partner-id"
                                                value={subPartnerId}
                                                name="subPartnerId"
                                                label="Sub Partner*"
                                                onChange={(event) => {
                                                    setSubPartnerId(event.target.value);
                                                }}
                                                inputProps={{}}
                                            >
                                                {partners.map((item) => (
                                                    <MenuItem id={item.employeeId} value={item.employeeId}>
                                                        {item.employeeName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth style={{ marginBottom: 18 }}>
                                            <FormLabel htmlFor="additional-document">Additional Document</FormLabel>
                                            <TextField
                                                id="additional-document"
                                                type="file"
                                                name="document"
                                                onChange={handleChangeFile}
                                                inputProps={{}}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <FormControl fullWidth style={{ marginBottom: 18 }}>
                                            <FormLabel>Description</FormLabel>
                                            <ReactQuill
                                                style={{ height: 120 }}
                                                id="description-id"
                                                name="description"
                                                value={description.html}
                                                onChange={(content, delta, source, editor) => {
                                                    setDescription({ html: content, text: editor.getText() });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Grid container>
                                    <Grid item xs={5}>
                                        <Box sx={{ mt: 2 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    disabled={disableSubmit}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    {disableSubmit ? <CircularProgress size="1.5rem" color="error" /> : 'Submit'}
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </MainCard>
            </Grid>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle fontSize={16} id="alert-dialog-title">
                    Submit Form Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure want to submit this sick form ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>No</Button>
                    <Button onClick={saveAttendanceSick} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
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
    );
};

export default FormSick;
