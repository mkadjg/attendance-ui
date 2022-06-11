// assets
import { IconFileCheck, IconDashboard, IconFileAnalytics } from '@tabler/icons';

// constant
const icons = { IconFileCheck, IconDashboard, IconFileAnalytics };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const supervisor = [
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
                id: 'leave-approval-supervisor',
                title: 'Leave Approval',
                type: 'item',
                url: '/leave-approval-supervisor',
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
                id: 'project',
                title: 'Project',
                type: 'item',
                url: '/master-data/project',
                icon: icons.IconFileAnalytics,
                breadcrumbs: false
            }
        ]
    }
];

export default supervisor;
