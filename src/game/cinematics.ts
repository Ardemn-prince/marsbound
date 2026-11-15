export interface BackstoryFrame{frame_id:string;title:string;subtitle:string;vo_trigger:string;sound_trigger:string;atlas_cell:number}
export const si_generated_intro_frame_ids=['briefing','descent','ground_zero'] as const;
export const intro_frames:BackstoryFrame[]=[
 {frame_id:'briefing',title:'Preliminary Mars survey',subtitle:'Assigned to the preliminary Mars survey... your mission is to explore its rich mineral deposits and evaluate its potential as a habitable second home for humanity.',vo_trigger:'vo_intro_01',sound_trigger:'interior_briefing_room_ambient',atlas_cell:0},
 {frame_id:'descent',title:'Arrival at Jezero',subtitle:'After months in deep space, you finally make landfall on the rust-colored plains of Jezero Crater...',vo_trigger:'vo_intro_02',sound_trigger:'rocket_descent_muffled',atlas_cell:1},
 {frame_id:'ground_zero',title:'Ground Zero',subtitle:'Ready to explore, build, and survive. 14 Sols to gather the data that could change the future of our species.',vo_trigger:'vo_intro_03',sound_trigger:'martian_wind_light',atlas_cell:2}
];
export const ending_frames:Record<'success'|'partial'|'evacuated',BackstoryFrame>={
 success:{frame_id:'success',title:'Preliminary survey complete',subtitle:'MISSION SUCCESS. You survived the 14-sol gauntlet and gathered a wealth of research. Earth Command confirms your data will directly shape the design of the first permanent habitable colony.',vo_trigger:'vo_ending_success',sound_trigger:'victory_fanfare_industrial',atlas_cell:3},
 partial:{frame_id:'partial',title:'Survival over science',subtitle:'SURVIVAL SECURED. Though scientific goals were cut short to prioritize critical base safety, you successfully boarded the return spaceship. A larger crew is delayed, but you kept everyone alive.',vo_trigger:'vo_ending_partial',sound_trigger:'triumphant_relief_music',atlas_cell:4},
 evacuated:{frame_id:'evacuated',title:'Evacuation initiated',subtitle:'EVACUATION INITIATED. An emergency rescue drone has pulled you from the surface. The mission is cut short, but Earth Command uses this data to prepare you—and the next team—for what went wrong.',vo_trigger:'vo_ending_evac',sound_trigger:'alarm_muffled_drone_rumble',atlas_cell:5}
};
export interface CinematicState{frame_index:number;is_complete:boolean}
export const initialize_cinematic=():CinematicState=>({frame_index:0,is_complete:false});
export function advance_cinematic(state:CinematicState,count=3):CinematicState{return state.frame_index+1>=count?{...state,is_complete:true}:{frame_index:state.frame_index+1,is_complete:false};}
