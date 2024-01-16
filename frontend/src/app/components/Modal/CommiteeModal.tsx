import { CcaData } from "@/app/cca/page";
import {
  Modal,
  Box,
  TextField,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
interface CommiteeModalProps {
  commitees: string[];
  isOpen: boolean;
  handleClose: () => void;
  setSelected: React.Dispatch<React.SetStateAction<CcaData[]>>;
}

const CommiteeModal: React.FC<CommiteeModalProps> = ({
  commitees,
  isOpen,
  handleClose,
  setSelected,
}) => {
  const [choices, setChoices] = useState<string[]>();

  const handleCheck = (e: React.ChangeEvent) => {};

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <FormGroup>
        {commitees.map((comm) => {
          return (
            <FormControlLabel
              control={<Checkbox onChange={handleCheck} />}
              label={comm}
            />
          );
        })}
      </FormGroup>
    </Modal>
  );
};

export default CommiteeModal;
