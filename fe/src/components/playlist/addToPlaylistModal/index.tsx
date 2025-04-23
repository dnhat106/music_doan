// Import các component và hook cần dùng
import { Modal, List, Checkbox, notification, Spin } from "antd"; // Ant Design components
import { useAddSongToPlaylist } from "../../../hook/playlist/useAddSongToPlaylist"; // Hook custom để thêm/xóa bài hát vào playlist
import { useAllMyPlaylists } from "../../../hook/playlist/useAllMyPlaylist"; // Hook custom để lấy tất cả playlist của user
import { useQueryClient } from "@tanstack/react-query"; // Hook để invalidate query khi có dữ liệu mới
import { useEffect, useState } from "react"; // React core hook

// Định nghĩa kiểu props cho component
interface AddToPlaylistModalProps {
  open: boolean;         // Modal mở hay đóng
  onClose: () => void;   // Hàm đóng modal
  songId: string;        // ID bài hát muốn thêm vào playlist
}

// Component modal để thêm bài hát vào playlist
export const AddToPlaylistModal = ({
  open,       // props: modal mở hay đóng
  onClose,    // props: hàm đóng modal
  songId,     // props: id bài hát đang thao tác
}: AddToPlaylistModalProps) => {
  
  // Khởi tạo queryClient để invalidate query khi có sự thay đổi
  const queryClient = useQueryClient();

  // Gọi hook lấy tất cả playlist của user
  const { data: playlists, isLoading } = useAllMyPlaylists();

  // Gọi hook thêm/xóa bài hát khỏi playlist
  const { mutate: toggleAddToPlaylist } = useAddSongToPlaylist();

  // State lưu trữ các playlist mà bài hát hiện đang có trong đó
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // useEffect để cập nhật checkbox được tick sẵn mỗi khi mở modal
  useEffect(() => {
    if (playlists && open) {
      // Lọc ra các playlist mà đã chứa bài hát này
      const selected = playlists
        .filter((p) => p.songs?.some((s) => s._id === songId)) // nếu playlist có bài hát đang xét
        .map((p) => p._id); // lấy id của các playlist đó
      // Cập nhật state checkbox
      setSelectedIds(selected);
    }
  }, [playlists, songId, open]); // Chạy lại khi playlists, songId hoặc open thay đổi

  // Hàm xử lý khi người dùng tick/untick playlist
  const handleToggle = (playlistId: string) => {
    // Gọi mutate thêm/xóa bài hát vào playlist
    toggleAddToPlaylist(
      { playlistId, songId }, // Dữ liệu gửi đi
      {
        onSuccess: () => {
          const isAlreadyIn = selectedIds.includes(playlistId); // Kiểm tra bài đã nằm trong playlist chưa
          
          // Hiện thông báo thành công
          notification.success({
            message: isAlreadyIn
              ? "Removed from playlist" // Nếu đã có thì là xóa
              : "Added to playlist",     // Nếu chưa có thì là thêm
          });

          // Invalidate query để load lại dữ liệu playlists
          queryClient.invalidateQueries({ queryKey: ["playlists"] });

          // Cập nhật state checkbox local
          setSelectedIds((prev) =>
            isAlreadyIn
              ? prev.filter((id) => id !== playlistId) // Nếu đã có thì bỏ ra
              : [...prev, playlistId] // Nếu chưa có thì thêm vào
          );
        },
        onError: () => {
          // Hiện thông báo lỗi nếu có
          notification.error({ message: "Something went wrong" });
        },
      }
    );
  };

  // Render giao diện Modal
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Add to Playlist">
      {/* Nếu đang loading playlists thì hiển thị loading spinner */}
      {isLoading ? (
        <Spin />
      ) : (
        // Hiển thị danh sách playlists dưới dạng List
        <List
          dataSource={playlists} // dữ liệu là các playlists
          renderItem={(playlist) => (
            // Render từng item playlist
            <List.Item
              actions={[
                // Checkbox để chọn/deselect playlist
                <Checkbox
                  key={playlist._id}
                  checked={selectedIds.includes(playlist._id)} // Nếu id có trong selectedIds thì tích
                  onChange={() => handleToggle(playlist._id)} // Khi click thì gọi handleToggle
                />,
              ]}
            >
              {/* Tên playlist */}
              {playlist.name}
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};
