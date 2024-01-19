import { Modal, Box } from "@mui/material";
import { CommiteeModalProps } from "./CommiteeModal";

export const CommiteeModal: React.FC<CommiteeModalProps> = ({
  commitees,
  isOpen,
  handleClose,
  setSelected,
}) => {
  const [choices, setChoices] = useState<string>();
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box></Box>
    </Modal>
  );
};
