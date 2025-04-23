import styled from "styled-components";
import { Button, Table } from "antd";
import type { TableProps } from "antd";

export const AdminContainer = styled.div`
  padding: 24px;
  background: transparent;
`;

export const AdminHeader = styled.h1`
  color: black;
  margin-bottom: 24px;
`;

export const TableContainer = styled.div`
  background: transparent !important;
  border-radius: 8px;
  padding: 16px;
  .ant-table-wrapper .ant-table-tbody > tr.ant-table-placeholder:hover > td,
  .ant-table-wrapper .ant-table-tbody > tr.ant-table-placeholder {
    background-color: transparent !important;
  }
`;

export const ActionButton = styled(Button)`
  margin-bottom: 16px;
`;

export const StyledTable = styled(Table)`
  .ant-table {
    background: transparent !important;
  }

  .ant-table-thead > tr > th {
    background: transparent !important;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: rgba(255, 255, 255, 0.3) !important; /* Màu nền khi hover */
    transition: background-color 0.3s ease;
  }

  .ant-pagination-item {
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  .ant-pagination-item a {
    color: black !important;
  }

  .ant-pagination-item-active {
    background: yellow !important;
  }
` as React.FC<TableProps<any>>;
