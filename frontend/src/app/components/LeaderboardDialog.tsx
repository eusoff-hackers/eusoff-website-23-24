import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export interface bidderInfo {
    user: {
        username: string;
        role: string;
        year: number;
        gender: string;
        room: string;
    },
    info: {
        isEligible: boolean;
        points: number;
    }
  }

export interface lbProps{
    data: bidderInfo[],
}

const LeaderboardDialog:React.FC<lbProps>  = ({data}) =>  {

  const [open, setOpen] = useState(false);

console.log(data)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        Show Leaderboard
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="leaderboard-dialog-title">
        <DialogTitle id="leaderboard-dialog-title">Leaderboard</DialogTitle>
        <DialogContent>
            <TableContainer component={Paper} style={{ maxHeight: 500, overflow: 'auto' }}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Points</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                        key={row.user.room}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell>{row.user.room}</TableCell>
                        <TableCell align="right">{row.info.points}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LeaderboardDialog;
