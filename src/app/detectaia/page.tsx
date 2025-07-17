
import Image from "next/image";
import logo from "../../../public/ia.svg"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { DetectaIaContent } from "./_components/detectaia-content";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, Mic, SlidersHorizontal } from "lucide-react";
import { IaContent } from "@/app/detectaia/_components/ia-content";



export default function Page() {
  
  return(
    <section className="max-auto max-w-full h-screen flex bg-zinc-900">
     <main className="flex-1 md:flex hidden flex-col border-r border-zinc-700  max-w-60 h-full px-4 py-8">
      <div className="flex gap-2 mb-1">
        <span  className="size-4 rounded-full bg-emerald-500"/>
        <span  className="size-4 rounded-full bg-yellow-500"/>
        <span  className="size-4 rounded-full bg-red-500"/>
        
      </div>
     
      <h1 className="text-emerald-500 font-bold text-3xl border-b border-zinc-800">DetectaIa</h1>
      
     </main>

     <main className="flex-1  ">
    <IaContent  />
      </main>
      
    </section>
  )
}