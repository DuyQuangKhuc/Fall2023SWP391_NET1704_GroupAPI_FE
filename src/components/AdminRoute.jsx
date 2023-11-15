import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dasboard from '../dasboard/Dasboard';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);
    return userInfo.role === 1 || userInfo.role === 2 || userInfo.role === 3 ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};
export default AdminRoute;