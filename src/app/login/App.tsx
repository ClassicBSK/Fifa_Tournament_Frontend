'use client'
import { Button, Group, TextInput, Card, Text, Overlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PasswordInput } from '@mantine/core';
import { Loader } from '@mantine/core';
import * as z from "zod"
import { zodResolver } from 'mantine-form-zod-resolver';
import { useEffect, useState } from 'react';
import {motion} from "motion/react"
import { log } from 'console';
import { cursorTo } from 'readline';




export default function App(){
    const [Errors,setErrors]=useState({})
    const [APIErrors,setAPIErrors]=useState("")
    const axios=require("axios")
    axios.interceptors.request.use(config => {
        // console.log("Request started");
        setLoaded(false)
        // e.g., showSpinner(true);
        return config;
    });
    useEffect(()=>{
        setLoaded(true);
    },[])
    const event =async(e)=>{
        e.preventDefault();
        setAPIErrors("")
        const result=loginForm.validate();
        
        if(result.hasErrors){
            
        }else{
            var formDetails={
                    "username":e.target.username.value,
                    "password":e.target.password.value
                }
            const uri=`${process.env.NEXT_PUBLIC_BACKEND_URI}user/login`
            // console.log(uri)
            // console.log(formDetails)
            const response=await axios({
                method:"POST",
                url:uri,
                data:formDetails, 
                headers: {
                    'Content-Type': 'application/json'
                }}).then((response)=>{
                    
                    window.localStorage.setItem("jwt",response.data)
                    // console.log(window.localStorage.getItem("jwt"))

                    location.href="/tournaments"
                    
                    // setLoaded(false)
                }).catch((error)=>{
                    setLoaded(true)
                    if(error.response){
                        setAPIErrors(error.response.data.error)
                    }
                })

                
            // console.log(response.json())
            // window.localStorage.setItem("jwt","love")
            // console.log()
            // setLoaded(false)
            // setAPIErrors("Incorrect Credentials")
        }
        // setErrors(result.errors);
        
        // console.log(e.target.password.value)
        // setLoaded(false)
    }
    const loginSchema=z.object({
        username:z.string().min(5,"Username should atleast be 5 characters long"),
        password:z.string().min(5,"Password should atleast be 5 characters long")
    })

    const loginForm=useForm({
        initialValues:{
            username:'',
            password:''
        },
        validate: zodResolver(loginSchema),
    })
    
    
    const [Loaded,setLoaded]=useState(true)
    return(<div className='h-screen flex items-center justify-center bg-[#eff5f7]'>
        <Card shadow='sm' padding="lg" radius="md" withBorder className='h-[60%] sm:h-[60%] md:h-[60%] lg:h-[60%] w-[60%] sm:w-[50%] md:w-[35%] lg:w-[25%] flex items-center'
        styles={{
            root:{
                backgroundColor: '#ffffff'
            }
        }}>
            {Loaded&&
            
            <motion.div initial={{x:"-100%",opacity:0}} whileInView={{x:"0%",opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='flex items-center w-full'>
                    <div className='w-full' >
                        <div className='pt-[10%] sm:pt-[10%] md:pt-[10%] lg:pt-[10%]'>      
                        </div>
                        <Text tt="capitalize" ta="center" className='text-2xl' fw={500}>Welcome Back</Text>
                        <Text fs='italic' ta="center" className='text-md' >Please enter your credentials to log in</Text>                             
                        <div className='pt-[10%] sm:pt-[10%] md:pt-[10%] lg:pt-[10%]'>
                        </div>
                        
                        <form id="loginform" onSubmit={event}>
                            <TextInput
                                styles={{
                                    root:{
                                        color:'#000000'
                                    },
                                    label:{
                                        fontWeight:400
                                    }
                                }}
                                withAsterisk
                                label="Username"
                                name='username'
                                placeholder='Username'
                                key={loginForm.key('username')}
                                {...loginForm.getInputProps('username')}
                            ></TextInput>
                            <div className='pt-[4%] sm:pt-[4%] md:pt-[4%] lg:pt-[4%]'>
                            </div>
                            <PasswordInput
                                styles={{
                                    root:{
                                        color:'#000000'
                                    },label:{
                                        fontWeight:400
                                    }
                                }}
                                withAsterisk
                                label="Password"
                                name='password'
                                placeholder='Password'
                                key={loginForm.key('password')}
                                {...loginForm.getInputProps('password')}
                            ></PasswordInput>
                            <Text size='xs' c='red'>{APIErrors}</Text>
                            <Group className='pt-[8%] sm:pt-[8%] md:pt-[8%] lg:pt-[8%] flex justify-center' justify='flex-end' mt="md">
                                <Button 
                                variant='gradient'
                                gradient={{
                                    from:'blue',
                                    to:'cyan',
                                    deg:90
                                }}
                                fullWidth 
                                styles={{root:{backgroundColor:'#fcbb7e',color:'#000000'}}} 
                                type='submit'>Submit</Button>
                            </Group>
                        </form>
                        <div className='pt-[8%] sm:pt-[8%] md:pt-[8%] lg:pt-[8%] flex justify-center gap-1'>
                         <Text size='sm'>Don't have an account?</Text>
                         <Text onClick={()=>{location.href='/register'}} className='cursor-pointer' size='sm' c='#006992'>Create account</Text>
                         </div>
                        
                    </div>
            </motion.div>
            }
            {(!Loaded)&&
                <motion.div initial={{x:"100%", opacity:0}} whileInView={{x:"0%", opacity:1}} transition={{duration:0.4,ease:"easeInOut"}} className='h-screen flex items-center justify-center'>
                    <Loader color="#006992" />
                </motion.div>
            }
        <Overlay
            style={{ pointerEvents: 'none' }}
            gradient="linear-gradient(180deg, rgba(0, 105, 146, 0.19) 0%, rgba(255, 255, 255, 0) 30%)"
            opacity={0.85}
        />
        </Card>
        </div>
    )
} 