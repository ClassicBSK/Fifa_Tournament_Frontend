"use client"
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    location.href="/tournaments"
  }, [])
  
  return (
    <div></div>
  );
}
