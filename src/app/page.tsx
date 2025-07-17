"use client";

import Image from "next/image";
import logo from "../../public/ia.svg"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  return(
    <section className="max-auto max-w-full h-screen fle flex-col items-center justify-center bg-zinc-900">
        <header className="w-full h-20 border-b flex items-center px-2  border-zinc-800">
          <div className="flex  gap-2 mr-3">
          <span className="size-4 rounded-full border-white border bg-red-500"/>
          <span className="size-4 rounded-full border-white border bg-yellow-500"/>
          <span className="size-4 rounded-full border-white border bg-emerald-500"/>
          </div>
          <h1 className="font-bold text-3xl text-white">Detecta<span className="ml-2">IA</span></h1>
        </header>
        <main className="flex mt-20 items-center justify-center ">
          <div>
            <Image
            src={logo}
            alt="Logo do DetectaIA"
           
            className=" mx-auto mb-4 w-150 h-80"
            />
          </div>
         

          <div className="flex flex-col mt-40 items-start  gap-2 ml-20">
            <h1 className="text-xl font-bold text-zinc-100">🤔 Será que foi um robô que escreveu isso?</h1>
            <p className="text-sm font-normal text-zinc-200">Se você tem dúvidas, cole o texto aqui e descubra na hora quem é o verdadeiro autor: humano ou inteligência artificial?</p>
            <Popover>
            <PopoverTrigger className="w-full py-2 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-400">Analisar Texto Agora</PopoverTrigger>
            <PopoverContent  className="w-auto space-y-2">
              <h1 className="text-center font-bold text-xl text-zinc-800">Analisar texto</h1>
              <p className="text-center font-normal text-sm text-zinc-600">Insira o texto que deseja analisar para descobrir se foi escrito por um humano ou por uma IA.</p>
              
              <Textarea />
              <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold">Analisar</Button>

            </PopoverContent>
          </Popover>
          </div>
        </main>
    </section>
  )
}