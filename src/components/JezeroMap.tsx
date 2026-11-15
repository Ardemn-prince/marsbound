'use client';
import {hazard_task_position} from '@/game/hazard-events';
import type {Mission} from '@/game/model';
import {landforms,regionAt,REGIONS} from '@/game/world';
import {samples} from '@/game/research';
import {mapPosition} from '@/game/map';
import {GEOLOGY} from '@/game/geology';
export default function JezeroMap({m,compact=false}:{m:Mission;compact?:boolean}){
 const player=mapPosition(m.player),rover=mapPosition(m.rover);
 return <svg className={'jezero-map '+(compact?'compact':'')} viewBox="0 0 500 500" role="img" aria-label="Jezero biome rings with live astronaut, rover, base and geological landmarks">
 <circle cx="250" cy="250" r="211" fill="#35483e"/><circle cx="250" cy="250" r="112" fill="#a39c88"/><circle cx="250" cy="250" r="60" fill="#b56c4d"/>
 <image href="/sprites/jezero-map-v1.png" x="16" y="16" width="468" height="468"/>
 <g fill="none" stroke="#e7d8b5" strokeOpacity=".22"><circle cx="250" cy="250" r="204"/><circle cx="250" cy="250" r="112"/><circle cx="250" cy="250" r="60"/><path d="M250 28v13m0 418v13M28 250h13m418 0h13"/></g>
 {!compact&&samples.filter(s=>!m.collected.includes(s.id)&&m.explored.includes(regionAt(s).id)).map(s=>{const p=mapPosition(s);return <path key={s.id} d={`M${p.x} ${p.y-2.4}l2.4 2.4-2.4 2.4-2.4-2.4Z`} fill="#d0d3c0" opacity=".65"/>;})}
 {landforms.filter(s=>m.explored.includes(regionAt(s).id)).map(s=>{const p=mapPosition(s);return <g key={s.id}><circle cx={p.x} cy={p.y} r={compact?7:5} fill="#d5986e" stroke="#222a29" strokeWidth="2"><title>{GEOLOGY[s.id].name}</title></circle>{!compact&&<text x={p.x} y={p.y-11} textAnchor="middle" className="map-poi-label">{GEOLOGY[s.id].name}</text>}</g>;})}
 {m.hazard_event&&!m.hazard_event.task_complete&&m.elapsed<m.hazard_event.ends_at&&(()=>{const task=mapPosition(hazard_task_position(m.hazard_event));return <g><circle cx={task.x} cy={task.y} r="12" fill="none" stroke="#ffe08a" strokeWidth="3"/><text x={task.x} y={task.y+4} textAnchor="middle" fill="#ffe08a" fontSize="13">!</text></g>;})()}
 <rect x="242" y="242" width="16" height="16" rx="2" fill="#f0dba4" stroke="#352b28" strokeWidth="3"><title>Jezero base</title></rect>
 <path d={`M${rover.x} ${rover.y-6}l6 6-6 6-6-6Z`} fill="#8fbac2" stroke="#243537" strokeWidth="2"><title>Rover</title></path>
 <circle cx={player.x} cy={player.y} r={compact?10:7} fill="#ee9768" stroke="#fff3c9" strokeWidth="3"><title>You</title></circle>
 <text x="250" y="23" textAnchor="middle" className="map-north">N</text>
 {!compact&&<text x="250" y="483" textAnchor="middle" className="map-scale">SCHEMATIC · DISTANCES COMPRESSED · WORLD EDGES WRAP</text>}
 </svg>;
}
export function MapLegend({m}:{m:Mission}){return <div className="jezero-map-details"><div className="map-symbols"><span><i className="you"/>You</span><span><i className="sample"/>Samples</span><span><i className="base"/>Base</span><span><i className="poi"/>Landmark</span><span><i className="rover"/>Rover</span></div><div className="biome-key">{REGIONS.map((r,i)=><div key={r.id}><i style={{background:['#b56c4d','#a39c88','#35483e'][i]}}/><span>{r.name}<small>{m.explored.includes(r.id)?'EXPLORED':'UNEXPLORED'}</small></span></div>)}</div><p>{m.explored.length} / 3 biomes explored. Your base is at the center. Travel outward to reach the delta and crater rim.</p></div>;}
