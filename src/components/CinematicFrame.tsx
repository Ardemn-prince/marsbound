'use client';
import {useEffect} from 'react';
import type {BackstoryFrame} from '@/game/cinematics';
import {play_sound,stop_sound,stop_narration} from '@/game/sound-events';
export default function CinematicFrame({frame,children}:{frame:BackstoryFrame;children?:React.ReactNode}){useEffect(()=>{stop_narration();play_sound(frame.sound_trigger);if(frame.frame_id==='success'||frame.frame_id==='partial')play_sound('rocket_takeoff');return()=>{stop_narration();stop_sound('rocket_takeoff');};},[frame]);return <section className="story-frame" aria-label={frame.title}><div className="story-art" style={{backgroundPosition:(frame.atlas_cell%3*50)+'% '+(Math.floor(frame.atlas_cell/3)*100)+'%'}} role="img" aria-label={frame.title}/><div className="story-caption"><small>MISSION CONTROL</small><h2>{frame.title}</h2><p>{frame.subtitle}</p>{children}</div></section>;}
