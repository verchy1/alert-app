import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../data/firebaseConfig"; // Importez Firestore configuré

const TaskStatut = () => {
  const [data, setData] = useState([]);

  const groupDataByPeriod = (alerts) => {
    const groupedData = {};

    alerts.forEach((alert) => {
      const dateStr = alert.date ? alert.date.split(" - ")[0] : null;
      if (!dateStr) {
        console.warn("Invalid date string:", alert.date);
        return;
      }

      // Normalisation du format de la date
      const [day, month, year] = dateStr.split("/");
      if (!day || !month || !year) {
        console.warn("Invalid date format:", dateStr);
        return;
      }

      const date = new Date(`${year}-${month}-${day}`);
      if (isNaN(date.getTime())) {
        console.warn("Cannot parse date:", dateStr);
        return;
      }

      const period = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!groupedData[period]) {
        groupedData[period] = 0;
      }
      groupedData[period]++;
    });

    return Object.entries(groupedData).map(([key, value]) => ({
      name: key,
      alerts: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Accéder à la collection "alertes" dans Firestore
        const querySnapshot = await getDocs(collection(db, "alertes"));
        const rawData = querySnapshot.docs.map((doc) => doc.data());

        const chartData = groupDataByPeriod(rawData);
        setData(chartData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <LineChart
      width={400}
      height={150}
      data={data} // On utilise ici les données issues de Firestore
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="alerts" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

export default TaskStatut;
