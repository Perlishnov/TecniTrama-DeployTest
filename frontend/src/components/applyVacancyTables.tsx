// src/components/VacanciesTable.tsx
import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Vacancy } from '@/types';

export interface ApplyVacanciesTableProps {
  vacancies: Vacancy[];
  isOwner: boolean;
  onApply?: (vacancy: Vacancy) => void;
}

const ApplyVacanciesTable: React.FC<ApplyVacanciesTableProps> = ({
  vacancies,
  isOwner,
  onApply
}) => {
  const columns: ColumnsType<Vacancy> = [
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo'
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion'
    },
    {
      title: 'Requerimientos',
      dataIndex: 'requerimientos',
      key: 'requerimientos'
    },
    {
      title: 'Departamento',
      dataIndex: 'departamento',
      key: 'departamento'
    }
  ];

  if (!isOwner) {
    columns.push({
      title: 'Solicitud',
      key: 'solicitud',
      render: (_text, record) => (
        <Button type="primary" onClick={() => onApply?.(record)}>
          Aplicar
        </Button>
      )
    });
  }

  return (
    <Table
      dataSource={vacancies}
      columns={columns}
      rowKey="id"
      pagination={false}
      bordered
      size="middle"
    />
  );
};

export default ApplyVacanciesTable;
