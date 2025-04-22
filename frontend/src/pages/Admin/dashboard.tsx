// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import StatCard from "@/components/statCard";
import peopleIcon from "@/assets/icons/AdminDashboard/people.svg";
import boxIcon from "@/assets/icons/AdminDashboard/box.svg";
import graphIcon from "@/assets/icons/AdminDashboard/graph.svg";
import clockIcon from "@/assets/icons/AdminDashboard/clock.svg";

interface User {
  user_id: number;
  is_active: boolean;
  first_name: string;
  last_name: string;
  registration_date: string;
}

interface Project {
  project_id: number;
  is_active: boolean;
  creator_id: number;
}

interface Metrics {
  totalUsers: number;
  totalProjects: number;
  activeUsers: number;
  activeProjects: number;
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const Dashboard: React.FC = () => {
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    totalProjects: 0,
    activeUsers: 0,
    activeProjects: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [errorState, setErrorState] = useState({
    hasError: false,
    message: "",
  });

  // 1) Fetch users and projects once:
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // Fetch usuarios
        const usersRes = await fetch(`${apiRoute}users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!usersRes.ok) throw new Error(`Users API Error ${usersRes.status}`);
        const usersData: User[] = await usersRes.json();

        // Fetch proyectos
        const projRes = await fetch(`${apiRoute}projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!projRes.ok) throw new Error(`Projects API Error ${projRes.status}`);
        const projData: Project[] = await projRes.json();

        // Set states
        setUsers(usersData);
        setProjects(projData);

        setMetrics({
          totalUsers: usersData.length,
          totalProjects: projData.length,
          activeUsers: usersData.filter(u => u.is_active).length,
          activeProjects: projData.filter(p => p.is_active).length,
        });
      } catch (err) {
        console.error(err);
        setErrorState({
          hasError: true,
          message: err instanceof Error ? err.message : "Error desconocido",
        });
      }
    };
    fetchData();
  }, [apiRoute]);

  // 2) Generar histórico mensual de conexiones (usuarios registrados por mes)
  const monthlyChartData = useMemo(() => {
    const counts = Array(12).fill(0);
    users.forEach(u => {
      const m = new Date(u.registration_date).getMonth();
      counts[m]++;
    });
    return counts.map((count, i) => ({ month: monthNames[i], users: count }));
  }, [users]);

  // 3) Datos para Scatter: meses desde registro vs proyectos creados
  const engagementData = useMemo(() => {
    const today = new Date();
    return users.map(u => {
      const reg = new Date(u.registration_date);
      const monthsSince = Math.floor(
        (today.getTime() - reg.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );
      const userProjCount = projects.filter(p => p.creator_id === u.user_id).length;
      return {
        monthsSinceJoin: monthsSince,
        projectCount: userProjCount,
        userName: `${u.first_name} ${u.last_name}`,
      };
    });
  }, [users, projects]);

  if (errorState.hasError) {
    return <div className="p-8 text-red-600">Error: {errorState.message}</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h1 className="text-6xl font-medium font-barlow">Dashboard</h1>

      {/* 1) Estadísticas rápidas */}
      <div className="flex gap-6">
        <StatCard label="Usuarios Totales" icon={peopleIcon} value={metrics.totalUsers} />
        <StatCard label="Proyectos Totales" icon={boxIcon} value={metrics.totalProjects} />
        <StatCard label="Usuarios Activos" icon={graphIcon} value={metrics.activeUsers} />
        <StatCard label="Proyectos Activos" icon={clockIcon} value={metrics.activeProjects} />
      </div>

      {/* 2) Gráfico de usuarios por mes */}
      <div className="bg-rojo-intec-100 p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-barlow font-medium mb-4">Usuarios conectados</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#E4002B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3) Gráfico de engagement */}
      <div className="bg-rojo-intec-100 p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-barlow font-medium mb-4">Engagement Usuarios </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="monthsSinceJoin"
              name="Meses registrado"
              unit=" meses"
            />
            <YAxis
              type="number"
              dataKey="projectCount"
              name="Proyectos"
              unit=" proyectos"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const p = payload[0].payload as any;
                  return (
                    <div className="bg-white p-2 border rounded-lg">
                      <p>{p.userName}</p>
                      <p>Meses: {p.monthsSinceJoin} meses</p>
                      <p>Proyectos: {p.projectCount}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter
              name="Engagement"
              data={engagementData}
              fill="#E4002B"
              shape={(props) => (
                <circle
                  {...props}
                  r={Math.sqrt((props.payload as any).projectCount) * 2}
                />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
