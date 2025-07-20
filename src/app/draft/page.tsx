"use client"
import App from "./App";

export default function page(){
    var params=null;
    if(typeof window !=="undefined"){

        params=new URLSearchParams(window.location.search)
    }
    var tId="";
    if(params!==null){
        tId=params.get("tournamentId")
    }
    return(
        <div>
            <App tournamentId={tId}/>
        </div>
    )
}