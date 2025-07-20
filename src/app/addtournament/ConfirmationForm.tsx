import { Badge, Button, Divider, Group, Paper,Table,Text, Title,Loader } from '@mantine/core';
import { motion,AnimatePresence } from "motion/react";
import { useState } from 'react';
export default function ConfirmationForm(props){
    const axios=require("axios")
    const posColour={
        'st':'#fff1ca',
        'lw':'#ffb823',
        'lf':'#708a58',
        'cf':'#2d4f2b',
        'rf':'#fe7743',
        'rw':'#d7d7d7',
        'cam':'#093fb4',
        'lm':'#212121',
        'cm':'#642eb7',
        'rm':'#64e2b7',
        'lwb':'#bb3e00',
        'cdm':'#e69db8',
        'rwb':'#00879e',
        'lb':'#780c28',
        'cb':'#fac67a',
        'rb':'#f05a7e',
        'gk':'#5a639c'
    }

    const sendTournament=async()=>{
        // console.log(props.Tournament)
        // console.log(props.TeamList)
        setLoaded(false);
        const uri=`${process.env.NEXT_PUBLIC_BACKEND_URI}tournament`
        const response=await axios({
            method:"POST",
            url:uri,
            data:props.Tournament, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
            }}).then(async(response)=>{
                try{
                    // console.log(response.data.tournamentId)
                    const tournamentId=response.data.tournamentId;
                    await axios({
                        method:"POST",
                        url:`${uri}/${tournamentId}/teams`,
                        data:props.TeamList, 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                        }}).then((response)=>{
                            // console.log(response)
                            location.href='/tournaments'
                            // setLoaded(false)
                        }).catch((error)=>{
                            if(error.response.status==401){
                                location.href="/login"
                            }
                            console.error(error)
                        })
                }catch(e){
                    console.error(e);
                } 
                setLoaded(true);
                // setLoaded(false)
            }).catch((error)=>{
                console.error(error)
            })
    }
    const [Loaded,setLoaded]=useState(true)
    return(
        <motion.div>
            {Loaded&&<Paper shadow='lg' withBorder>
                <div className='pl-[1%] pt-[1%]'>
                    <Title order={2}>Tournament Details</Title>
                    <Divider my="md" />
                    <div className='flex gap-1'>
                        <Text size='lg' fw={600}>Tournament Name:</Text>
                        <Text size='lg' tt={"capitalize"}>{props.Tournament.tournamentName}</Text>
                    </div>
                    <div className='flex gap-1'>
                        <Text size='lg' fw={600}>No. of rounds:</Text>
                        <Text size='lg' >{props.Tournament.rounds}</Text>
                    </div>
                    <div className='flex gap-1'>
                        <Text size='lg' fw={600}>Teams:</Text>
                    </div>
                    <div className='flex justify-center px-[2%] pt-[1%]'>
                        <Table stickyHeader withTableBorder withColumnBorders striped highlightOnHover>
                            <colgroup>
                                <col className='w-[30%] sm:w-[20%] md:w-[15%] lg:w-[10%]'></col>
                                <col></col>
                            </colgroup>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th className='flex justify-center'>Team name</Table.Th>
                                    <Table.Th>
                                        <div className='flex justify-center'>
                                            Players
                                            </div>
                                    </Table.Th>
                                    
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {props.TeamList.map((val,ind)=>(
                                    <Table.Tr key={ind}>
                                        <Table.Td className='flex justify-center'>{val.teamName}</Table.Td>
                                        <Table.Td  >
                                            <div className='flex flex-wrap justify-center gap-1'>
                                                {(Object.entries(val).filter((([key,value])=>key!=="teamName"&&value!=0)).map(([key,value])=>
                                                    (
                                                        <Badge autoContrast key={key} color={posColour[key]}>{key} {value}</Badge>
                                                    )))}
                                            </div>
                                        </Table.Td>
                                        
                                    </Table.Tr>
                                ))
                                    
                                }
                            </Table.Tbody>
                        </Table>
                    </div>
                    <Group className='flex justify-center py-[1%]' justify='flex-end' mt="md">
                        <Button 
                        variant='gradient'
                        gradient={{
                            from:'blue',
                            to:'cyan',
                            deg:90
                        }}
                        styles={{root:{backgroundColor:'#fcbb7e',color:'#000000'}}} 
                        onClick={sendTournament}
                        >Submit</Button>
                    </Group>
                </div>

            </Paper>}
            {(!Loaded)&&
                <motion.div initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='flex py-[10%] items-center justify-center'>
                    <Loader color="#006992" size={40} />
                </motion.div>
            }
        </motion.div>
    )
}