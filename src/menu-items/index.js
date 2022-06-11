import dashboard from './dashboard';
import masterData from './masterData';
import approvalHrd from './approvalHrd';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import hrd from './hrd';
import supervisor from './supervisor';
import { useCookies } from 'react-cookie';
import employee from './employee';
import { useEffect, useState } from 'react';

// ==============================|| MENU ITEMS ||============================== //

const MenuItems = () => {
    const [cookies, setCookie] = useCookies();
    const [menuItems, setMenuItems] = useState({
        items: []
    });

    const onLoadMenuItems = () => {
        if (cookies.role === 'HRD') {
            setMenuItems({
                items: hrd
            });
        } else if (cookies.role === 'Employee') {
            setMenuItems({
                items: employee
            });
        } else if (cookies.items.role === 'Supervisor') {
            setMenuItems({
                items: supervisor
            });
        }
    };

    useEffect(() => {
        onLoadMenuItems();
    }, []);
};

export default MenuItems.menuItems;
