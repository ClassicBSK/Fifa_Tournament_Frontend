'use client'
import { Title, Avatar, Menu, Button, Text, MenuLabel, Breadcrumbs, Anchor } from '@mantine/core';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
export default function Header(){
    
    const [Username,setUsername] =useState("");
    const logout=()=>{
        window.localStorage.removeItem("jwt")
        location.href="/login"
    }
    const axios=require("axios")
    useEffect(()=>{
        async function thala(){
            const response=await axios({
                method:"GET",
                url:`${process.env.NEXT_PUBLIC_BACKEND_URI}user/valid`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("jwt")}`
                }}).then((response)=>{
                    // window.localStorage.setItem("jwt",response.data)
                    // console.log(window.localStorage.getItem("jwt"))
                    // console.log(response.data)
                    setUsername(response.data)
                    // window.localStorage.removeItem("jwt")
                    // setLoaded(false)
                }).catch((error)=>{
                    console.log(error.response.data.error)
                    location.href="/login"
                })
        }  
        thala();
    },[])
    return (
        <motion.div
            initial={{
                y:"-100%",
                opacity: 0
            }}
            whileInView={{
                y: "0%",
                opacity: 1
            }}
            transition={{
                duration:0.4,
                ease:"easeInOut"
            }}
            className="py-[0.5%] flex items-center justify-between bg-[#006992]/25 shadow-lg">
            <div className='flex items-center max-w-[40%]'>
                <Text onClick={()=>{location.href="/tournaments"}} className=' cursor-pointer text-xl font-semibold font-serif italic '>Go to tournaments</Text>
               
            </div>
            <div className='flex-1 flex justify-center items-center'>
                <Text className='text-xl font-semibold font-serif italic'>FIFA Tournament Creator</Text>
            </div>
            <div className="flex items-center">
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Avatar className='cursor-pointer border-1 border-[#006992] shadow-lg' name={Username}  radius='lg' color='initials'></Avatar>   
                    </Menu.Target>
                    
                    <Menu.Dropdown>
                        <Text className='pl-[6%] pt-[4%]'>{Username}</Text>
                        <Menu.Divider />
                        <MenuLabel>Account</MenuLabel>
                        <Menu.Item
                        color="red"
                        onClick={()=>{
                            logout();
                        }}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu> 
            </div>
        </motion.div>
    )
}