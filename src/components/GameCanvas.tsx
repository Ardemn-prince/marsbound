'use client';
import { useEffect,useRef } from 'react';
import { GameLoop } from '@/engine/loop';
import { InputManager } from '@/engine/input';
import { Renderer } from '@/engine/renderer';
export default function GameCanvas(){const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{if(!ref.current)return;const input=new InputManager();const renderer=new Renderer(ref.current);let time=0;const loop=new GameLoop(dt=>{time+=dt;},()=>renderer.demo(time));loop.start();return()=>{loop.stop();input.dispose();};},[]);
  return <canvas ref={ref} aria-label="Mars exploration game" style={{width:'100%',display:'block',imageRendering:'pixelated',borderRadius:12}}/>;
}
