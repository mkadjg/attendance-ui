import {
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Grid,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Button,
    TextField,
    FormLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Alert,
    Slide,
    CircularProgress
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { IconFileText, IconInfoCircle } from '@tabler/icons';
import { useEffect, useState } from 'react';
import config from 'config';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import MainCard from 'ui-component/cards/MainCard';
import Moment from 'react-moment';
import moment from 'moment';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.success.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.success.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const FormPresent = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const [attendanceDate, setAttendanceDate] = useState(Date.now());
    const [checkInTime, setCheckInTime] = useState(Date.now());
    const [checkOutTime, setCheckOutTime] = useState(Date.now());
    const [task, setTask] = useState({ html: '', text: '' });
    const [location, setLocation] = useState('');
    const [projectId, setProjectId] = useState('');
    const [employeeId, setEmployeeId] = useState(cookies.employeeId);
    const [userAuditId, setUserAuditId] = useState(cookies.userId);
    const [divisionId, setDivisionId] = useState(cookies.division.divisionId);
    const [project, setProject] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [disableDate, setDisableDate] = useState(true);
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

    const getIsAvailable = () => {
        axios
            .get(`${config.baseUrl}absence/attendance/is-available/${employeeId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.data.status === 'AVAILABLE') {
                        setDisableForm(false);
                    } else {
                        console.log(response.data.data);
                        setDisableForm(true);
                        setFormMessage(response.data.data.message);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const saveAttendancePresent = () => {
        handleDialogClose();
        try {
            setDisableSubmit(true);
            const body = {
                employeeId,
                attendanceDate,
                checkInTime,
                checkOutTime,
                projectId,
                taskHtml: task.html,
                taskText: task.text,
                location
            };
            axios
                .post(`${config.baseUrl}absence/attendance/present`, body, {
                    headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': userAuditId }
                })
                .then((response) => {
                    if (response.status) {
                        setResponseStatus(response.data.status);
                        setResponseMessage(response.data.message);
                        setSnackbarOpen(true);
                        setDisableSubmit(false);
                    } else {
                        setResponseStatus('error');
                        setResponseMessage('Oops Internal Server Error!');
                        setSnackbarOpen(true);
                        setDisableSubmit(false);
                    }
                    getIsAvailable();
                })
                .catch((error) => {
                    setResponseStatus('error');
                    setResponseMessage('Oops Internal Server Error!');
                    setSnackbarOpen(true);
                    setDisableSubmit(false);
                });
        } catch (err) {
            setResponseStatus('error');
            setResponseMessage('Oops Internal Server Error!');
            setSnackbarOpen(true);
            setDisableSubmit(false);
        }
    };

    const getProjectListData = () => {
        axios
            .get(`${config.baseUrl}absence/project/find-by-division/${divisionId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setProject(response.data.data);
                }
            });
    };

    useEffect(() => {
        getProjectListData();
        getIsAvailable();
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
                                            backgroundColor: '#00C853',
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
                                        <Typography variant="h2" sx={{ color: '#00C853' }}>
                                            Form Present
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            </Grid>
            <Grid item xs={12}>
                {disableForm ? (
                    <MainCard>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={5} />
                            <Grid item xs={2}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        margin: 0,
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor: '#FFF6CA',
                                        color: '#FFC107',
                                        height: 80,
                                        width: 80
                                    }}
                                >
                                    <IconInfoCircle size={50} />
                                </Avatar>
                            </Grid>
                            <Grid item xs={5} />
                        </Grid>
                        <br />
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Typography variant="body2">{formMessage}</Typography>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </MainCard>
                ) : (
                    <MainCard>
                        <Formik
                            initialValues={{
                                projectId: ''
                            }}
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
                                                        id="attendance-date-id"
                                                        label="Attendance Date"
                                                        value={attendanceDate}
                                                        readOnly={disableDate}
                                                        onChange={(newValue) => {
                                                            setAttendanceDate(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                            <FormControl fullWidth style={{ marginBottom: 18 }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <TimePicker
                                                        id="check-in-time-id"
                                                        label="Check In Time"
                                                        value={checkInTime}
                                                        onChange={(newValue) => {
                                                            setCheckInTime(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                            <FormControl fullWidth style={{ marginBottom: 18 }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <TimePicker
                                                        id="check-out-time-id"
                                                        label="Check Out Time"
                                                        value={checkOutTime}
                                                        onChange={(newValue) => {
                                                            setCheckOutTime(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                            <FormControl fullWidth style={{ marginBottom: 18 }}>
                                                <TextField
                                                    id="location"
                                                    type="text"
                                                    value={location}
                                                    name="location"
                                                    onChange={(event) => {
                                                        setLocation(event.target.value);
                                                    }}
                                                    label="Location*"
                                                    inputProps={{}}
                                                    multiline
                                                    rows={1}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <FormControl fullWidth style={{ marginBottom: 18 }}>
                                                <InputLabel htmlFor="project-id">Project*</InputLabel>
                                                <Select
                                                    id="project-id"
                                                    value={projectId}
                                                    name="projectId"
                                                    label="Project*"
                                                    onChange={(event) => {
                                                        setProjectId(event.target.value);
                                                    }}
                                                    inputProps={{}}
                                                >
                                                    {project.map((item) => (
                                                        <MenuItem id={item.projectId} value={item.projectId}>
                                                            {item.projectName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth style={{ marginBottom: 18 }}>
                                                <FormLabel>Task</FormLabel>
                                                <ReactQuill
                                                    id="task-id"
                                                    name="task"
                                                    style={{ height: 120 }}
                                                    value={task.html}
                                                    onChange={(content, delta, source, editor) => {
                                                        setTask({ html: content, text: editor.getText() });
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
                                                        style={{ color: '#fff' }}
                                                        color="success"
                                                    >
                                                        {disableSubmit ? <CircularProgress size="1.5rem" color="success" /> : 'Submit'}
                                                    </Button>
                                                </AnimateButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </MainCard>
                )}
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
                    <DialogContentText id="alert-dialog-description">Are you sure want to submit this Present Form ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>No</Button>
                    <Button onClick={saveAttendancePresent} autoFocus>
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

export default FormPresent;
