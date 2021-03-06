// assets
import { IconFileCheck, IconDashboard, IconUsers, IconCalendar, IconBuildingSkyscraper, IconFolder, IconBriefcase } from '@tabler/icons';

// constant
const icons = { IconFileCheck, IconDashboard, IconUsers, IconCalendar, IconBuildingSkyscraper, IconFolder, IconBriefcase };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const hrd = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'group',
        children: [
            {
                id: 'default',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard',
                icon: icons.IconDashboard,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'approval',
        title: 'Approval',
        type: 'group',
        children: [
            {
                id: 'leave-approval-hrd',
                title: 'Leave Approval',
                type: 'item',
                url: '/leave-approval-hrd',
                icon: icons.IconFileCheck,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'master-data',
        title: 'Master Data',
        type: 'group',
        children: [
            {
                id: 'employee',
                title: 'Employee',
                type: 'item',
                url: '/master-data/employee',
                icon: icons.IconUsers,
                breadcrumbs: false
            },
            {
                id: 'division',
                title: 'Division',
                type: 'item',
                url: '/master-data/division',
                icon: icons.IconBuildingSkyscraper,
                breadcrumbs: false
            },
            {
                id: 'job-title',
                title: 'Job Title',
                type: 'item',
                url: '/master-data/job-title',
                icon: icons.IconBriefcase,
                breadcrumbs: false
            },
            {
                id: 'holiday',
                title: 'Holiday',
                type: 'item',
                url: '/master-data/holiday',
                icon: icons.IconCalendar,
                breadcrumbs: false
            },
            {
                id: 'leave-type',
                title: 'Leave Type',
                type: 'item',
                url: '/master-data/leave-type',
                icon: icons.IconFolder,
                breadcrumbs: false
            }
        ]
    }
];

export default hrd;
