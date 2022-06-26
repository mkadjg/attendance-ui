import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import LeaveAvailable from './LeaveAvailable';
import YourSummary from './YourSummary';
import LeaveUsed from './LeaveUsed';
import CutiTahunan from './CutiTahunan';
import CutiLintasTahun from './CutiLintasTahun';
import PeopleOff from './PeopleOff';
import { gridSpacing } from 'store/constant';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import config from 'config';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [cookies, setCookie] = useCookies();
    const [isLeaveInfoLoading, setLeaveInfoLoading] = useState(true);
    const [cutiTahunan, setCutiTahunan] = useState(0);
    const [cutiLintasTahun, setCutiLintasTahun] = useState(0);
    const [leaveAvailable, setLeaveAvailable] = useState(0);
    const [leaveUsed, setLeaveUsed] = useState(0);
    const [peopleOff, setPeopleOff] = useState([]);

    const getLeaveInfo = () => {
        setLeaveInfoLoading(true);
        axios
            .get(`${config.baseUrl}absence/dashboard/leave-info/${cookies.employeeId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    setLeaveAvailable(response.data?.data?.available);
                    setLeaveUsed(response.data?.data?.used);
                    response.data?.data?.data?.map((item) => {
                        if (item.leaveType.leaveTypeName === 'Cuti Tahunan') {
                            setCutiTahunan(item.available);
                        } else {
                            setCutiLintasTahun(item.available);
                        }
                        return null;
                    });
                    setLeaveInfoLoading(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setLeaveInfoLoading(true);
            });
    };

    const getPeopleOff = () => {
        setLeaveInfoLoading(true);
        axios
            .get(`${config.baseUrl}absence/dashboard/people-off/${cookies.employeeId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    setPeopleOff(response.data?.data);
                    setLeaveInfoLoading(true);
                }
            })
            .catch((error) => {
                console.log(error);
                setLeaveInfoLoading(true);
            });
    };

    useEffect(() => {
        getLeaveInfo();
        getPeopleOff();
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <LeaveAvailable isLoading={isLoading} leaveAvailable={leaveAvailable} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <LeaveUsed isLoading={isLoading} leaveUsed={leaveUsed} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <CutiTahunan isLoading={isLoading} cutiTahunan={cutiTahunan} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <CutiLintasTahun isLoading={isLoading} cutiLintasTahun={cutiLintasTahun} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <PeopleOff isLoading={isLoading} peopleOff={peopleOff} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <YourSummary isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
