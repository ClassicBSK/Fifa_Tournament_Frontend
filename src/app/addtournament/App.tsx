"use client"
import Header from "../tournaments/Header";
import { useState } from 'react';
import { Stepper, Button, Group, Text, TextInput, NumberInput } from '@mantine/core';
import {IconTournament, IconCircleCheck, IconInputCheck, IconUsersGroup} from '@tabler/icons-react';
import * as z from "zod"
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from "@mantine/form";
import { motion,AnimatePresence } from "motion/react";
import TeamsForm from "./TeamsForm";
import ConfirmationForm from "./ConfirmationForm";

export default function App(){
    const [Active,setActive]=useState(0)
    const [TeamErrors,setTeamErrors]=useState("")
    const nextStep=()=>{setActive((current)=>(current<3?current+1:current))};
    const prevStep=()=>{setActive((current)=>(current>0?current-1:current))};
    const [Tournament,setTournament]=useState({})
    const [TeamList,setTeamList]=useState([])
    const [APIErrors,setAPIErrors]=useState("")
    const tournamentFormSchema=z.object({
        tournamentName:z.string().min(3,"Tournament name should contain atleast 3 characters"),
        rounds: z.number().min(1,"Tournament should atleast have one round")
    })
    const [TempBool1,setTempBool1]=useState(true)
    const [TempBool2,setTempBool2]=useState(true)
    const [TempBool3,setTempBool3]=useState(true)

    const tournamentForm=useForm({
        initialValues:{
            tournamentName:'',
            rounds:2
        },
        validate:zodResolver(tournamentFormSchema)
    })

    const tournamentSubmit=(e)=>{
        e.preventDefault()
        setAPIErrors("")
        const result=tournamentForm.validate();
        
        if(result.hasErrors){
            // console.log(result)
        }else{
            // console.log(e.target.tournamentName.value)
            // console.log(e.target.rounds.value)
            const temp={}
            temp['tournamentName']=e.target.tournamentName.value
            temp['rounds']=e.target.rounds.value
            // console.log(temp)
            setTournament(temp)
            // console.log(Tournament['rounds'])
            setTempBool1(false)
            setTimeout(()=>{
               nextStep()
               setTempBool1(true) 
            },300)
            
        }
    }

    return(<div>
        <Header/>
        <div className="p-[2%]">
            <Stepper active={Active} onStepClick={setActive} completedIcon={<IconCircleCheck size={18} />} allowNextStepsSelect={false}>
                <Stepper.Step 
                icon={<IconTournament size={18}/>}
                label="First Step" 
                description="Add tournament details">
                    <AnimatePresence mode="wait">
                        {((Active==0)&&TempBool1)&&
                        <motion.div
                            key="step-1"
                            initial={{
                                opacity:0,
                                x: "100%"
                            }}
                            animate={{
                                opacity:1,
                                x: "0%"
                            }}
                            exit={{
                                opacity:0,
                                x:"-100%"
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}>
                            <form id="tournamentform" onSubmit={tournamentSubmit}>
                                <div className="pt-[5%] flex items-center justify-center flex-col">
                                    <TextInput
                                    styles={{
                                        root:{
                                            color:'#000000',
                                        },
                                        label:{
                                            fontWeight:600,
                                            
                                        }
                                    }}
                                    radius="xl"
                                    className="pt-[1%] w-full px-[20%] sm:px-[30%] md:px-[30%] lg:px-[30%] "
                                    withAsterisk
                                    label="Tournament Name"
                                    name='tournamentName'
                                    placeholder='Tournament Name'
                                    key={tournamentForm.key('tournamentName')}
                                    {...tournamentForm.getInputProps('tournamentName')}
                                    ></TextInput>
                                    <NumberInput
                                        className="pt-[1%] w-full px-[20%] sm:px-[30%] md:px-[30%] lg:px-[30%]"
                                        styles={{
                                            root:{
                                                color:'#000000'
                                            },label:{
                                                fontWeight:600,
                                                
                                            }
                                        }}
                                        radius="xl"
                                        withAsterisk
                                        label="Rounds"
                                        name='rounds'
                                        placeholder='Rounds'
                                        key={tournamentForm.key('rounds')}
                                        {...tournamentForm.getInputProps('rounds')}
                                    ></NumberInput>
                                    <Text size='xs' c='red'>{APIErrors}</Text>
                                    <Group className='flex justify-center pt-[1%]' justify='flex-end' mt="md">
                                        <Button 
                                        variant='gradient'
                                        gradient={{
                                            from:'blue',
                                            to:'cyan',
                                            deg:90
                                        }}
                                        fullWidth 
                                        styles={{root:{backgroundColor:'#fcbb7e',color:'#000000'}}} 
                                        type='submit'>Next</Button>
                                    </Group>
                                </div>
                            </form>
                        </motion.div>}
                    </AnimatePresence>
                </Stepper.Step>
                <Stepper.Step 
                label="Second Step" 
                description="Add team details"
                icon={<IconUsersGroup size={18}/>}>
                    <AnimatePresence mode="wait">
                        {((Active==1)&&TempBool2)&&
                        <motion.div
                        key="step-2"
                            initial={{
                                opacity:0,
                                x:"100%"
                            }}
                            animate={{
                                opacity:1,
                                x:"0%"
                            }}
                            exit={{
                                opacity:0,
                                x:"-100%"
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}>
                                <TeamsForm rounds={Tournament['rounds']} TeamList={TeamList} setTeamList={setTeamList} setTeamErrors={setTeamErrors}/>
                                <Text className='flex justify-center' size='md' c='red'>{TeamErrors}</Text>
                                <Group className='flex justify-center pt-[1%]' justify='flex-end' mt="md">
                                    <Button 
                                    variant='gradient'
                                    gradient={{
                                        from:'blue',
                                        to:'cyan',
                                        deg:90
                                    }}
                                    onClick={prevStep}
                                    styles={{root:{backgroundColor:'#fcbb7e',color:'#000000'}}} 
                                    >Prev</Button>
                                    <Button 
                                    variant='gradient'
                                    gradient={{
                                        from:'blue',
                                        to:'cyan',
                                        deg:90
                                    }}
                                    onClick={()=>{
                                        if(TeamList.length<2){
                                            setTeamErrors("Tournament should atleast have 2 teams");
                                            return;
                                        }
                                        setTeamErrors("");
                                        setTempBool2(false)
                                        setTimeout(()=>{
                                            nextStep();
                                            setTempBool2(true)
                                        },500)
                                    }}
                                    styles={{root:{backgroundColor:'#fcbb7e',color:'#000000'}}} 
                                    >Next</Button>
                                </Group>
                                
                        </motion.div>}
                    </AnimatePresence>
                </Stepper.Step>
                <Stepper.Step 
                key="step-3"
                label="Final Step" 
                description="Check all the inputs"
                icon={<IconInputCheck size={18}/>}>
                    <AnimatePresence mode="wait">
                        {((Active==2)&&TempBool3)&&
                        <motion.div
                        key="step-3"
                            initial={{
                                opacity:0,
                                x:"100%"
                            }}
                            animate={{
                                opacity:1,
                                x:"0%"
                            }}
                            exit={{
                                opacity:0,
                                x:"-100%"
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}>
                                <ConfirmationForm Tournament={Tournament} TeamList={TeamList}/>
                            </motion.div>}
                    </AnimatePresence>
                </Stepper.Step>
            </Stepper>
        </div>
    </div>)
}