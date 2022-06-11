import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Login from 'views/pages/authentication/authentication3/Login3';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// master data routing
const Employee = Loadable(lazy(() => import('views/employee')));
const Division = Loadable(lazy(() => import('views/division')));
const Holiday = Loadable(lazy(() => import('views/holiday')));
const LeaveType = Loadable(lazy(() => import('views/leave-type')));
const Project = Loadable(lazy(() => import('views/project')));

// attendance routing
const FormPresent = Loadable(lazy(() => import('views/form-present')));
const FormSick = Loadable(lazy(() => import('views/form-sick')));
const FormLeave = Loadable(lazy(() => import('views/form-leave')));
const HistoryPresent = Loadable(lazy(() => import('views/history-present')));
const HistorySick = Loadable(lazy(() => import('views/history-sick')));
const HistoryLeave = Loadable(lazy(() => import('views/history-leave')));

// submission routing
const LeaveSubmission = Loadable(lazy(() => import('views/leave-submission')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '',
    element: <MainLayout />,
    children: [
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/master-data/employee',
            element: <Employee />
        },
        {
            path: '/master-data/division',
            element: <Division />
        },
        {
            path: '/master-data/holiday',
            element: <Holiday />
        },
        {
            path: '/master-data/leave-type',
            element: <LeaveType />
        },
        {
            path: '/master-data/project',
            element: <Project />
        },
        {
            path: '/submission/leave-submission',
            element: <LeaveSubmission />
        },
        {
            path: '/form-present',
            element: <FormPresent />
        },
        {
            path: '/form-sick',
            element: <FormSick />
        },
        {
            path: '/form-leave',
            element: <FormLeave />
        },
        {
            path: '/history-present',
            element: <HistoryPresent />
        },
        {
            path: '/history-sick',
            element: <HistorySick />
        },
        {
            path: '/history-leave',
            element: <HistoryLeave />
        }
    ]
};

export default MainRoutes;
