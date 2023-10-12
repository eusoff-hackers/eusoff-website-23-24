"use client";

import React, {useState, useEffect} from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material';

// id 0 : success
// id 1 : error
// id 2 : warning
// id 3 : information

interface ToastProps{
    title: string;
    message: string;
    duration: number;
    id: number;
}

const Toast:React.FC<ToastProps> = ({title,message,duration,id}) => {


  console.log(title)

  const mappings :any = [
     "success",
     "error",
    "warning",
    "info"
  ]

  const [open,setOpen] = useState(true)

 const handleClose = () =>{
    setOpen(false)
 }

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
        <Alert severity={mappings[id]} sx={{ width: '100%' }}>
            <AlertTitle> {title} </AlertTitle>
            {message}
        </Alert>
    </Snackbar>
  )
}

export default Toast