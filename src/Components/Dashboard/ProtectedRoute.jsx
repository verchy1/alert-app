import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../data/firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = () => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center text-center " style={{height: "100vh"}}>
                <CircularProgress />
            </div>
        )
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
