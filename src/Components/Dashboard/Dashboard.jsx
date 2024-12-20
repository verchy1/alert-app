import styles from "./dashboard.module.css";
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState, useMemo, useRef } from "react";
import Profile from "./Profile";
import Properties from "./Properties";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Archive from "./Archive";
import { useDispatch, useSelector } from 'react-redux';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Drawer from '@mui/material/Drawer';
import { setAlerts } from "../../features/todo";
import { setAlertsNotif } from "../../features/Notifications";
import { db } from "../../data/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { auth } from '../../data/firebaseConfig';
import Badge from '@mui/material/Badge';
import { handleNotificationClick } from "./utils/Notifications";
import { handleDeleteNotification } from "./utils/DeleteNotification";
import NotificationsList from "./utils/NotificationsList";
import { LogOut } from "./LogOut";



export default function Dashboard() {
    const tabList = [
        { name: "Dashboard", component: <Properties />, icon: <DashboardIcon />, route: "/dashboard/properties" },
        { name: "Profile", component: <Profile />, icon: <PersonIcon />, route: "/dashboard/profile" },
        { name: "Autorisation", component: <Archive />, icon: <WorkspacePremiumIcon />, route: "/dashboard/autorisation" },
    ];

    const [showComponents, setShowComponents] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const notifications = useSelector(state => state.Notifications.NotificationsCart) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const previousDataRef = useRef([]);
    const previousDataRefNotif = useRef([]);

    useEffect(() => {
        if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
            navigate("/dashboard/properties"); // Redirige par défaut vers `/dashboard/properties`
        }

        // Fonction qui compare les données actuelles avec les précédentes
        const handleDataChange = (snapshot) => {
            const newData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Compare les nouvelles données avec les précédentes
            const hasNewData = newData.length !== previousDataRef.current.length ||
                newData.some((item, index) => item.id !== previousDataRef.current[index]?.id);

            if (hasNewData) {
                // Si les données sont différentes, mettez à jour l'état
                console.log(newData);

                dispatch(setAlerts(newData));
                setData(newData);

                previousDataRef.current = newData;  // Mettez à jour la variable pour la prochaine comparaison
            }
        };


        // Récupération en temps réel des données Firestore
        const unsubscribe = onSnapshot(collection(db, "alertes"), handleDataChange);

        // Nettoyage lors du démontage
        return () => unsubscribe();
    }, []);  // L'effet se lance une seule fois au montage du composant

    useEffect(() => {
        // Écoute en temps réel des notifications Firestore

        const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
            const newDataNotification = snapshot.docs.map(doc => ({
                id: doc.id,  // L'ID Firebase du document
                ...doc.data(),
            }));


            const newNotifications = newDataNotification.filter(notification =>
                !notifications.find(existing => existing.id === notification.id)
            );


            dispatch(setAlertsNotif(newNotifications));

        });


        // Nettoyage lors du démontage
        return () => unsubscribe();
    }, [dispatch]); // Ajoutez `dispatch` comme dépendance

    const hasUnreadNotifications = useMemo(() => {
        return notifications.some(notification => !notification.isRead);
    }, [notifications]);




    const onClickHandlerNotif = () => {
        handleNotificationClick(dispatch);
        setDrawerOpen((drawerOpen) => !drawerOpen); // Toggle le drawer
    };

    const deleteNotification = (notificationId) => {
        handleDeleteNotification(notificationId, dispatch);
    };

    

    const handleLogout = () => {
        LogOut(auth,navigate)
    };

    return (
        <div className="container-fluid mt-4 p-4">
            <div className="row">
                {/* Sidebar */}
                <div className="col-12 col-md-3 p-3 d-none d-md-block" style={{ minHeight: '100vh', borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#0062a3", color: "white" }}>
                    <ul className="list-unstyled d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                        {tabList.map((tab, index) => (
                            <Link to={tab.route} key={index} className={`mb-4 p-3 ${styles.menuItem} ${showComponents === index && styles.active}`}
                                onClick={() => setShowComponents(index)}
                            >
                                {tab.icon} {tab.name}
                            </Link>
                        ))}
                        <li className={`mb-4 p-3 ${styles.menuItem}`} onClick={onClickHandlerNotif}>
                            {hasUnreadNotifications ?
                                <NotificationsActiveIcon style={{ marginRight: '8px', color: "red" }} />
                                : <Badge badgeContent={notifications.length} color="primary" anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}>
                                    <NotificationsIcon style={{ marginRight: '8px' }} />

                                </Badge>
                            }

                            Notifications
                        </li>
                        {/* Bouton de déconnexion */}
                        <div onClick={handleLogout} className="mt-auto p-3" style={{
                            color: "white",
                            textDecoration: "none",
                            cursor: "pointer",  // Pour indiquer que c'est cliquable
                            backgroundColor: "#004b87",  // Pour mettre en valeur le bouton
                            borderRadius: "8px",  // Pour arrondir les bords
                            transition: "background-color 0.3s"  // Effet au survol
                        }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#003366"}  // Changement de couleur au survol
                            onMouseOut={(e) => e.target.style.backgroundColor = "#004b87"}  // Restauration de la couleur initiale
                        >
                            <LogoutIcon style={{ marginRight: '8px' }} /> Déconnexion
                        </div>
                    </ul>
                    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                        <p className="text-center pt-2 pb-2 fs-5 border">Notifications</p>
                        <NotificationsList
                            notifications={notifications}
                            setDrawerOpen={setDrawerOpen}
                            deleteNotification={deleteNotification}
                        />
                    </Drawer>
                </div>

                {/* Main Content */}
                <div className="col-12 col-md-9 p-4 rounded" style={{ minHeight: '100vh', border: "1px solid rgba(161, 163, 171, 0.63)", backgroundColor: "white" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
