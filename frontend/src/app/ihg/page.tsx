"use client"

import Image from "next/image"; 
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import styles from './ihg.module.css'
import eusoffLogo from "public/eusoff-logo.png";

export interface Match {
    red: {_id:string, name: string},
    blue:  {_id:string, name: string},
    sport:  {name: string, isCarnival: boolean},
    timestamp: number,
    venue: string,
}

const sortMatchesByTimestamp = (matches: Match[]): Match[] => {
    // Use the Array.sort method to sort the matches based on timestamp
    return matches.sort((a, b) => a.timestamp - b.timestamp);
}

const Leaderboard: React.FC = () => {

    const [loading,setLoading] = useState(true);
    const [matches,setMatches] = useState<Match []>([]);
    const axios = require('axios'); 

    let heading='';

    useEffect(() => {
        setTimeout( ()=>{
           axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/ihg/matches`)
           .then((response:any)=>{
            if(response.data.success){
                setLoading(!response.data.success)
                setMatches(sortMatchesByTimestamp(response.data.data))
                }
           })
           .catch()
        },100)
    },)    

    const getTime = (timestamp:number) => {
        let time = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(timestamp);

        return time;
    }

    const formatDateToOrdinal = (dateString:string) => {
        const [day, month] = dateString.split('/');
        
        const dayWithOrdinal = addOrdinalSuffix(parseInt(day, 10));
        const monthName = getMonthName(parseInt(month, 10) - 1); // Month is zero-based in JavaScript Date object
    
        return `${dayWithOrdinal} ${monthName}`;
    }
    
    const addOrdinalSuffix = (number:number) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
    
    const getMonthName = (monthIndex:number) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }

    const getDate = (timestamp:number) =>{
        let time = new Intl.DateTimeFormat("en-GB", {
            month: "2-digit",
            day: "2-digit",
        }).format(timestamp);

        return formatDateToOrdinal(time);
    }

    const convertTo12HourFormat = (time24hr: string): string => {
        const [hours, minutes] = time24hr.split(':');
        let period = 'AM';
    
        let hours12 = parseInt(hours, 10);
        if (hours12 >= 12) {
            period = 'PM';
            if (hours12 > 12) {
                hours12 -= 12;
            }
        }
    
        const formattedTime = `${hours12}:${minutes} ${period}`;
        return formattedTime;
    };


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
                {matches!=null && matches.map((match,index)=> {
                
                const formattedDate = getDate(match.timestamp)
                const time = getTime(match.timestamp)

                return(
                    <>
                    {(heading !== formattedDate) && <h2>{formattedDate}</h2>}
                    <div className={styles.matchContainer} key={index}>
                        <div className={styles.hallvs}>
                            <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.red.name.replace(/\s+/g, '')}.png`}/>
                            <span className={styles.versus}>VS</span>
                            <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.blue.name.replace(/\s+/g, '')}.png`}/>
                        </div>
                        <div className={styles.sportName}>
                            <span>{match.sport.name}  {(match.sport.isCarnival)? "- Carnival" :""}</span> 
                            <span> {match.venue} </span>
                        </div>
                        <div className={styles.timing}><span>{convertTo12HourFormat(time)}</span></div>
                    </div>
                    </>)
                })}
            </div>
        </div>
    </div>

  )
}

export default Leaderboard;