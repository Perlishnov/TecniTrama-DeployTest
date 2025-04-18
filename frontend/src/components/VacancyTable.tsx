// src/components/VacanciesTable.tsx
import React from "react";
import { Table, Button, Space } from "antd";
import { Vacancy } from "@/types/index";

export interface VacanciesTableProps {
  vacancies: Vacancy[];
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: string) => void;
}

const VacanciesTable: React.FC<VacanciesTableProps> = ({
  vacancies,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Requerimientos",
      dataIndex: "requerimientos",
      key: "requerimientos",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Vacancy) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Editar
          </Button>
          <Button danger type="link" onClick={() => onDelete(record.id.toString())}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<Vacancy>
      rowKey="id"
      dataSource={vacancies}
      columns={columns}
      pagination={false}
      bordered   
      rowClassName={"bg-rojo-intec-200"}
      showHeader={true}
    />
  );
};

export default VacanciesTable;
