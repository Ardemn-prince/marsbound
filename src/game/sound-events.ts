import {MissionAudio} from './audio';
export const audio_engine=new MissionAudio();
export const sound_fx_map={footsteps:90,flashlight_click:700,scanner_pulse:880,item_select:520,deployment:330,bulkhead_slide:110,base_hum:65,ambient_wind:120,storm_wind:80,klaxon:240,ui_click:560,task_completed:740,interior_briefing_room_ambient:130,rocket_descent_muffled:70,martian_wind_light:145,victory_fanfare_industrial:660,triumphant_relief_music:440,alarm_muffled_drone_rumble:100} as const;
export function play_sound(sound_id:string){const frequency=sound_fx_map[sound_id as keyof typeof sound_fx_map];if(!frequency)return;audio_engine.effect(sound_id,frequency);}
export function stop_narration(){if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();}
