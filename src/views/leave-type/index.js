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

const LeaveType = () => {
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
    const theme = useTheme();

    const getListData = () => {
        axios
            .get(`${config.baseUrl}absence/leave-type/find-all`, { headers: { Authorization: `Bearer ${cookies.token}` } })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setData(response.data.data);
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
        setCreateOpen(true);
    };

    const handleCreateClose = () => {
        setItem({});
        setCreateOpen(false);
    };

    const handleEditOpen = (row) => {
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

    const deleteLeaveType = () => {
        axios
            .delete(`${config.baseUrl}absence/leave-type/delete/${item.leaveTypeId}`, {
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
            label: 'Leave Type Name',
            name: 'leaveTypeName'
        },
        {
            label: 'Description',
            name: 'leaveTypeDesc'
        },
        {
            label: 'Total Days Off',
            name: 'defaultValue'
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
        selectableRowsHideCheckboxes: true,
        elevation: 0
    };

    return (
        <MainCard title="Leave Type" secondary={<AddSection />}>
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
                                                Leave Type Detail
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
                                        primary="Leave Type Name"
                                        secondary={item.leaveTypeName === null ? '-' : item.leaveTypeName}
                                    />
                                </ListItem>
                            </List>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <IconButton color="secondary" size="medium" disableRipple style={{ backgroundColor: '#EDE7F6' }}>
                                            <IconCalendar />
                                        </IconButton>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Total Days Off"
                                        secondary={item.defaultValue === null ? '-' : item.defaultValue}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <IconButton color="secondary" size="medium" disableRipple style={{ backgroundColor: '#EDE7F6' }}>
                                            <IconNotes />
                                        </IconButton>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Description"
                                        secondary={item.leaveTypeDesc === null ? '-' : item.leaveTypeDesc}
                                    />
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
                <MainCard sx={modalStyle} title="Add New Leave Type">
                    <Formik
                        initialValues={{
                            leaveTypeName: '',
                            leaveTypeDesc: '',
                            defaultValue: 0
                        }}
                        validationSchema={Yup.object().shape({
                            leaveTypeName: Yup.string().max(255).required('Leave Type Name is required'),
                            defaultValue: Yup.number().max(60).required('Total Days Off is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    leaveTypeName: values.leaveTypeName,
                                    leaveTypeDesc: values.leaveTypeDesc,
                                    defaultValue: values.defaultValue
                                };
                                axios
                                    .post(`${config.baseUrl}absence/leave-type/create`, body, {
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
                                            error={Boolean(touched.leaveTypeName && errors.leaveTypeName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="leave-type-name"
                                                type="text"
                                                value={values.leaveTypeName}
                                                name="leaveTypeName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Leave Type Name*"
                                                inputProps={{}}
                                            />
                                            {touched.leaveTypeName && errors.leaveTypeName && (
                                                <FormHelperText error id="standard-weight-helper-text-leaveType-name">
                                                    {errors.leaveTypeName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.defaultValue && errors.defaultValue)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="default-value"
                                                type="number"
                                                value={values.defaultValue}
                                                name="defaultValue"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Total Days Off*"
                                                inputProps={{}}
                                            />
                                            {touched.defaultValue && errors.defaultValue && (
                                                <FormHelperText error id="standard-weight-helper-text-default-value">
                                                    {errors.defaultValue}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.leaveTypeDesc && errors.leaveTypeDesc)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="leave-type-desc"
                                                value={values.leaveTypeDesc}
                                                type="text"
                                                name="leaveTypeDesc"
                                                label="Leave Type Desc"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                multiline
                                                rows={3}
                                            />
                                            {touched.leaveTypeDesc && errors.leaveTypeDesc && (
                                                <FormHelperText error id="standard-weight-helper-text-leaveType-desc">
                                                    {errors.leaveTypeDesc}
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
                <MainCard sx={modalStyle} title="Edit Data Leave Type">
                    <Formik
                        initialValues={item}
                        validationSchema={Yup.object().shape({
                            leaveTypeName: Yup.string().max(255).required('Leave Type Name is required'),
                            defaultValue: Yup.number().max(60).required('Total Days Off is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    leaveTypeName: values.leaveTypeName,
                                    leaveTypeDesc: values.leaveTypeDesc,
                                    defaultValue: values.defaultValue
                                };
                                axios
                                    .put(`${config.baseUrl}absence/leave-type/update/${item.leaveTypeId}`, body, {
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
                                            error={Boolean(touched.leaveTypeName && errors.leaveTypeName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="leaveType-name"
                                                type="text"
                                                value={values.leaveTypeName}
                                                name="divisioName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Leave Type Name*"
                                                inputProps={{}}
                                            />
                                            {touched.leaveTypeName && errors.leaveTypeName && (
                                                <FormHelperText error id="standard-weight-helper-text-leaveType-name">
                                                    {errors.leaveTypeName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.defaultValue && errors.defaultValue)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="default-value"
                                                type="number"
                                                value={values.defaultValue}
                                                name="defaultValue"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Total Days Off*"
                                                inputProps={{}}
                                            />
                                            {touched.defaultValue && errors.defaultValue && (
                                                <FormHelperText error id="standard-weight-helper-text-default-value">
                                                    {errors.defaultValue}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.leaveTypeDesc && errors.leaveTypeDesc)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="leaveType-desc"
                                                value={values.leaveTypeDesc}
                                                type="text"
                                                name="leaveTypeDesc"
                                                label="Leave Type Desc"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                                multiline
                                                rows={3}
                                            />
                                            {touched.leaveTypeDesc && errors.leaveTypeDesc && (
                                                <FormHelperText error id="standard-weight-helper-text-leaveType-desc">
                                                    {errors.leaveTypeDesc}
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
                    Delete Leave Type Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure want to delete ${item.leaveTypeName} leave type ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>No</Button>
                    <Button onClick={deleteLeaveType} autoFocus>
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

export default LeaveType;
