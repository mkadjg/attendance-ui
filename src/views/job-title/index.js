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
    CircularProgress
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
    IconNotes
} from '@tabler/icons';
import { useEffect, useState } from 'react';
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
import MUIDataTable from 'mui-datatables';

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

const JobTitle = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const [data, setData] = useState([]);
    const [detailOpen, setDetailOpen] = useState(Boolean);
    const [createOpen, setCreateOpen] = useState(Boolean);
    const [editOpen, setEditOpen] = useState(Boolean);
    const [deleteOpen, setDeleteOpen] = useState(Boolean);
    const [item, setItem] = useState({});
    const [userAuditId, setUserAuditId] = useState(cookies.userId);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [division, setDivision] = useState([]);
    const theme = useTheme();

    const getListData = () => {
        axios
            .get(`${config.baseUrl}absence/job-title/find-all`, { headers: { Authorization: `Bearer ${cookies.token}` } })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setData(response.data.data);
                }
            });
    };

    const getDivisionListData = () => {
        axios
            .get(`${config.baseUrl}absence/division/find-all`, { headers: { Authorization: `Bearer ${cookies.token}` } })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setDivision(response.data.data);
                }
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleDetailOpen = (row) => {
        setItem(row);
        setDetailOpen(true);
    };

    const handleDetailClose = () => {
        setItem({});
        setDetailOpen(false);
    };

    const handleCreateOpen = () => {
        getDivisionListData();
        setCreateOpen(true);
    };

    const handleCreateClose = () => {
        setItem({});
        setCreateOpen(false);
    };

    const handleEditOpen = (row) => {
        getDivisionListData();
        setItem(row);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setItem({});
        setEditOpen(false);
    };

    const handleDeleteOpen = (row) => {
        setItem(row);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setItem({});
        setDeleteOpen(false);
    };

    const deleteProject = () => {
        axios
            .delete(`${config.baseUrl}absence/job-title/delete/${item.jobTitleId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .then((response) => {
                if (response.status) {
                    setResponseStatus(response.data.status);
                    setResponseMessage(response.data.message);
                    setSnackbarOpen(true);
                    handleDeleteClose();
                    getListData();
                    setDisableSubmit(false);
                } else {
                    setResponseStatus('error');
                    setResponseMessage('Oops Internal Server Error!');
                    setSnackbarOpen(true);
                    handleDeleteClose();
                    setDisableSubmit(false);
                }
            })
            .catch((error) => {
                setResponseStatus('error');
                setResponseMessage('Oops Internal Server Error!');
                setSnackbarOpen(true);
                handleDeleteClose();
                setDisableSubmit(false);
            });
    };

    useEffect(() => {
        getListData();
    }, []);
    const actions = (index) => (
        <>
            <Tooltip title="Detail">
                <IconButton
                    onClick={() => {
                        handleDetailOpen(data[index]);
                    }}
                    color="secondary"
                    size="small"
                    disableRipple
                    style={{ backgroundColor: '#EDE7F6', margin: 2 }}
                >
                    <IconNote />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton
                    onClick={() => {
                        handleEditOpen(data[index]);
                    }}
                    color="success"
                    size="small"
                    disableRipple
                    style={{ backgroundColor: '#B9F6CA', margin: 2 }}
                >
                    <IconPencil />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton
                    onClick={() => {
                        handleDeleteOpen(data[index]);
                    }}
                    color="error"
                    size="small"
                    disableRipple
                    style={{ backgroundColor: '#EF9A9A', margin: 2 }}
                >
                    <IconTrash />
                </IconButton>
            </Tooltip>
        </>
    );

    const AddSection = () => (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Tooltip title="Add">
                <IconButton
                    onClick={() => {
                        handleCreateOpen();
                    }}
                    color="primary"
                    size="small"
                    disableRipple
                    style={{ backgroundColor: '#E3F2FD', margin: 2 }}
                >
                    <IconPlus />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const columns = [
        {
            label: 'Project Name',
            name: 'jobTitleName'
        },
        {
            label: 'Division Name',
            name: 'divisionName'
        },
        {
            name: 'Action',
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => actions(rowIndex)
            }
        }
    ];

    const options = {
        download: false,
        filter: false,
        print: false,
        selectableRowsHeader: false,
        selectableRowsHideCheckboxes: true
    };

    return (
        <MainCard title="Project" secondary={<AddSection />}>
            <MUIDataTable columns={columns} data={data} options={options} />
            <Modal
                id="detail"
                open={detailOpen}
                onClose={handleDetailClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <MainCard sx={modalStyle}>
                    <Grid container>
                        <Grid item>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontSize={18}>
                                                Job Title Detail
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container>
                        <Grid item xs={6}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <IconButton color="secondary" size="medium" disableRipple style={{ backgroundColor: '#EDE7F6' }}>
                                            <IconId />
                                        </IconButton>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Job Title Name"
                                        secondary={item.jobTitleName === null ? '-' : item.jobTitleName}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <IconButton color="secondary" size="medium" disableRipple style={{ backgroundColor: '#EDE7F6' }}>
                                            <IconBuildingSkyscraper />
                                        </IconButton>
                                    </ListItemAvatar>
                                    <ListItemText primary="Division" secondary={item.divisionName === null ? '-' : item.divisionName} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </MainCard>
            </Modal>
            <Modal
                id="create"
                open={createOpen}
                onClose={handleCreateClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <MainCard sx={modalStyle} title="Add New Job Title">
                    <Formik
                        initialValues={{
                            jobTitleName: '',
                            jobTitleDesc: '',
                            divisionId: 0
                        }}
                        validationSchema={Yup.object().shape({
                            jobTitleName: Yup.string().max(255).required('Project Name is required'),
                            divisionId: Yup.string().max(255).required('Division Id is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    jobTitleName: values.jobTitleName,
                                    jobTitleDesc: values.jobTitleDesc,
                                    divisionId: values.divisionId
                                };
                                axios
                                    .post(`${config.baseUrl}absence/job-title/create`, body, {
                                        headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': userAuditId }
                                    })
                                    .then((response) => {
                                        setResponseStatus(response.data.status);
                                        setResponseMessage(response.data.message);
                                        setSnackbarOpen(true);
                                        handleCreateClose();
                                        getListData();
                                        setDisableSubmit(false);
                                    })
                                    .catch((error) => {
                                        setResponseStatus('error');
                                        setResponseMessage('Oops Internal Server Error!');
                                        setSnackbarOpen(true);
                                        handleCreateClose();
                                        setDisableSubmit(false);
                                    });
                            } catch (err) {
                                setResponseStatus('error');
                                setResponseMessage('Oops Internal Server Error!');
                                setSnackbarOpen(true);
                                handleCreateClose();
                                setDisableSubmit(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.jobTitleName && errors.jobTitleName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="job-title-name"
                                                type="text"
                                                value={values.jobTitleName}
                                                name="jobTitleName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Job Title Name*"
                                                inputProps={{}}
                                            />
                                            {touched.jobTitleName && errors.jobTitleName && (
                                                <FormHelperText error id="standard-weight-helper-text-jobTitle-name">
                                                    {errors.jobTitleName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.divisionId && errors.divisionId)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <InputLabel htmlFor="division-id">Division*</InputLabel>
                                            <Select
                                                id="division-id"
                                                value={values.divisionId}
                                                name="divisionId"
                                                label="Division*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            >
                                                {division.map((item, index) => (
                                                    <MenuItem id={`create${index}`} value={item.divisionId}>
                                                        {item.divisionName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.divisionId && errors.divisionId && (
                                                <FormHelperText error id="standard-weight-helper-text-division-id">
                                                    {errors.divisionId}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        {errors.submit && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}
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
            <Modal
                id="edit"
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <MainCard sx={modalStyle} title="Edit Data Job Title">
                    <Formik
                        initialValues={{
                            jobTitleId: item.jobTitleId,
                            jobTitleName: item.jobTitleName,
                            jobTitleDesc: item.jobTitleDesc,
                            divisionId: item.division?.divisionId
                        }}
                        validationSchema={Yup.object().shape({
                            jobTitleName: Yup.string().max(255).required('Project Name is required'),
                            divisionId: Yup.string().max(255).required('Division is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    jobTitleName: values.jobTitleName,
                                    jobTitleDesc: values.jobTitleDesc,
                                    divisionId: values.divisionId
                                };
                                axios
                                    .put(`${config.baseUrl}absence/job-title/update/${item.jobTitleId}`, body, {
                                        headers: { Authorization: `Bearer ${cookies.token}`, 'user-audit-id': userAuditId }
                                    })
                                    .then((response) => {
                                        setResponseStatus(response.data.status);
                                        setResponseMessage(response.data.message);
                                        setSnackbarOpen(true);
                                        handleEditClose();
                                        getListData();
                                        setDisableSubmit(false);
                                    })
                                    .catch((error) => {
                                        setResponseStatus('error');
                                        setResponseMessage('Oops Internal Server Error!');
                                        setSnackbarOpen(true);
                                        handleEditClose();
                                        setDisableSubmit(false);
                                    });
                            } catch (err) {
                                setResponseStatus('error');
                                setResponseMessage('Oops Internal Server Error!');
                                setSnackbarOpen(true);
                                handleEditClose();
                                setDisableSubmit(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.jobTitleName && errors.jobTitleName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="jobTitle-name"
                                                type="text"
                                                value={values.jobTitleName}
                                                name="jobTitleName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Job Title Name*"
                                                inputProps={{}}
                                            />
                                            {touched.jobTitleName && errors.jobTitleName && (
                                                <FormHelperText error id="standard-weight-helper-text-jobTitle-name">
                                                    {errors.jobTitleName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.divisionId && errors.divisionId)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <InputLabel htmlFor="division-id">Division*</InputLabel>
                                            <Select
                                                id="division-id"
                                                value={values.divisionId}
                                                name="divisionId"
                                                label="Division*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            >
                                                {division.map((item, index) => (
                                                    <MenuItem id={`create${index}`} value={item.divisionId}>
                                                        {item.divisionName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.divisionId && errors.divisionId && (
                                                <FormHelperText error id="standard-weight-helper-text-division-id">
                                                    {errors.divisionId}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        {errors.submit && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}
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
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle fontSize={16} id="alert-dialog-title">
                    Delete Job Title Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure want to delete ${item.jobTitleName} job title ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>No</Button>
                    <Button onClick={deleteProject} autoFocus>
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
        </MainCard>
    );
};

export default JobTitle;
