import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Table, Badge, TextInput, NumberInput, Text, Group, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import * as z from "zod";
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
export default function TeamsForm(props){
    const [opened, { open, close }] = useDisclosure(false);
    const [TeamList,setTeamList] = useState([])
    const [APIErrors,setAPIErrors]=useState("") 
    const teamFormSchema=z.object({
        teamName:z.string().min(3,"TeamName should have a minimum of 3 characters"),
        st:z.number().min(0,"Can't be negative"),
        lw:z.number().min(0,"Can't be negative"),
        lf:z.number().min(0,"Can't be negative"),
        cf:z.number().min(0,"Can't be negative"),
        rf:z.number().min(0,"Can't be negative"),
        rw:z.number().min(0,"Can't be negative"),
        cam:z.number().min(0,"Can't be negative"),
        lm:z.number().min(0,"Can't be negative"),
        cm:z.number().min(0,"Can't be negative"),
        rm:z.number().min(0,"Can't be negative"),
        lwb:z.number().min(0,"Can't be negative"),
        cdm:z.number().min(0,"Can't be negative"),
        rwb:z.number().min(0,"Can't be negative"),
        lb:z.number().min(0,"Can't be negative"),
        cb:z.number().min(0,"Can't be negative"),
        rb:z.number().min(0,"Can't be negative"),
        gk:z.number().min(0,"Can't be negative")
    })
    const teamForm=useForm({
        initialValues:{
            teamName:"",
            st:0,
            lw:0,
            lf:0,
            cf:0,
            rf:0,
            rw:0,
            cam:0,
            lm:0,
            cm:0,
            rm:0,
            lwb:0,
            cdm:0,
            rwb:0,
            lb:0,
            cb:0,
            rb:0,
            gk:0
        },
        validate: zodResolver(teamFormSchema)
    })
    const positions=['st','lw','lf','cf','rf','rw','cam','lm','cm','rm','lwb','cdm','rwb','lb','cb','rb','gk']
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
    const [ChangeIndex,setChangeIndex]=useState(null);
    function TeamSubmit(e){
        e.preventDefault();
        setAPIErrors("")
        const result=teamForm.validate();
        if(result.hasErrors){
            
        }else{
            var sum=0;
            var teamObj={}
            teamObj['teamName']=e.target.teamName.value;
            for(var i in positions){
                sum+=parseInt(e.target[positions[i]].value);
                teamObj[positions[i]]=parseInt(e.target[positions[i]].value);
            }
            var temp=props.rounds
            var rounds =parseInt(temp)
            if(sum<rounds){
                setAPIErrors(`No .of players shouldn't be lesser than the number of rounds(${rounds})`)
                return;
            }
            
            var teams=props.TeamList;
            if(ChangeIndex!=null){
                teams[ChangeIndex]=teamObj;
                props.setTeamList(teams)
                teamForm.reset();
                setChangeIndex(null)
                close();
                return;
            }
            teams.push(teamObj)
            props.setTeamList(teams)
            props.setTeamErrors("")
            // console.log(props.TeamList)
            close();

            // console.log(e.target.teamName.value)
        }
    }
    return(
        <div className="flex justify-center items-center flex-col">
            <Modal opened={opened} onClose={close} title="Add team">
                <form id="teamForm" onSubmit={TeamSubmit}>
                    <div className='grid grid-cols-1'>
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
                            label="Team Name"
                            name='teamName'
                            placeholder='Team Name'
                            key={teamForm.key('teamName')}
                            {...teamForm.getInputProps('teamName')}
                        ></TextInput>
                        <div className='grid grid-cols-2'>
                            {positions.map((val,ind)=>   
                                (<div key={ind}>
                                    <NumberInput
                                        label={val}
                                        placeholder={val}
                                        name={val}
                                        key={teamForm.key(val)}
                                        {...teamForm.getInputProps(val)}
                                        />
                                </div>)
                            )}
                                
                        </div>
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
            </Modal>
            <Button className='w-30' onClick={()=>{
                setChangeIndex(null);
                teamForm.reset();
                open();
            }}
                variant='gradient'
                                gradient={{
                                    from:'blue',
                                    to:'cyan',
                                    deg:90
                                }}>
                Add Teams
            </Button>
            <div className='w-screen flex justify-center px-[2%] pt-[1%]'>
                <Table stickyHeader withTableBorder withColumnBorders striped highlightOnHover>
                    <colgroup>
                        <col className='w-[30%] sm:w-[20%] md:w-[15%] lg:w-[10%]'></col>
                        <col></col>
                        <col className='w-[30%] sm:w-[20%] md:w-[15%] lg:w-[10%]'></col>
                    </colgroup>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className='flex justify-center'>Team name</Table.Th>
                                <Table.Th>
                                    <div className='flex justify-center'>
                                        Players
                                     </div>
                                </Table.Th>
                            <Table.Th>
                                <div className='flex justify-center'>
                                    Delete
                                </div>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {props.TeamList.map((val,ind)=>(
                            <Table.Tr key={ind} className='cursor-pointer' >
                                <Table.Td className='flex justify-center' onClick={()=>{
                                    setChangeIndex(ind);
                                    teamForm.setValues(props.TeamList[ind]);
                                    open();
                                }}>{val.teamName}</Table.Td>
                                <Table.Td onClick={()=>{
                                    setChangeIndex(ind);
                                    teamForm.setValues(props.TeamList[ind]);
                                    open();
                                }}>
                                    <div className='flex flex-wrap justify-center gap-1'>
                                        {(Object.entries(val).filter((([key,value])=>key!=="teamName"&&value!=0)).map(([key,value])=>
                                            (
                                                <Badge style={{ minWidth: "fit-content", whiteSpace: "normal" }} autoContrast key={key} color={posColour[key]}>{key} {value}</Badge>
                                            )))}
                                    </div>
                                </Table.Td>
                                <Table.Td onClick={()=>{
                                    const temp=[...props.TeamList];
                                    temp.splice(ind,1);
                                    props.setTeamList(temp);
                                    // console.log(props.TeamList)
                                }}>
                                    <div className='flex justify-center'>
                                        <ActionIcon variant='light' color='#ff0000'>
                                            <IconTrash ></IconTrash>
                                        </ActionIcon>
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        ))
                            
                        }
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}