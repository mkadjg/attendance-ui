// assets
import { IconUsers, IconCalendar, IconBuildingSkyscraper, IconFolder } from '@tabler/icons';

// constant
const icons = { IconUsers, IconCalendar, IconBuildingSkyscraper, IconFolder };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const masterData = {
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
};

export default masterData;
