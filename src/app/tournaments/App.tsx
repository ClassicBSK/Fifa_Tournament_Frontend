"use client"
import { Title, Drawer, Divider, Overlay, Tooltip, Modal,Loader } from '@mantine/core';
import Header from './Header';
import { useEffect, useState } from 'react';
import { Card, Image, Text, Badge, Button, Group, ActionIcon  } from '@mantine/core';
import { motion } from 'motion/react';
import { IconCirclePlus, IconShirtSport, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
export default function App(){
    const axios=require("axios")
    const [Tournaments,setTournaments]=useState([])
    const [DeleteId,setDeleteId]=useState(null);
    const [Loaded,setLoaded]=useState(true)
    async function getTournaments(){
        setLoaded(false)
        const response=await axios({
                method:"GET",
                url:`${process.env.NEXT_PUBLIC_BACKEND_URI}user/tournaments`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                }}).then((response)=>{
                    console.log(response.data)
                    setTournaments(response.data)
                    setLoaded(true)
                    
                }).catch((error)=>{

                    if(error.response.status==401){
                        location.href="/login"
                    }
                    setLoaded(true)
                    console.error(error)
                
                })
        }
        useEffect(()=>{
            getTournaments();
            
        },[])
        const [opened, { open, close }] = useDisclosure(false);
        const deleteTournament=async()=>{
            // console.log(DeleteId)
            setLoaded(false)
            const review=await axios({
                method:"DELETE",
                url:`${process.env.NEXT_PUBLIC_BACKEND_URI}tournament/${DeleteId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                }}).then((response)=>{
                    // console.log(response)
                    close();
                    setLoaded(true)
                    getTournaments();
                }).catch((error)=>{
                    if(error.response.status==401){
                        location.href="/login"
                    }
                    console.error(error)
                
                })
            }
    return (
        <div className='h-screen bg-[#eff5f7]'>
            <Header/>   
            <Title order={2} className='pl-[1%] pt-[1%]' onClick={()=>{
                // console.log(Tournaments)
            }}>Tournaments</Title>
            {Loaded&&<motion.div initial={{opacity:0,x:"-100%"}} whileInView={{opacity:1,x:"0%"}} transition={{duration:0.8}}className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-[2%] pl-[1%]'>
                {
                    Tournaments.map((tournament,key)=>{
                        console.log(Tournaments.length)
                        var disableDraft=tournament['teams'][0]['players'].length==tournament['rounds'];
                        
                        return(<div className='flex justify-center items-center' key={key}>
                            
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Image
                                    src="https://i.guim.co.uk/img/static/sys-images/Sport/Pix/pictures/2010/12/2/1291294801429/2022-World-Cup-006.jpg?width=465&dpr=1&s=none&crop=none"
                                    height={160}
                                    alt="Norway"
                                    />
                                </Card.Section>
                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text fw={500} tt='capitalize'>{tournament['tournamentName']}</Text>
                                    <Badge color="pink">{tournament['rounds']} rounds</Badge>
                                </Group>
                                <Divider my="xs" />
                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text fw={400} >No.of teams: {tournament['teams'].length}</Text> 
                                </Group>
                                <Text fw={400}>No. of rounds completed: {tournament['teams'][0]['players'].length}</Text>
                                <div className='pt-[5%]'>
                                    {disableDraft&&
                                        <Button
                                            onClick={()=>{
                                                location.href=`/draft?tournamentId=${tournament['tournamentId']}`
                                            }}
                                            leftSection={<IconShirtSport size={14}/>}
                                            fullWidth 
                                            styles={{root:{backgroundColor:'#93d9f5',color:'#000000'}}}>View Players</Button>
                                    }
                                    {!disableDraft&&
                                    <Button
                                        onClick={()=>{
                                            location.href=`/draft?tournamentId=${tournament['tournamentId']}`
                                        }}
                                        leftSection={<IconShirtSport size={16}/>}
                                        fullWidth 
                                            styles={{root:{backgroundColor:'#93d9f5',color:'#000000'}}} >Draft players</Button>
                                    }
                                </div>
                                <div className='pt-[5%]'>
                                    <div className='flex items-center justify-center'>
                                        <Modal opened={opened} onClose={close} title="Are you sure you want to delete this tournament?">
                                            <Group className='flex justify-center pt-[1%]' justify='flex-end' mt="md">
                                                <Button 
                                                variant='default'
                                                onClick={()=>{
                                                    setDeleteId(null);
                                                    close();
                                                }}>No</Button>
                                                <Button 
                                                onClick={()=>{deleteTournament()}}
                                                variant='filled'
                                                color='red'
                                                >Yes</Button>
                                            </Group>
                                        </Modal>
                                    </div>
                                    <Button
                                        onClick={()=>{
                                            setDeleteId(tournament['tournamentId']);
                                            open();
                                        }}
                                        leftSection={<IconTrash size={16}/>}
                                        variant='outline'
                                        fullWidth 
                                        color='red'>Delete tournament</Button>
                                </div>
                            </Card>
                        </div>)
                    })
                }
                <div>
                    <Tooltip label="Add tournament" onClick={()=>{
                        location.href="/addtournament"
                    }}>
                        <ActionIcon radius="xl">
                            <IconCirclePlus stroke={2}/>
                        </ActionIcon>
                    </Tooltip>
                </div>
            </motion.div>}
            {(!Loaded)&&
                <motion.div initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='flex py-[10%] items-center justify-center'>
                    <Loader color="#006992" size={40} />
                </motion.div>
            }
        </div>
    )
}