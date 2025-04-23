import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
export interface CrewMember {
  id: number;
  name: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  assigned_at: string;
  user_id: number;
}

interface CrewTableProps {
  items?: CrewMember[];
  isCreator?: boolean;
  onDelete?: (ids: Key[]) => void;

}

const CrewTable: React.FC<CrewTableProps> = ({
  items = [],
  isCreator = false,
  onDelete
}) => {
  const [, setSelectedRowKeys] = React.useState<Key[]>([]);

  const handleDelete = (ids: Key[]) => {
    onDelete?.(ids);
    setSelectedRowKeys(prev => prev.filter(key => !ids.includes(key)));
  };

  const columns: ColumnsType<CrewMember> = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Cargo', dataIndex: 'role_name', key: 'role_name' },
    { title: 'Departamento', dataIndex: 'department_name', key: 'department_name' },
  ];

  if (isCreator) {
    columns.push({
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Button danger onClick={() => handleDelete([record.id])}>
          Eliminar
        </Button>
      )
    });
  }


  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        pagination={false}
        bordered
        size="middle"
        style={{ marginBottom: 16 }}
      />
      
    </div>
  );
};

export default CrewTable;
