import React from "react";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import { Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";

const NotificationsList = ({ notifications, setDrawerOpen, deleteNotification }) => {

  const handleDeleteNotification = (notificationId) => {
    // Supprimer la notification du Firebase ou de l'état Redux
    deleteNotification(notificationId);
  };

  return (
    <Box
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={(e) => e.key === "Tab" && setDrawerOpen(false)}
      p={2}
    >
      {notifications.length === 0 ? (
        <p style={{ padding: "1rem", textAlign: "center", margin: "70px" }}>
          Aucune notification
        </p>
      ) : (
        <TransitionGroup>
          {notifications.map((notification) => (
            <Collapse key={notification.id}>
              <Box
                p={2}
                mb={1}
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  transition: "opacity 0.5s ease-out",
                }}
              >
                <div>
                  <p style={{ margin: 0 }}>{notification.message}</p>
                  <small style={{ color: "#6c757d" }}>
                    {notification.date
                      ? new Date(notification.date).toLocaleString()
                      : new Date().toLocaleString()}
                  </small>
                  <div className="d-flex justify-content-end m-0 p-0">
                    <DeleteIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </Box>
            </Collapse>
          ))}
        </TransitionGroup>
      )}
    </Box>
  );
};

export default NotificationsList;
