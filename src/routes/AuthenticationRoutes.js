import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// forgot password
const ForgotPassword = Loadable(lazy(() => import('views/forgot-password')));
const ValidateOtp = Loadable(lazy(() => import('views/validate-otp')));
const NewPassword = Loadable(lazy(() => import('views/new-password')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/',
            element: <AuthLogin3 />
        },
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/pages/register/register3',
            element: <AuthRegister3 />
        },
        {
            path: '/forgot-password',
            element: <ForgotPassword />
        },
        {
            path: '/validate-otp',
            element: <ValidateOtp />
        },
        {
            path: '/new-password',
            element: <NewPassword />
        }
    ]
};

export default AuthenticationRoutes;
