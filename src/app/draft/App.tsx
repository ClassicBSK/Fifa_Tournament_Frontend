"use client"
import { Button, Card,Divider,Overlay,Table, Text, Loader, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react"
import Header from "../tournaments/Header";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import {Pinyon_Script, Press_Start_2P, Syne_Mono} from "next/font/google"
const pinyon = Pinyon_Script({
    weight: "400",
    subsets: ["latin"],
});
const press  = Press_Start_2P ({
    weight: "400",
    subsets: ["latin"],
});
const syne  = Syne_Mono ({
    weight: "400",
    subsets: ["latin"],
});


export default function App(props){
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const axios=require("axios");
    const [Teams,setTeams]=useState([]);
    const [PlayersPicked,setPlayersPicked]=useState([0])
    const [Picking,setPicking]=useState(false)
    const [CurrRound,setCurrRound]=useState(0)
    const [Rounds,setRounds]=useState(0)
    const [CurrData,setCurrData]=useState({})
    const [Loaded,setLoaded]=useState(true)
    const showRoundResult = async (results) => {
        for (let i = 0; i < results.length; i++) {
        
            setCurrData({'A':5})
            if(i!=0){
                await sleep(2400);
            }
            setCurrData(results[i]);
            await sleep(4500);
             // Show each item after i * 5s
        }
        setCurrData({})
        await sleep(500);    
        tournamentFetch();
        
        
    };
    const tournamentFetch=async()=>{
        setLoaded(false);
        const response=await axios({
            method:"GET",
            url:`${process.env.NEXT_PUBLIC_BACKEND_URI}tournament/${props.tournamentId}/teams`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
            }}).then((response)=>{
                // console.log(response.data);
                
                setTeams(response.data); 
                
                return "yes";
                // console.log(Teams)                 
            }).catch((error)=>{
                if(error.response.status==401){
                    location.href="/login"
                }
                setLoaded(true);
                console.error(error)
            }
        )
        
        const response2=await axios({
            method:"GET",
            url:`${process.env.NEXT_PUBLIC_BACKEND_URI}tournament/${props.tournamentId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
            }}).then((response)=>{
                // console.log(response.data.rounds);
                setRounds(response.data.rounds)
                setCurrRound(response.data['teams'][0]['players'].length+1)
                setLoaded(true);
            }).catch((error)=>{
                if(error.response.status==401){
                    location.href="/login"
                }
                console.error(error)
                setLoaded(true);
            }
        )
        
        // console.log(PlayersPicked); 
    }
    useEffect(() => {
        if (Teams.length > 0) {
            var ids=[0]
             for(var i in Teams){
                // console.log(Teams[i].players[0].player)
                for(var j in Teams[i].players){
                    var playerId=Teams[i].players[j].playerId;
                    // console.log(playerId)
                    ids.push(playerId)
                }
            }
            setPlayersPicked(ids)
        }
    }, [Teams]);
    
    useEffect(()=>{
        
        tournamentFetch();
        // for(var i in Teams){
        //     var curr=Teams[i].players;
        //     for(var j in curr){
        //         var lise=[...PlayersPicked]
        //         lise.push(curr[j]['playerId'])
        //         setPlayersPicked(lise);
        //     }
        // }    
    },[])
    const positions=['st','lw','lf','cf','rf','rw','cam','lm','cm','rm','lwb','cdm','rwb','lb','cb','rb','gk']
    const roundActivate=async()=>{
        setPicking(true)
        var roundResult=[]
        var playersChosen=[...PlayersPicked]
        for(var i in Teams){
            
            var positionsList=[];
            for(var j in positions){
                if(Teams[i][positions[j]]!=0){
                    positionsList.push(positions[j]);
                }
            }
            const pos=positionsList[Math.floor(Math.random()*positionsList.length)];
            // console.log(PlayersPicked)
            const player=await axios({
                method:"POST",
                url:`${process.env.NEXT_PUBLIC_BACKEND_URI}player/position/${pos}`,
                data:playersChosen,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                }
            }).then((response)=>{
                    // console.log(playersChosen)
                    // console.log(response.data);
                    // console.log(playersChosen)
                    return response.data;                
                }).catch((error)=>{
                    // console.log(PlayersPicked)
                    console.error(error.data)
                }
            )
            // console.log(player)
            roundResult.push({
                "teamId":Teams[i]['teamId'],
                "playerId":player['playerId'],
                "position":pos,
                "overall":player[`${pos}rating`],
                "teamName":Teams[i]['teamName'],
                "name":player['name']

            })
            playersChosen.push(player['playerId'])
        }
        for(var i in roundResult){
            
            const rounds=await axios({
                method:"POST",
                url:`${process.env.NEXT_PUBLIC_BACKEND_URI}team/${roundResult[i]['teamId']}/players`,
                data:{
                    "playerId":roundResult[i]['playerId'],
                    "position":roundResult[i]['position']
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                }
            }).then((response)=>{
                    // console.log(PlayersPicked)
                    // console.log(response.data);
                    return response;                
                }).catch((error)=>{
                    // console.log(PlayersPicked)
                    console.error(error.data)
                }
            )
        }
        setPicking(false)
        showRoundResult(roundResult)
        
        // console.log(roundResult)
    }
    
    
    return(
        <div>
            <Header/>
            {Loaded&&
            <div>
                
                {!Picking&&<div>
                    <div className="flex justify-center gap-5 pt-[1.5%]">
                        
                            <div className="rounded-full border border-4 w-40 border-[#C83E4D] aspect-square flex place-content-center" id="Player position">
                                <AnimatePresence>
                                {CurrData.hasOwnProperty('position')&&
                                    <motion.div
                                    key={CurrData['name']}
                                    initial={{
                                        opacity:0
                                    }}
                                    animate={{
                                        opacity:1
                                    }}
                                    exit={{
                                        opacity:0
                                    }}
                                    transition={{
                                        ease:"easeInOut",
                                        duration:0.5
                                    }} className="flex items-center justify-center">
                                        <Text c="#044389" tt="uppercase" size={80} className={`${syne.className} flex justify-center`}>{CurrData['position']}</Text>
                                    </motion.div>
                                    
                                }
                                </AnimatePresence>
                            </div>
                        <div className="rounded-full border border-4 w-40 aspect-square border-[#C83E4D] flex place-content-center
                        " id="Player rating">
                            <AnimatePresence mode="wait">
                            {CurrData.hasOwnProperty('overall')&&
                            
                            <motion.div 
                            key={CurrData['playerId']}
                            initial={{
                                opacity:0
                            }}
                            animate={{
                                opacity:1
                            }}
                            exit={{
                                opacity:0
                            }}
                            transition={{
                                ease:"easeInOut",
                                duration:1.6
                            }}
                            className="flex items-center">
                                <Text c="#044389" tt="uppercase" size={80} className={`${syne.className} flex justify-center`}>{CurrData['overall']}</Text>
                            </motion.div>
                            
                                
                            }
                            </AnimatePresence>
                        </div>

                    </div>
                    <div>
                        <AnimatePresence mode="wait">
                        {CurrData.hasOwnProperty('name')&&
                    
                            <motion.div
                            key={CurrData['teamName']}
                            initial={{
                                opacity:0
                            }}
                            animate={{
                                opacity:1
                            }}
                            exit={{
                                opacity:0
                            }}
                            transition={{
                                ease:"easeInOut",
                                duration:2.4
                            }} className="flex justify-center">
                                <Text
                                    styles={{root:{"fontSize":50}}} 
                                    className={pinyon.className}>{CurrData['name']} drafted to {CurrData['teamName']}</Text>
                            </motion.div>
                            
                        }
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-center py-4">
                        {CurrRound<=Rounds&&
                        <Button  onClick={roundActivate}>Pick Players for round {CurrRound}</Button>
                        }
                        {CurrRound>Rounds&&
                        <Button disabled onClick={roundActivate}>Rounds completed</Button>
                        }
                    </div>
                </div>}
                {(Picking)&&
                    <motion.div initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='flex py-[100px] items-center justify-center'>
                        <Loader color="#006992" />
                    </motion.div>
                }
                
                
                <motion.div initial={{
                    x:"-100%",
                    opacity:0
                }}
                animate={{
                    x:"0%",
                    opacity:1
                }}
                transition={{
                    ease:"easeInOut",
                    duration:0.8
                }}
                className="flex flex-cols flex-wrap justify-center gap-2">
                    {Teams.map((team,ind)=>{
                        return(
                        
                            <div key={ind} className="w-[300px]">
                                <Card  shadow='sm' padding='lg' >
                                    
                                    <Card.Section>
                                        
                                        <Text fw={600} className="flex justify-center pt-[5%]">{team['teamName']}</Text>
                                        <Divider my="sm"  label={<p className="text-black">Players list</p>} color="black" labelPosition="center"  />
                                        <ScrollArea h={500}>
                                            
                                            
                                            <Table stickyHeader withTableBorder withColumnBorders striped highlightOnHover>
                                                <colgroup>
                                                    <col></col>
                                                    <col className='w-[80%]'></col>
                                                </colgroup>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>
                                                            <div className='flex justify-center'>
                                                                Round
                                                            </div>
                                                        </Table.Th>
                                                        <Table.Th className='flex justify-center'>Player name</Table.Th>
                                                        <Table.Th>Overall</Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                    {team.players.map((player,ind2)=>{
                                                        return(
                                                            <Table.Tr key={ind2}>
                                                                <Table.Td>
                                                                    <div className="flex justify-center">
                                                                        {ind2+1}
                                                                    </div>
                                                                </Table.Td>
                                                                <Table.Td>
                                                                    <div className="flex justify-center">
                                                                        {player.name}
                                                                    </div>
                                                                </Table.Td>
                                                                <Table.Td>
                                                                    <div className="flex justify-center">
                                                                        {player.overall}
                                                                    </div>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        )
                                                    })}
                                                </Table.Tbody>
                                            </Table>
                                        </ScrollArea>
                                    </Card.Section>
                                    
                                    <Overlay
                                        style={{ pointerEvents: 'none' }}
                                        gradient="linear-gradient(180deg, rgba(0, 105, 146, 0.19) 0%, rgba(255, 255, 255, 0) 120%)"
                                        opacity={0.85}
                                    />
                                </Card>
                                
                            </div>
                        )
                    })}
                </motion.div>
                
                
            </div>}
            {(!Loaded)&&
                <motion.div initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='h-screen flex items-center justify-center'>
                    <Loader color="#006992" size={40} />
                </motion.div>
            }
        

        </div>
    ) 
}