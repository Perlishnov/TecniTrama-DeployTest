// src/pages/ProyectosPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin } from 'antd';
import { useAuth } from '@/hooks/auth';

interface Project {
  project_id: string;
  title: string;
  creator_id: string;
  created_at: string;
  is_active: boolean;
  // Agrega más campos según la API
}
interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}


const ProyectosPage: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_ROUTE;
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Obtener proyectos
        const projectsResponse = await fetch(`${API_BASE_URL}projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!projectsResponse.ok) throw new Error('Error al obtener proyectos');
        const projectsData = await projectsResponse.json();

        // 2. Obtener IDs únicos de creadores
        const creatorIds = [...new Set(projectsData.map((p: Project) => p.creator_id))];

        // 3. Obtener información de usuarios
        const usersResponse = await Promise.all(
          creatorIds.map(id => 
            fetch(`${API_BASE_URL}users/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            })
          )
        );

        const usersData = await Promise.all(
          usersResponse.map(res => res.json())
        );

        // 4. Crear mapa de usuarios
        const usersMap = usersData.reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {} as Record<string, User>);

        setProjects(projectsData);
        setUsers(usersMap);

      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const columns = [
    {
      title: 'Nombre del Proyecto',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Creador',
      dataIndex: 'creator_id',
      key: 'creator',
      render: (creatorId: string) => (
        users[creatorId] ? 
          `${users[creatorId].first_name} ${users[creatorId].last_name}` : 
          'Cargando...'
      ),
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'red' : 'black'}>
          {isActive ? 'ACTIVO' : 'COMPLETADO'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-6xl font-medium font-barlow">Proyectos</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-rojo-intec-100 p-4 rounded-2xl shadow">
          <p className="font-barlow text-gray-500 text-sm">Total de proyectos creados</p>
          <p className="font-barlow text-3xl font-semibold text-gray-800">{projects.length}</p>
        </div>
        <div className="bg-rojo-intec-100 p-4 rounded-2xl shadow">
          <p className="font-barlow text-gray-500 text-sm">Proyectos activos</p>
          <p className="font-barlow text-3xl font-semibold">
            {projects.filter(project => project.is_active).length}
          </p>
        </div>
      </div>

      <div className="bg-rojo-intec-100">
        <Table
          columns={columns}
          dataSource={projects.map(p => ({ ...p, key: p.project_id }))}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default ProyectosPage;