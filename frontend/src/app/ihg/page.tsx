"use client"

import Image from "next/image"; 
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import styles from './ihg.module.css'
import eusoffLogo from "public/eusoff-logo.png";
export default function Leaderboard() {

    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setTimeout(()=>{
            // simple preloader
            // try to fetch all data here and then share it everywhere else
            //  axios
      //.get("")
      //.then((response) => {
      //      setData((data: any) => [...data, req.data])
     // })
            setLoading(false)
        },1000)
    },[])

  return loading ? (
    <div className={styles.loadingContainer}>
        <p>LOADING </p> 
        <CircularProgress /> 
    </div>

  ) : (
       
    <div className={styles.container}>
        <div className={styles.header}> 
            <div className={styles.left}>
                <Image className={styles.eusoff} alt="eusoffLogo" src={eusoffLogo} />
                <div className={styles.text}>
                    <h1>Eusoff Hall</h1>
                    <h5>Excellence and Glory</h5>
                </div>
            </div>
            <div className={styles.right}>
                <h1> Inter Hall Games-23/24</h1>
            </div>
        </div>
        <div className={styles.content}>
            <div className={styles.leaderboard}>
                <h1> Leaderboard</h1>
            </div>
            <div className={styles.matches}>
                                <h1> Matches</h1>

            </div>
        </div>
    </div>

  )
}
