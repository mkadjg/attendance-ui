// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import hrd from 'menu-items/hrd';
import employee from 'menu-items/employee';
import supervisor from 'menu-items/supervisor';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const [cookies, setCookie] = useCookies();
    const [menuItem, setMenuItem] = useState([]);

    const onLoadMenuItems = () => {
        if (cookies.role === 'HRD') {
            setMenuItem(hrd);
        } else if (cookies.role === 'Employee') {
            setMenuItem(employee);
        } else if (cookies.role === 'Supervisor') {
            setMenuItem(supervisor);
        }
    };

    useEffect(() => {
        onLoadMenuItems();
    }, []);

    const navItems = menuItem.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
