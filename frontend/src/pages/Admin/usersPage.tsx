// src/pages/UsuariosPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin } from 'antd';
import { useAuth } from '@/hooks/auth';

const { Title } = Typography;

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_date: string;
  is_active: boolean;
  phone_num?: string;
  user_type_id: number;
}

const UsuariosPage: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_ROUTE;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchUsers();
  }, [isAuthenticated]);

  const columns = [
    {
      title: 'Nombre',
      key: 'nombre',
      render: (record: User) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Fecha de unión',
      dataIndex: 'registration_date',
      key: 'fecha_union',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      key: 'estado',
      render: (activo: boolean) => (
        <Tag color={activo ? 'red' : 'black'}>
          {activo ? 'ACTIVO' : 'INACTIVO'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-6xl font-medium font-barlow">Usuarios</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-rojo-intec-100 p-4 rounded-2xl shadow">
          <p className="font-barlow text-gray-500 text-sm">Total de usuarios</p>
          <p className="font-barlow text-3xl font-semibold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-rojo-intec-100 p-4 rounded-2xl shadow">
          <p className="font-barlow text-gray-500 text-sm">Usuarios activos</p>
          <p className="font-barlow text-3xl font-semibold text-gray-800">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
      </div>

      <div className="bg-rojo-intec-100 ">
        <Table
          columns={columns}
          dataSource={users.map(user => ({ ...user, key: user.user_id }))}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default UsuariosPage;