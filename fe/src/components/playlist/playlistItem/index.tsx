import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

const PlaylistItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Thumbnail = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #5ee7df, #b490ca);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 20px;
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaylistTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111;
`;

const PlaylistDescription = styled.div`
  font-size: 12px;
  color: #666;
`;
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: #e74c3c;
  }
`;

type Props = {
  name: string;
  description: string;
  songCount: number;
  onClick?: () => void;
  onDelete: () => void;
};

export const MyPlaylistItem = ({
  name,
  description,
  songCount,
  onClick,
  onDelete,
}: Props) => {
  return (
    <PlaylistItem onClick={onClick}>
      <Thumbnail>{name.charAt(0)}</Thumbnail>
      <PlaylistInfo style={{ flex: 1 }}>
        <PlaylistTitle>{name}</PlaylistTitle>
        <PlaylistDescription>
          {description} • {songCount} bài hát
        </PlaylistDescription>
      </PlaylistInfo>
      <DeleteButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Xoá playlist"
      >
        <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
      </DeleteButton>
    </PlaylistItem>
  );
};
