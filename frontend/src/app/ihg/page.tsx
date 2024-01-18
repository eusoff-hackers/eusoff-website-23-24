"use client"

import Image from "next/image"; 
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import styles from './ihg.module.css'
import eusoffLogo from "public/eusoff-logo.png";

export interface Match {
    red: {_id:string, name: string},
    blue:  {_id:string, name: string},
    sport:  {name: string, shareable: boolean},
    timestamp: number
}

const Leaderboard: React.FC = () => {

    const [loading,setLoading] = useState(true);
    const [matches,setMatches] = useState<Match []>([]);
    const axios = require('axios'); 


    useEffect(() => {
        setTimeout( ()=>{
           axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/ihg/matches`)
           .then((response:any)=>{
            if(response.data.success){
                setLoading(!response.data.success)
                setMatches(response.data.data)
            }
           })
           .catch()
        },100)
    },)    

    const getTime = (timestamp) => {
        let time = new Intl.DateTimeFormat("en-GB", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(timestamp);

        return time;
    }

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
                <h1> Upcoming Matches </h1>
                {matches!=null && matches.map((match,index)=><div className={styles.matchContainer} key={index}>
                     
                     <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.red.name.replace(/\s+/g, '')}.png`}/>
                     <span className={styles.versus}>VS</span>
                     <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.blue.name.replace(/\s+/g, '')}.png`}/>
                     <div className={styles.sportName}>
                        <span>{match.sport.name}</span> : 
                        <span>{getTime(match.timestamp)}</span>
                     </div>
                </div>)}
            </div>
        </div>
    </div>

  )
}

export default Leaderboard;
 