import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, IconButton, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import axios from 'axios';
import { IconCircleX, IconUserOff, IconUserX } from '@tabler/icons';
import { useCookies } from 'react-cookie';
import moment from 'moment';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

const paperHeader = {
    marginBottom: '10px'
};

const paperBody = {
    marginTop: '4px',
    marginBottom: '8px'
};

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const PeopleOff = ({ isLoading, peopleOff }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="h4">Who is off today :</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">{peopleOff.length}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={paperHeader}>
                                <Grid container spacing={1} alignContent="center" alignItems="center">
                                    <Grid item xs={3}>
                                        <Typography variant="subtitle-1" fontWeight={800}>
                                            Name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="subtitle-1" fontWeight={800}>
                                            Division
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle-1" fontWeight={800}>
                                            Description
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography variant="subtitle-1" fontWeight={800}>
                                            Status
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                            {peopleOff.map((item) => (
                                <>
                                    <Paper>
                                        <Divider />
                                        <Grid sx={paperBody} container spacing={1} alignContent="center" alignItems="center">
                                            <Grid item xs={3}>
                                                <Typography variant="subtitle-1">{item.employee.employeeName}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography variant="subtitle-1">{item.division.divisionName}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle-1">
                                                    <td dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1}>
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
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

PeopleOff.propTypes = {
    isLoading: PropTypes.bool
};

export default PeopleOff;
