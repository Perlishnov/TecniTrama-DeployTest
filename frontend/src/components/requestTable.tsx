// src/components/RequestTable.tsx
import React from 'react';
import { Table, Button, Modal, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';

export interface Request {
  id: Key;
  applicant: string;
  position: string;
  date: string;
  reasons: string;
}

export interface RequestTableProps {
  requests: Request[];
  onAccept?: (req: Request) => void;
  onDeny?: (req: Request) => void;
}

const { Text } = Typography;

const RequestTable: React.FC<RequestTableProps> = ({ requests, onAccept, onDeny }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(null);

  const showDetails = (req: Request) => {
    setSelectedRequest(req);
    setModalVisible(true);
  };

  const columns: ColumnsType<Request> = [
    { title: 'Solicitante', dataIndex: 'applicant', key: 'applicant' },
    { title: 'Cargo', dataIndex: 'position', key: 'position' },
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_text, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          Ver
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table<Request>
        rowKey="id"
        columns={columns}
        dataSource={requests}
        pagination={false}
        bordered
        size="middle"
      />

      <Modal
        visible={modalVisible}
        title="Detalles de Solicitud"
        onCancel={() => setModalVisible(false)}
        footer={
          selectedRequest && [
            <Button key="deny" danger onClick={() => { onDeny?.(selectedRequest); setModalVisible(false); }}>
              Rechazar
            </Button>,
            <Button key="accept" type="primary" onClick={() => { onAccept?.(selectedRequest); setModalVisible(false); }}>
              Aceptar
            </Button>,
          ]
        }
      >
        {selectedRequest && (
          <div>
            <Text strong>Solicitante: </Text><Text>{selectedRequest.applicant}</Text><br />
            <Text strong>Cargo: </Text><Text>{selectedRequest.position}</Text><br />
            <Text strong>Razones: </Text><Text>{selectedRequest.reasons}</Text>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RequestTable;
