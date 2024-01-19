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
  colors,
} from "@mui/material";
import React, { useState } from "react";
import { boxStyle } from "./FormModal";

interface CommiteeModalProps {
  commitees: string[];
  isOpen: boolean;
  handleClose: () => void;
  selectedCommittees: string[];
  setSelectedCommittees: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCca: React.Dispatch<React.SetStateAction<CcaData>>;
  selectedCca: CcaData;
}

const CommiteeModal: React.FC<CommiteeModalProps> = ({
  commitees,
  isOpen,
  handleClose,
  selectedCommittees,
  setSelectedCommittees,
  setSelectedCca,
  selectedCca,
}) => {
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e);
    if (e.target.checked) {
      const selected = e.target.value;
      console.log(selectedCommittees.indexOf(selected));
      console.log(selectedCommittees);
      if (selectedCommittees.indexOf(selected) == -1) {
        setSelectedCommittees((selectedCommittees) => [
          ...selectedCommittees,
          e.target.value,
        ]);
      }
    } else {
      setSelectedCommittees(
        selectedCommittees.filter((ele: string) => {
          return ele !== e.target.value;
        })
      );
    }
  };
  const handleSubmit = () => {
    setSelectedCca({
      ...selectedCca,
      committees: selectedCommittees,
    });
    // console.log(selectedCca);
    // const temp = selectedCca;
    // console.log(temp);
    // temp.committees = selectedCommittees;
    // console.log(commitees);
    // setSelectedCca(temp);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      // onClose={() => {
      //   handleClose();
      // }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <FormGroup>
          {commitees &&
            commitees.map((comm) => {
              console.log(comm);
              return (
                <FormControlLabel
                  control={<Checkbox value={comm} onChange={handleCheck} />}
                  label={comm}
                  sx={{ color: "black" }}
                />
              );
            })}
        </FormGroup>
        <Button variant="outlined" onClick={handleSubmit}>
          Done
        </Button>
      </Box>
    </Modal>
  );
};

export default CommiteeModal;
