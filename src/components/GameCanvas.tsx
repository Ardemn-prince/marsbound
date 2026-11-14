'use client';
import { useEffect,useRef } from 'react';
import { GameLoop } from '@/engine/loop';
import { InputManager } from '@/engine/input';
import { Renderer } from '@/engine/renderer';
import { useMission } from '@/game/store';
import { drawScene } from '@/game/draw';
export const gameInput:{current:InputManager|null}={current:null};
export default function GameCanvas(){const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{if(!ref.current)return;const input=new InputManager();gameInput.current=input;const renderer=new Renderer(ref.current);const resize=()=>renderer.resize(window.innerWidth,window.innerHeight);resize();window.addEventListener('resize',resize);const loop=new GameLoop(dt=>useMission.getState().step(dt,input),()=>drawScene(renderer,useMission.getState().mission));loop.start();return()=>{loop.stop();window.removeEventListener('resize',resize);input.dispose();gameInput.current=null;};},[]);
  return <canvas ref={ref} aria-label="Mars exploration game" style={{width:'100%',height:'100%',display:'block',imageRendering:'pixelated'}}/>;
}
