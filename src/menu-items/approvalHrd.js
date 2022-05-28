// assets
import { IconFileCheck } from '@tabler/icons';

// constant
const icons = { IconFileCheck };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const approvalHrd = {
    id: 'approval',
    title: 'Approval',
    type: 'group',
    children: [
        {
            id: 'leave-submission',
            title: 'Leave Submission',
            type: 'item',
            url: '/leave-submission',
            icon: icons.IconFileCheck,
            breadcrumbs: false
        }
    ]
};

export default approvalHrd;
