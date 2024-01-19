import { CcaData, UserCcaData, UserData } from "@/app/cca/page";
import { ToastMessage } from "@/app/dashboard/page";
import { setUser } from "@/app/redux/Resources/userSlice";
import { AlignHorizontalRight } from "@mui/icons-material";
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
  FormControlLabel,
  FormControl,
  Checkbox,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { getuid } from "process";
import { useState } from "react";

export const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PDPA = `Personal Data Protection Act (PDPA Agreement)
I hereby fully consent to Eusoff Hackers using and/or disclosing my personal data for CCA signups. Your information will be shared with CCA leaders so that they may contact you about interviews or other CCA-related matters. By proceeding, you are indicating your consent to provide your personal data in this form to Eusoff Hackers. All personal information will be kept confidential and used for the purposes stated only. Should you wish to withdraw your consent for Eusoff Hall to contact you for the purposes stated above, please notify us in writing to juan.c.vieri@u.nus.edu. We will then remove your personal information from our database. Please allow 3 business days for your request to take effect.`;
interface FormModalProps {
  isOpen: boolean;
  ccas: CcaData[]; //cca to register
  info: UserData; // check user data
  handleClose: () => void;
  setToast: React.Dispatch<React.SetStateAction<ToastMessage>>;
}
const axiosWithCredentials = axios.create({
  withCredentials: true,
});

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  ccas,
  info,
  handleClose,
  setToast,
}) => {
  const [userName, setUserName] = useState<string>(info.name);
  const [userTele, setUserTele] = useState<string>(info.telegram);
  const [userEmail, setUserEmail] = useState<string>(info.email);
  const [pdpaCheck, setPdpaCheck] = useState<boolean>(false);
  const [pdpaReminder, setPdpaReminder] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      if (!pdpaCheck) {
        setPdpaReminder(true);
      }
      const payload = {
        info: {
          name: userName,
          telegram: userTele,
          email: userEmail,
        },
        ccas,
      };
      console.log(payload);
      const res = await axiosWithCredentials.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cca/signup`,
        payload
      );
      console.log(res);
      if (res.status == 200) {
        console.log("Successfully registered");
        setToast({ message: "Cca submitted", severity: "success" });
      } else {
        console.error("Registration failed", res);
        setToast({ message: "Cca failed to be registered", severity: "error" });
      }
    } catch (error) {
      console.error("Error during form submission", error);
    }
    handleClose();
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>CCA Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ccas.map((cca) => (
                  <TableRow
                    key={cca._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {cca.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              padding: "5px",
              paddingTop: "10px",
            }}
          >
            <TextField
              id="nameField"
              label="Name"
              variant="standard"
              defaultValue={info.name}
              onBlur={(ele) => setUserName(ele.target.value)}
            />
            <TextField
              id="telegramField"
              label="telegram"
              variant="standard"
              defaultValue={info.telegram}
              onBlur={(ele) => setUserTele(ele.target.value)}
            />
            <TextField
              id="emailField"
              label="email"
              variant="standard"
              defaultValue={info.email}
              onBlur={(ele) => setUserEmail(ele.target.value)}
            />
          </div>
          <FormControl>
            <FormControlLabel
              required
              control={
                <Checkbox
                  onChange={() => {
                    setPdpaCheck(!pdpaCheck);
                  }}
                />
              }
              label={PDPA}
              sx={{ color: "black" }}
            />
          </FormControl>
          <div style={{ position: "relative", float: "right" }}>
            <Button variant="contained" onClick={(e) => handleSubmit(e)}>
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={pdpaReminder}
        autoHideDuration={6000}
        onClose={() => setPdpaReminder(false)}
        message="Please Check PDPA Clause"
      />
    </div>
  );
};

export default FormModal;
