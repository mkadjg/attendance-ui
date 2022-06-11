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
    IconMap,
    IconUsers
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
import 'yup-phone';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SignalWifiStatusbarNullSharp } from '@mui/icons-material';

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

const Employee = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const [data, setData] = useState([]);
    const [division, setDivision] = useState([]);
    const [detailOpen, setDetailOpen] = useState(Boolean);
    const [createOpen, setCreateOpen] = useState(Boolean);
    const [editOpen, setEditOpen] = useState(Boolean);
    const [deleteOpen, setDeleteOpen] = useState(Boolean);
    const [item, setItem] = useState({});
    const [userAuditId, setUserAuditId] = useState(cookies.auth.userId);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState('success');
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [employeePhoto, setEmployeePhoto] = useState({ raw: '', preview: '' });
    const theme = useTheme();

    const getListData = () => {
        axios
            .get(`${config.baseUrl}absence/employee/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
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
            .get(`${config.baseUrl}absence/division/find-all`, { headers: { Authorization: `Bearer ${cookies.auth.token}` } })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setDivision(response.data.data);
                }
            });
    };

    const handleChangePhoto = (event) => {
        if (event.target.files.length > 0) {
            setEmployeePhoto({
                raw: event.target.files[0],
                preview: URL.createObjectURL(event.target.files[0])
            });
        } else {
            setEmployeePhoto({
                raw: null,
                preview: null
            });
        }
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
        setEmployeePhoto({
            raw: null,
            preview: null
        });
        setCreateOpen(false);
    };

    const handleEditOpen = (row) => {
        getDivisionListData();
        setItem(row);
        setEmployeePhoto({
            raw: row.employeePhoto,
            preview: `data:image/jpeg;image/png;image/jpg;base64,${row.employeePhoto}`
        });
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setItem({});
        setEmployeePhoto({
            raw: null,
            preview: null
        });
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

    const deActivateEmployee = () => {
        axios
            .delete(`${config.baseUrl}auth/employee/delete/${item.employeeId}`, {
                headers: { Authorization: `Bearer ${cookies.auth.token}` }
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
    const actions = (row) => (
        <>
            <Tooltip title="Detail">
                <IconButton
                    onClick={() => {
                        handleDetailOpen(row);
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
                        handleEditOpen(row);
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
                        handleDeleteOpen(row);
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

    const SearchSection = () => {
        const theme = useTheme();
        const [value, setValue] = useState('');

        return (
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
                <OutlineInputStyle
                    id="input-search-header"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <ButtonBase sx={{ borderRadius: '12px' }}>
                                <HeaderAvatarStyle variant="rounded">
                                    <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                                </HeaderAvatarStyle>
                            </ButtonBase>
                        </InputAdornment>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{ 'aria-label': 'weight' }}
                />
            </Box>
        );
    };

    const columns = [
        {
            name: 'ID Number',
            selector: (row) => row.employeeNumber
        },
        {
            name: 'Name',
            selector: (row) => row.employeeName
        },
        {
            name: 'Email',
            selector: (row) => row.employeeEmail
        },
        {
            name: 'Phone Number',
            selector: (row) => row.employeePhoneNumber
        },
        {
            name: 'Division',
            selector: (row) => row.division.divisionName
        },
        {
            name: 'Action',
            width: '200px',
            selector: (row) => actions(row)
        }
    ];

    return (
        <MainCard title="Employee" secondary={<SearchSection />}>
            <DataTable columns={columns} data={data} responsive="true" pagination />
            <Modal
                id="detail"
                open={detailOpen}
                onClose={handleDetailClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <MainCard sx={modalStyle}>
                    <Grid container>
                        <Grid item xs={2}>
                            {item.employeePhoto ? (
                                <Avatar
                                    src={`data:image/jpeg;image/png;image/jpg;base64,${item.employeePhoto}`}
                                    sx={{
                                        ...theme.typography.largeAvatar,
                                        margin: '8px 0 8px 8px !important',
                                        cursor: 'pointer',
                                        height: '80px',
                                        width: '80px'
                                    }}
                                    aria-haspopup="true"
                                    color="inherit"
                                />
                            ) : (
                                <Avatar
                                    src={null}
                                    sx={{
                                        ...theme.typography.largeAvatar,
                                        margin: '8px 0 8px 8px !important',
                                        cursor: 'pointer',
                                        height: '80px',
                                        width: '80px'
                                    }}
                                    aria-haspopup="true"
                                    color="inherit"
                                />
                            )}
                        </Grid>
                        <Grid item xs={8}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            item.employeeName === null ? (
                                                <Typography variant="subtitle1" fontSize={30}>
                                                    -
                                                </Typography>
                                            ) : (
                                                <Typography variant="subtitle1" fontSize={18}>
                                                    {item.employeeName}
                                                </Typography>
                                            )
                                        }
                                        secondary={item.division === null ? '-' : item.division?.divisionName}
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
                                        <Avatar>
                                            <IconId />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="ID Number"
                                        secondary={item.employeeNumber === null ? '-' : item.employeeNumber}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconMail />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Email" secondary={item.employeeEmail === null ? '-' : item.employeeEmail} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconPhone />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Phone Number"
                                        secondary={item.employeePhoneNumber === null ? '-' : item.employeePhoneNumber}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconBuildingSkyscraper />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Address"
                                        secondary={item.employeeAddress === null ? '-' : item.employeeAddress}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconUsers />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Gender" secondary={item.employeeGender === null ? '-' : item.employeeGender} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconCalendar />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Birth Date"
                                        secondary={
                                            item.employeeBirthdate === null ? (
                                                '-'
                                            ) : (
                                                <Moment format="D MMM YYYY">{item.employeeBirthdate}</Moment>
                                            )
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <IconMap />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Birth Place"
                                        secondary={item.employeeBirthplace === null ? '-' : item.employeeBirthplace}
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
                <MainCard sx={modalStyle} title="Add New Employee">
                    <Formik
                        initialValues={{
                            employeeNumber: '',
                            employeeName: '',
                            employeeBirthdate: '',
                            employeeBirthplace: '',
                            employeeAddress: '',
                            employeeGender: 0,
                            employeeEmail: '',
                            employeePhoneNumber: '',
                            isSupervisor: false,
                            divisionId: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            employeeName: Yup.string().max(255).required('Employee Name is required'),
                            employeeBirthdate: Yup.date().required('Birth Date is required'),
                            employeeBirthplace: Yup.string().max(255).required('Birth Place is required'),
                            employeeAddress: Yup.string().max(255).required('Address is required'),
                            employeeGender: Yup.string().max(255).required('Gender is required'),
                            employeeEmail: Yup.string().max(255).email().required('Email is required'),
                            employeePhoneNumber: Yup.string()
                                .matches('^[0-9]*$', 'Phone Number is invalid')
                                .max(15)
                                .required('Phone Number is required'),
                            divisionId: Yup.string().required('Phone Number is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    employeeName: values.employeeName,
                                    employeeBirthdate: values.employeeBirthdate,
                                    employeeBirthplace: values.employeeBirthplace,
                                    employeeAddress: values.employeeAddress,
                                    employeeGender: values.employeeGender,
                                    employeeEmail: values.employeeEmail,
                                    employeePhoneNumber: values.employeePhoneNumber,
                                    isSupervisor: values.isSupervisor ? 1 : 0,
                                    divisionId: values.divisionId
                                };
                                axios
                                    .post(`${config.baseUrl}auth/employee/register`, body, {
                                        headers: { Authorization: `Bearer ${cookies.auth.token}`, 'user-audit-id': userAuditId }
                                    })
                                    .then((response) => {
                                        if (response.status) {
                                            if (response.status === 200) {
                                                const employeeId = response.data?.data?.employeeId;
                                                const bodyPhoto = new FormData();
                                                bodyPhoto.append('photo', employeePhoto.raw);
                                                axios
                                                    .post(`${config.baseUrl}absence/employee/upload-photo/${employeeId}`, bodyPhoto, {
                                                        headers: {
                                                            Authorization: `Bearer ${cookies.auth.token}`,
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
                                            handleCreateClose();
                                            getListData();
                                            setDisableSubmit(false);
                                        } else {
                                            setResponseStatus('error');
                                            setResponseMessage('Oops Internal Server Error!');
                                            setSnackbarOpen(true);
                                            handleCreateClose();
                                            setDisableSubmit(false);
                                        }
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
                                            error={Boolean(touched.employeeName && errors.employeeName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-name"
                                                type="text"
                                                value={values.employeeName}
                                                name="employeeName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Employee Name*"
                                                inputProps={{}}
                                            />
                                            {touched.employeeName && errors.employeeName && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-name">
                                                    {errors.employeeName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl style={{ marginBottom: 10 }}>
                                            <FormLabel htmlFor="employee-gender">Gender*</FormLabel>
                                            <RadioGroup
                                                row
                                                id="employee-gender"
                                                value={values.employeeGender}
                                                name="employeeGender"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Gender*"
                                                inputProps={{}}
                                            >
                                                <FormControlLabel value="1" control={<Radio size="small" />} label="Male" />
                                                <FormControlLabel value="0" control={<Radio size="small" />} label="Female" />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeBirthdate && errors.employeeBirthdate)}
                                            style={{ marginBottom: 15 }}
                                        >
                                            <TextField
                                                id="employee-birthdate"
                                                value={values.employeeBirthdate}
                                                type="date"
                                                name="employeeBirthdate"
                                                label="Birth Date*"
                                                InputLabelProps={{ shrink: true }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            />
                                            {touched.employeeBirthdate && errors.employeeBirthdate && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthdate">
                                                    {errors.employeeBirthdate}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeBirthplace && errors.employeeBirthplace)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-birthplace"
                                                type="text"
                                                value={values.employeeBirthplace}
                                                name="employeeBirthplace"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Birth Place*"
                                                inputProps={{}}
                                            />
                                            {touched.employeeBirthplace && errors.employeeBirthplace && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthplace">
                                                    {errors.employeeBirthplace}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeAddress && errors.employeeAddress)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-address"
                                                type="text"
                                                value={values.employeeAddress}
                                                name="employeeAddress"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Address*"
                                                inputProps={{}}
                                                multiline
                                                rows={3}
                                            />
                                            {touched.employeeAddress && errors.employeeAddress && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthplace">
                                                    {errors.employeeAddress}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeEmail && errors.employeeEmail)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-email"
                                                value={values.employeeEmail}
                                                type="email"
                                                name="employeeEmail"
                                                label="Email*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            />
                                            {touched.employeeEmail && errors.employeeEmail && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-email">
                                                    {errors.employeeEmail}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeePhoneNumber && errors.employeePhoneNumber)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-phone-number"
                                                value={values.employeePhoneNumber}
                                                type="text"
                                                name="employeePhoneNumber"
                                                label="Phone Number*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">+62</InputAdornment>
                                                }}
                                            />
                                            {touched.employeePhoneNumber && errors.employeePhoneNumber && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-phone-number">
                                                    {errors.employeePhoneNumber}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
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
                                        <FormGroup>
                                            <FormControlLabel
                                                style={{ marginBottom: 18 }}
                                                control={
                                                    <Checkbox
                                                        id="is-supervisor"
                                                        value={values.isSupervisor}
                                                        name="isSupervisor"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                    />
                                                }
                                                label="Supervisor"
                                            />
                                        </FormGroup>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeePhoneNumber && errors.employeePhoneNumber)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <FormLabel htmlFor="employee-photo">Photo*</FormLabel>
                                            <TextField
                                                id="employee-photo"
                                                type="file"
                                                name="employeePhoto"
                                                inputProps={{}}
                                                onChange={handleChangePhoto}
                                            />
                                            {touched.employeePhoto && errors.employeePhoto && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-photo">
                                                    {errors.employeePhoto}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        {employeePhoto.preview ? (
                                            <Avatar
                                                src={employeePhoto.preview}
                                                sx={{
                                                    ...theme.typography.largeAvatar,
                                                    margin: '8px 0 8px 8px !important',
                                                    cursor: 'pointer',
                                                    height: '80px',
                                                    width: '80px'
                                                }}
                                                aria-haspopup="true"
                                                color="inherit"
                                            />
                                        ) : (
                                            <Avatar
                                                src={null}
                                                sx={{
                                                    ...theme.typography.largeAvatar,
                                                    margin: '8px 0 8px 8px !important',
                                                    cursor: 'pointer',
                                                    height: '80px',
                                                    width: '80px'
                                                }}
                                                aria-haspopup="true"
                                                color="inherit"
                                            />
                                        )}
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
                <MainCard sx={modalStyle} title="Edit Data Employee">
                    <Formik
                        initialValues={{
                            employeeId: item.employeeNumber,
                            employeeNumber: item.employeeNumber,
                            employeeName: item.employeeName,
                            employeeBirthdate: item.employeeBirthdate,
                            employeeBirthplace: item.employeeBirthplace,
                            employeeAddress: item.employeeAddress,
                            employeeGender: item.employeeGender,
                            employeeEmail: item.employeeEmail,
                            employeePhoneNumber: item.employeePhoneNumber,
                            isSupervisor: item.isSupervisor === 1,
                            divisionId: item.division?.divisionId
                        }}
                        validationSchema={Yup.object().shape({
                            employeeName: Yup.string().max(255).required('Employee Name is required'),
                            employeeBirthdate: Yup.date().required('Birth Date is required'),
                            employeeBirthplace: Yup.string().max(255).required('Birth Place is required'),
                            employeeAddress: Yup.string().max(255).required('Address is required'),
                            employeeGender: Yup.string().max(255).required('Gender is required'),
                            employeeEmail: Yup.string().max(255).email().required('Email is required'),
                            employeePhoneNumber: Yup.string()
                                .matches('^[0-9]*$', 'Phone Number is invalid')
                                .max(15)
                                .required('Phone Number is required'),
                            divisionId: Yup.string().required('Phone Number is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setDisableSubmit(true);
                                const body = {
                                    employeeName: values.employeeName,
                                    employeeBirthdate: values.employeeBirthdate,
                                    employeeBirthplace: values.employeeBirthplace,
                                    employeeAddress: values.employeeAddress,
                                    employeeGender: values.employeeGender,
                                    employeeEmail: values.employeeEmail,
                                    employeePhoneNumber: values.employeePhoneNumber,
                                    isSupervisor: values.isSupervisor ? 1 : 0,
                                    divisionId: values.divisionId
                                };
                                axios
                                    .put(`${config.baseUrl}absence/employee/update/${item.employeeId}`, body, {
                                        headers: { Authorization: `Bearer ${cookies.auth.token}`, 'user-audit-id': userAuditId }
                                    })
                                    .then((response) => {
                                        if (response.status) {
                                            if (response.status === 200) {
                                                const employeeId = response.data?.data?.employeeId;
                                                const bodyPhoto = new FormData();
                                                bodyPhoto.append('photo', employeePhoto.raw);
                                                axios
                                                    .post(`${config.baseUrl}absence/employee/upload-photo/${employeeId}`, bodyPhoto, {
                                                        headers: {
                                                            Authorization: `Bearer ${cookies.auth.token}`,
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
                                            handleEditClose();
                                            getListData();
                                            setDisableSubmit(false);
                                        } else {
                                            setResponseStatus('error');
                                            setResponseMessage('Oops Internal Server Error!');
                                            setSnackbarOpen(true);
                                            handleEditClose();
                                            setDisableSubmit(false);
                                        }
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
                                            error={Boolean(touched.employeeName && errors.employeeName)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-name"
                                                type="text"
                                                value={values.employeeName}
                                                name="employeeName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Employee Name*"
                                                inputProps={{}}
                                            />
                                            {touched.employeeName && errors.employeeName && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-name">
                                                    {errors.employeeName}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl style={{ marginBottom: 10 }}>
                                            <FormLabel htmlFor="employee-gender">Gender*</FormLabel>
                                            <RadioGroup
                                                row
                                                id="employee-gender"
                                                value={values.employeeGender}
                                                name="employeeGender"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Gender*"
                                                inputProps={{}}
                                            >
                                                <FormControlLabel value="1" control={<Radio size="small" />} label="Male" />
                                                <FormControlLabel value="0" control={<Radio size="small" />} label="Female" />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeBirthdate && errors.employeeBirthdate)}
                                            style={{ marginBottom: 15 }}
                                        >
                                            <TextField
                                                id="employee-birthdate"
                                                value={moment(values.employeeBirthdate).format('YYYY-MM-DD')}
                                                type="date"
                                                name="employeeBirthdate"
                                                label="Birth Date*"
                                                InputLabelProps={{ shrink: true }}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            />
                                            {touched.employeeBirthdate && errors.employeeBirthdate && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthdate">
                                                    {errors.employeeBirthdate}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeBirthplace && errors.employeeBirthplace)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-birthplace"
                                                type="text"
                                                value={values.employeeBirthplace}
                                                name="employeeBirthplace"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Birth Place*"
                                                inputProps={{}}
                                            />
                                            {touched.employeeBirthplace && errors.employeeBirthplace && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthplace">
                                                    {errors.employeeBirthplace}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeAddress && errors.employeeAddress)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-address"
                                                type="text"
                                                value={values.employeeAddress}
                                                name="employeeAddress"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Address*"
                                                inputProps={{}}
                                                multiline
                                                rows={3}
                                            />
                                            {touched.employeeAddress && errors.employeeAddress && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-birthplace">
                                                    {errors.employeeAddress}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeeEmail && errors.employeeEmail)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-email"
                                                value={values.employeeEmail}
                                                type="email"
                                                name="employeeEmail"
                                                label="Email*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            />
                                            {touched.employeeEmail && errors.employeeEmail && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-email">
                                                    {errors.employeeEmail}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.employeePhoneNumber && errors.employeePhoneNumber)}
                                            style={{ marginBottom: 18 }}
                                        >
                                            <TextField
                                                id="employee-phone-number"
                                                value={values.employeePhoneNumber}
                                                type="text"
                                                name="employeePhoneNumber"
                                                label="Phone Number*"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{}}
                                            />
                                            {touched.employeePhoneNumber && errors.employeePhoneNumber && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-phone-number">
                                                    {errors.employeePhoneNumber}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
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
                                                    <MenuItem id={`edit${index}`} value={item.divisionId}>
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
                                        <FormGroup>
                                            <FormControlLabel
                                                style={{ marginBottom: 18 }}
                                                control={
                                                    <Checkbox
                                                        id="is-supervisor"
                                                        value={values.isSupervisor}
                                                        checked={values.isSupervisor}
                                                        name="isSupervisor"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                    />
                                                }
                                                label="Supervisor"
                                            />
                                        </FormGroup>
                                        <FormControl fullWidth style={{ marginBottom: 18 }}>
                                            <FormLabel htmlFor="employee-photo">Photo*</FormLabel>
                                            <TextField id="employee-photo" type="file" name="employeePhoto" inputProps={{}} />
                                            {touched.employeePhoto && errors.employeePhoto && (
                                                <FormHelperText error id="standard-weight-helper-text-employee-photo">
                                                    {errors.employeePhoto}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                        {employeePhoto.preview ? (
                                            <Avatar
                                                src={employeePhoto.preview}
                                                sx={{
                                                    ...theme.typography.largeAvatar,
                                                    margin: '8px 0 8px 8px !important',
                                                    cursor: 'pointer',
                                                    height: '80px',
                                                    width: '80px'
                                                }}
                                                aria-haspopup="true"
                                                color="inherit"
                                            />
                                        ) : (
                                            <Avatar
                                                src={SignalWifiStatusbarNullSharp}
                                                sx={{
                                                    ...theme.typography.largeAvatar,
                                                    margin: '8px 0 8px 8px !important',
                                                    cursor: 'pointer',
                                                    height: '80px',
                                                    width: '80px'
                                                }}
                                                aria-haspopup="true"
                                                color="inherit"
                                            />
                                        )}
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
                    Delete Employee Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Are you sure want to delete ${item.employeeName} ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>No</Button>
                    <Button onClick={deActivateEmployee} autoFocus>
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

export default Employee;
