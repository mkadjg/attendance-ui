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
    Icon,
    Paper,
    Card,
    Chip
} from '@mui/material';
import DataTable from 'react-data-table-component-with-filter';
import { useTheme, styled } from '@mui/material/styles';
import { color, maxHeight, shouldForwardProp } from '@mui/system';
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
    IconFileText,
    IconTableExport,
    IconTable,
    IconUserX,
    IconUserOff
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
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import fileDownload from 'js-file-download';

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

const paperHeader = {
    border: 1,
    borderStyle: 'solid',
    borderColor: '#E0E0E0',
    borderRadius: 0,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#EEEEEE'
};

const paperBody = {
    border: 1,
    borderStyle: 'solid',
    borderColor: '#E0E0E0',
    borderRadius: 0,
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 8
};

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

const Timesheet = () => {
    const [cookies, setCookie] = useCookies();
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getUTCFullYear());
    const [attendanceTypeId, setAttendanceTypeId] = useState('all');
    const [attendanceTypes, setAttendanceTypes] = useState([]);
    const [timesheet, setTimesheet] = useState([]);
    const [disableExport, setDisableExport] = useState(false);
    const [employeeId, setEmployeeId] = useState(cookies.employeeId);
    const theme = useTheme();

    const monthList = [
        { value: 0, name: 'January' },
        { value: 1, name: 'February' },
        { value: 2, name: 'March' },
        { value: 3, name: 'April' },
        { value: 4, name: 'May' },
        { value: 5, name: 'June' },
        { value: 6, name: 'July' },
        { value: 7, name: 'August' },
        { value: 8, name: 'September' },
        { value: 9, name: 'October' },
        { value: 10, name: 'November' },
        { value: 11, name: 'December' }
    ];

    const yearList = [
        {
            value: new Date().getUTCFullYear() - 1,
            name: new Date().getUTCFullYear() - 1
        },
        { value: new Date().getUTCFullYear(), name: new Date().getUTCFullYear() }
    ];

    const getAttendanceTypes = () => {
        axios
            .get(`${config.baseUrl}absence/attendance-type/find-all`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setAttendanceTypes(response.data.data);
                }
            });
    };

    const exportTimesheetToExcel = () => {
        setDisableExport(true);
        axios
            .get(`${config.baseUrl}absence/attendance/timesheet/excel?employeeId=${employeeId}&month=${month}&year=${year}`, {
                headers: { Authorization: `Bearer ${cookies.token}` },
                responseType: 'blob'
            })
            .catch((error) => {
                setDisableExport(false);
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    fileDownload(response.data, 'timesheet.xlsx');
                }
                setDisableExport(false);
            });
    };

    const getTimesheet = (attendanceTypeId, newMonth, newYear) => {
        axios
            .get(
                `${config.baseUrl}absence/attendance/timesheet?employeeId=${employeeId}&attendanceTypeId=${attendanceTypeId}&month=${newMonth}&year=${newYear}`,
                {
                    headers: { Authorization: `Bearer ${cookies.token}` }
                }
            )
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setTimesheet(response.data.data);
                }
            });
    };

    useEffect(() => {
        getAttendanceTypes();
        getTimesheet(attendanceTypeId, month, year);
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
                                        <IconTable />
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
                                            Timesheet
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
                    <Grid spacing={2} style={{ marginBottom: 20 }} container>
                        <Grid item xs={2}>
                            <Tooltip title="Export Excel">
                                <Button
                                    fullWidth
                                    disabled={disableExport}
                                    size="medium"
                                    style={{ backgroundColor: '#00C853', color: '#fff' }}
                                    onClick={() => {
                                        exportTimesheetToExcel();
                                    }}
                                >
                                    {disableExport ? (
                                        <CircularProgress size="1.5rem" sx={{ color: '#fff' }} />
                                    ) : (
                                        <>
                                            <IconTableExport />
                                            Export Excel
                                        </>
                                    )}
                                </Button>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel htmlFor="attendance-types">Attendance Type*</InputLabel>
                                <Select
                                    id="attendance-types"
                                    name="attendanceTypeId"
                                    label="Attendance Type*"
                                    value={attendanceTypeId}
                                    onChange={(event) => {
                                        setAttendanceTypeId(event.target.value);
                                        getTimesheet(event.target.value, month, year);
                                    }}
                                    inputProps={{}}
                                >
                                    <MenuItem id="all" value="all">
                                        All
                                    </MenuItem>
                                    {attendanceTypes.map((item) => (
                                        <MenuItem id={item.attendanceTypeId} value={item.attendanceTypeId}>
                                            {item.attendanceTypeName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel htmlFor="month">Month*</InputLabel>
                                <Select
                                    id="month"
                                    name="month"
                                    label="month*"
                                    value={month}
                                    onChange={(event) => {
                                        setMonth(event.target.value);
                                        getTimesheet(attendanceTypeId, event.target.value, year);
                                    }}
                                    inputProps={{}}
                                >
                                    {monthList.map((item) => (
                                        <MenuItem id={item.value} value={item.value}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel htmlFor="month">Year*</InputLabel>
                                <Select
                                    id="year"
                                    name="year"
                                    label="year*"
                                    value={year}
                                    onChange={(event) => {
                                        setYear(event.target.value);
                                        getTimesheet(attendanceTypeId, month, event.target.value);
                                    }}
                                    inputProps={{}}
                                >
                                    {yearList.map((item) => (
                                        <MenuItem id={item.value} value={item.value}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <MainCard>
                        {timesheet.map((item) => (
                            <>
                                <Paper style={paperHeader}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1" fontWeight={800}>
                                                {moment(item.attendanceDate).format('dddd')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8} />
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1" fontWeight={800}>
                                                {moment(item.attendanceDate).format('LL')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper style={paperBody}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1" fontSize={13}>
                                                {item.attendanceType.attendanceTypeName === 'Present' ? (
                                                    <>
                                                        {moment(item.checkInTime).format('hh:mm a')} :
                                                        {moment(item.checkOutTime).format('hh:mm a')}
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1" fontSize={13}>
                                                {item.location}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle-1" fontSize={13}>
                                                {item.attendanceType.attendanceTypeName === 'Present' && (
                                                    <td dangerouslySetInnerHTML={{ __html: item.taskHtml }} />
                                                )}
                                                {item.attendanceType.attendanceTypeName === 'Sick' && (
                                                    <td dangerouslySetInnerHTML={{ __html: item.sick.descriptionHtml }} />
                                                )}
                                                {item.attendanceType.attendanceTypeName === 'Leave' && (
                                                    <td dangerouslySetInnerHTML={{ __html: item.leaveSubmission.descriptionHtml }} />
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            {item.attendanceType.attendanceTypeName === 'Present' && (
                                                <Tooltip title="Present">
                                                    <IconButton>
                                                        <IconUserCheck style={{ color: '#00C853' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {item.attendanceType.attendanceTypeName === 'Sick' && (
                                                <Tooltip title="Sick">
                                                    <IconButton>
                                                        <IconUserX style={{ color: '#F44336' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {item.attendanceType.attendanceTypeName === 'Leave' && (
                                                <Tooltip title="Leave">
                                                    <IconButton>
                                                        <IconUserOff style={{ color: '#673AB7' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        ))}
                    </MainCard>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Timesheet;
