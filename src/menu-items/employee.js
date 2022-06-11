// assets
import { IconFileCheck, IconDashboard, IconFileX, IconFileExport, IconFileText, IconTable } from '@tabler/icons';

// constant
const icons = { IconFileCheck, IconDashboard, IconFileX, IconFileExport, IconFileText, IconTable };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const employee = [
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
        id: 'attendance',
        title: 'Attendance',
        type: 'group',
        children: [
            {
                id: 'present',
                title: 'Present',
                type: 'collapse',
                icon: icons.IconFileCheck,
                breadcrumbs: false,
                children: [
                    {
                        id: 'form-present',
                        title: 'Form',
                        type: 'item',
                        url: '/form-present',
                        icon: icons.IconFileText,
                        breadcrumbs: false
                    },
                    {
                        id: 'history-present',
                        title: 'History',
                        type: 'item',
                        url: '/history-present',
                        icon: icons.IconTable,
                        breadcrumbs: false
                    }
                ]
            },
            {
                id: 'sick',
                title: 'Sick',
                type: 'collapse',
                url: '/sick',
                icon: icons.IconFileX,
                breadcrumbs: false,
                children: [
                    {
                        id: 'form-sick',
                        title: 'Form',
                        type: 'item',
                        url: '/form-sick',
                        icon: icons.IconFileText,
                        breadcrumbs: false
                    },
                    {
                        id: 'history-sick',
                        title: 'History',
                        type: 'item',
                        url: '/history-sick',
                        icon: icons.IconTable,
                        breadcrumbs: false
                    }
                ]
            }
        ]
    },
    {
        id: 'submission',
        title: 'Submission',
        type: 'group',
        children: [
            {
                id: 'leave-submission',
                title: 'Leave',
                type: 'collapse',
                url: '/submission/leave-submission',
                icon: icons.IconFileExport,
                breadcrumbs: false,
                children: [
                    {
                        id: 'form-leave',
                        title: 'Form',
                        type: 'item',
                        url: '/form-leave',
                        icon: icons.IconFileText,
                        breadcrumbs: false
                    },
                    {
                        id: 'history-leave',
                        title: 'History',
                        type: 'item',
                        url: '/history-leave',
                        icon: icons.IconTable,
                        breadcrumbs: false
                    }
                ]
            }
        ]
    }
];

export default employee;
