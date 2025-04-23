
import React from "react";
import { Table } from "antd";
import Button from "@/components/button";
import { Vacancy } from "@/types";
import { Typography, Tooltip } from "antd";

interface Props {
  vacancies: Vacancy[];
  isOwner: boolean;
  onApply?: (vacancy: Vacancy) => void;
  onInvite?: (vacancy: Vacancy) => void;
}

const { Text } = Typography;

const ApplyVacanciesTable: React.FC<Props> = ({ vacancies, isOwner, onApply, onInvite }) => {
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
      render: (text: string) => text.split(" ").slice(0, 3).join(" ") + "...",
    },
    {
      title: "Requerimientos",
      dataIndex: "requerimientos",
      key: "requerimientos",
      render: (text: string) => text.split(" ").slice(0, 3).join(" ") + "...",
    },
    {
      title: "Estado",
      key: "estado",
      render: (_: any, record: Vacancy) =>
        record.is_filled ? (
          <Tooltip title="Esta vacante ya ha sido ocupada">
            <Text type="success" strong>Ocupado</Text>
          </Tooltip>
        ) : (
          <Button
            onClick={() => {
              if (isOwner) {
                onInvite?.(record);
              } else {
                onApply?.(record);
              }
            }}
          >
            {isOwner ? "Invitar" : "Aplicar"}
          </Button>
        ),
    },    
  ];

  return (
    <Table
      dataSource={vacancies}
      columns={columns}
      rowKey={(record) => record.id.toString()}
      pagination={false}
    />
  );
};

export default ApplyVacanciesTable;