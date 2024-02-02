"use client"

import Image from "next/image"; 
import { CircularProgress } from '@mui/material';
import {useEffect, useState} from "react";
import styles from './ihg.module.css'
import eusoffLogo from "public/eusoff-logo.png";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export interface Match {
    red: {_id:string, name: string},
    blue:  {_id:string, name: string},
    sport:  {name: string, isCarnival: boolean},
    timestamp: number,
    venue: string,
}

export interface Point {
    hall: {id:string,name:string},
    points:number,
    golds:number,
    silvers:number,
    bronzes:number,
}

const sortMatchesByTimestamp = (matches: Match[]): Match[] => {
    // Use the Array.sort method to sort the matches based on timestamp
    return matches.sort((a, b) => a.timestamp - b.timestamp);
}

const sortPoints = (points: Point[]): Point[] => {
      // Use the Array.sort method to sort the matches based on points
  return points.sort((a,b) => b.points - a.points)
}

function getCapitalLetters(word: string): string {
  return word.match(/[A-Z]/g)?.join('');
}


const STORAGE_KEY = 'keyisnotihgbuteusofftothefore';
const axios = require('axios');


const Leaderboard: React.FC = () => {

    const [loading,setLoading] = useState(true);
    const [matches,setMatches] = useState<Match []>([]);
    const [points,setPoints] = useState<Point []>([]);
    /* 
    const [matches, setMatches] = useState<Match[]>(
      JSON.parse(localStorage.getItem(`${STORAGE_KEY}_matches`) || '[]')
    );
    const [points, setPoints] = useState<Point[]>(
      JSON.parse(localStorage.getItem(`${STORAGE_KEY}_points`) || '[]')
    );
    const [lastFetchTime, setLastFetchTime] = useState<number>(
      parseInt(localStorage.getItem('lastFetchTime') || '0')
    );*/

    let heading='';
/*
    useEffect(() => {
      const fetchData = async () => {
        try {
          const matchesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ihg/matches`
          );
  
          if (matchesResponse.data.success) {
            const sortedMatches = sortMatchesByTimestamp(matchesResponse.data.data);
            setMatches(sortedMatches);
            localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(sortedMatches));
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
  
        try {
          const pointsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ihg/points`
          );
  
          if (pointsResponse.data.success) {
            setPoints(pointsResponse.data.data);
            localStorage.setItem(`${STORAGE_KEY}_points`, JSON.stringify(pointsResponse.data.data));
          }
        } catch (error) {
          console.error('Error fetching points:', error);
        }
  
        // Update the last fetch time
        setLastFetchTime(Date.now());
        localStorage.setItem('lastFetchTime', Date.now().toString());
        setLoading(false);
      };
  
      // Fetch data only if more than 5 minutes have passed since the last fetch
      if ((points==[] || matches==[]) || (Date.now() - lastFetchTime > 5 * 60 * 1000)) {
        fetchData();
      } else {
        setLoading(false); // No need to fetch, set loading to false
      }
    }, [lastFetchTime]); // Only re-run the effect if lastFetchTime changes

    const getLastFourLatestElements = (list) => {
      if (!Array.isArray(list)) {
        throw new Error('Input is not an array');
      }
    
      const currentTime = new Date().getTime();

      // Filter the values based on the current time
      const nextValues = list.filter(value => {
      const valueTime = new Date(value.timestamp).getTime();
        return valueTime > currentTime;
      });

      // Return the next 4 values or fewer if there are not enough remaining values
      return nextValues.slice(0, 4);
    }*/

    useEffect(() => {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ihg/matches`)
      .then((response:any)=>{
      if(response.data.success){
          setLoading(!response.data.success)
          setMatches(sortMatchesByTimestamp(response.data.data))
          }
      })
      .catch()

      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ihg/points`)
      .then((response:any)=>{
      if(response.data.success){
          setLoading(!response.data.success)
          setPoints(sortPoints(response.data.data))
          }
      })
      .catch()
  }, [])  

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

    const generateTable = (pointsArray: Point[]) => {
            return(
                <TableContainer sx={{ width: '95%', height: '90%', mx: 'auto', display:'flex', my:'3%'}}  component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">Hall Name</StyledTableCell>
                      <StyledTableCell >Gold</StyledTableCell>
                      <StyledTableCell >Silver</StyledTableCell>
                      <StyledTableCell >Bronze</StyledTableCell>
                      <StyledTableCell align="right" >Points</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pointsArray.map((row) => (
                      <StyledTableRow key={row.hall.id}>
                        <StyledTableCell align="left" component="th" scope="row">
                          {row.hall.name}
                        </StyledTableCell>
                        <StyledTableCell >{row.golds}</StyledTableCell>
                        <StyledTableCell >{row.silvers}</StyledTableCell>
                        <StyledTableCell >{row.bronzes}</StyledTableCell>
                        <StyledTableCell align="right">{row.points}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
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
                {generateTable(points)}
            </div>
            <div className={styles.matches}>
                <h1> Upcoming Matches </h1>
                {matches!=null && matches.map((match,index)=> {
                
                const formattedDate = getDate(match.timestamp)
                const time = getTime(match.timestamp)

                return(
                    <>
                    {(heading !== formattedDate) && <h2 className={styles.date}>{formattedDate}</h2>}
                    <div className={styles.matchContainer} key={index}>
                        <div className={styles.hallvs}>
                            <div  className={styles.logoContainer}>
                              <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.red.name.replace(/\s+/g, '')}.png`}/>
                              <span className={styles.hallNameSmall}> {getCapitalLetters(match.red.name.replace(/\s+/g, ''))} </span>
                            </div>
                            <span className={styles.versus}>VS</span>
                            <div className={styles.logoContainer}>
                              <Image className={styles.hallLogo} alt="hall logo" width={100} height={100} src={`/${match.blue.name.replace(/\s+/g, '')}.png`}/>
                              <span className={styles.hallNameSmall}> {getCapitalLetters(match.blue.name.replace(/\s+/g, ''))} </span>
                            </div>
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
