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
    Chip,
    Divider
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
    IconFileText,
    IconTable,
    IconFileDownload
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

const paperHeader = {
    marginBottom: '10px'
};

const paperBody = {
    marginTop: '4px',
    marginBottom: '8px'
};

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

const HistorySick = () => {
    const [cookies, setCookie] = useCookies();
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getUTCFullYear());
    const [sickHistory, setSickHistory] = useState([]);
    const [employeeId, setEmployeeId] = useState(cookies.auth.employeeId);
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

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i += 1) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    const viewFile = (item) => {
        const blob = b64toBlob(item.document, 'application/pdf');
        const blobUrl = URL.createObjectURL(blob);
        const pdfWindow = window.open();
        pdfWindow.location.href = blobUrl;
    };

    const getSickHistory = (newMonth, newYear) => {
        axios
            .get(`${config.baseUrl}absence/attendance/sick-history?employeeId=${employeeId}&month=${newMonth}&year=${newYear}`, {
                headers: { Authorization: `Bearer ${cookies.auth.token}` }
            })
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                if (response.status === 200) {
                    setSickHistory(response.data.data);
                }
            });
    };

    useEffect(() => {
        getSickHistory(month, year);
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
                                        <Typography variant="h2" sx={{ color: '#F44336' }}>
                                            Sick History
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
                        <Grid item xs={8} />
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
                                        getSickHistory(event.target.value, year);
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
                                        getSickHistory(month, event.target.value);
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
                        <Paper sx={paperHeader}>
                            <Grid container spacing={1} alignContent="center" alignItems="center">
                                <Grid item xs={2}>
                                    <Typography variant="subtitle-1" fontWeight={800}>
                                        Start Date
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle-1" fontWeight={800}>
                                        End Date
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle-1" fontWeight={800}>
                                        Description
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle-1" fontWeight={800}>
                                        Sub Partner
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle-1" fontWeight={800}>
                                        Document
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        {sickHistory.map((item) => (
                            <>
                                <Paper>
                                    <Divider />
                                    <Grid sx={paperBody} container spacing={1} alignContent="center" alignItems="center">
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1">{moment(item.startDate).format('LL')}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1">{moment(item.endDate).format('LL')}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="subtitle-1">
                                                <td dangerouslySetInnerHTML={{ __html: item.description }} />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1">{item.subPartnerName}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle-1">
                                                <IconButton
                                                    color="primary"
                                                    size="medium"
                                                    disableRipple
                                                    onClick={() => {
                                                        viewFile(item);
                                                    }}
                                                >
                                                    <IconFileDownload />
                                                </IconButton>
                                            </Typography>
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

export default HistorySick;
