'use client';
import {useEffect,useState,type CSSProperties} from 'react';
import type {Mission} from '@/game/model';
import {rexTip} from '@/game/rex';
import {forecast,SOL_SECONDS,TIME_SCALE,experiencedTemperature} from '@/game/forecast';
import {SCIENCE,sampleById} from '@/game/research';
import {interactionHint} from '@/game/hints';
import {useMission} from '@/game/store';
import {gameInput} from './GameCanvas';
import {greenhouseFoodInterval} from '@/game/base';

function Sprite({kind}:{kind:string}){const cell:Record<string,[number,number]>={rock:[0,0],scanner:[0,1],beacon:[2,1],rover:[3,1]};const sprite=cell[kind];if(sprite)return <span className="atlas-icon" style={{backgroundPosition:(sprite[0]*100/3)+'% '+(sprite[1]*100/3)+'%'}} aria-hidden="true"/>;return <span className={'item-art item-'+kind} aria-hidden="true"/>;}
function Gauge({label,value,max=100,kind}:{label:string;value:number;max?:number;kind:string}){return <div className={'survival-gauge '+kind} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} title={label+': '+Math.round(value)+' / '+max}><span className="gauge-emblem">{kind==='health'?'♥':kind==='air'?'O₂':kind==='sleep'?'Zz':kind==='food'?'●':'ϟ'}</span><div className="gauge-well"><i style={{height:Math.max(0,Math.min(100,value/max*100))+'%'}}/></div><small>{Math.round(value)}</small></div>;}
export default function ExpeditionHud({m}:{m:Mission}){const f=forecast(m.elapsed);const store=useMission.getState();const [selected,setSelected]=useState(0);const [notice,setNotice]=useState('');const pulse=(key:string)=>{gameInput.current?.set(key,true);gameInput.current?.set(key,false);};
  useEffect(()=>{const show=setTimeout(()=>setNotice(m.message),0);const hide=setTimeout(()=>setNotice(''),6500);return()=>{clearTimeout(show);clearTimeout(hide);};},[m.message]);
  const tools=[...(m.upgrades.includes('field-scanner')?[{kind:'scanner',name:'Scan rock rarity',key:'Q',action:()=>pulse('q')}]:[]),{kind:'scanner',name:'Interact / lab scan',key:'E',action:()=>pulse('e')},{kind:'beacon',name:'Deploy weather beacon',key:'K',action:()=>pulse('k')},{kind:'lamp',name:'Toggle flashlight',key:'F',action:()=>pulse('f')},{kind:'rover',name:'Board / leave rover',key:'V',action:()=>pulse('v')}];
  return <>
    <button className="survival-menu" onClick={store.togglePause} aria-label="Pause and mission menu" title="Pause · Esc">▾</button>
    <section className="survival-status" aria-label="Mission time and life support">
      <div className="day-plaque"><small>SOL</small><strong>{Math.min(14,f.sol)}</strong><span>/ 14</span></div>
      <button className={'weather-dial '+(f.night?'is-night':'')} onClick={()=>store.openPanel('power')} aria-label={'Feels like '+experiencedTemperature(m)+'°C. Open power management.'} title="Feels like temperature · Open power management"><div className="dial-face"><span className="dial-sun">☀</span><span className="dial-moon">☾</span><i className="dial-hand" style={{transform:'rotate('+(f.phase/SOL_SECONDS*360-90)+'deg)'}}/><b className="dial-pin"/></div><span className="dial-caption">FEELS {experiencedTemperature(m)}°C</span></button>
      <Gauge label="Crew safety" value={m.safety} kind="health"/><Gauge label="Suit oxygen" value={m.oxygen} kind="air"/><Gauge label="Sustenance" value={m.sustenance} kind="food"/><Gauge label="Sleep" value={m.sleep} kind="sleep"/><Gauge label="Battery" value={m.power} max={m.capacity} kind="energy"/>
      {(f.active||(f.until>0&&f.until<=60)||f.night)&&<div className="survival-alert">{f.active?f.kind.toUpperCase()+' EVENT':f.night?'FREEZING NIGHT':f.kind.toUpperCase()+' IN '+Math.ceil(f.until)+'s'}</div>}
      {m.shelter==='greenhouse'&&<div className="survival-alert greenhouse-status">FOOD {m.greenhouseFood}/3 · {m.greenhouseFood>=3?'STORAGE FULL':m.circuits.greenhouse&&m.power>.01?'NEXT MEAL '+Math.max(0,Math.ceil(greenhouseFoodInterval-m.greenhouseTimer))+'s':'PRODUCTION PAUSED'}</div>}
      {m.scanning&&<div className="survival-alert scanner-status">SCANNER · {Math.max(0,Math.ceil(m.scanning.remaining/TIME_SCALE))}s REMAINING</div>}
    </section>
    {m.started&&(m.oxygen<=25||f.active||(f.until>0&&f.until<=60)||m.inventory.length>=4||Math.floor(m.elapsed)%24<7)&&<aside className="rex-dialog" aria-label="Rex companion"><span className="rex-face">RΞX</span><div><b>REX <small>EXPEDITION COMPANION</small></b><p role={m.oxygen<=25?'status':undefined}>{rexTip(m)}</p></div></aside>}
    <nav className="survival-belt" aria-label="Quick inventory and equipment">
      <button className="belt-pack" onClick={()=>store.openPanel('inventory')} aria-label="Open inventory"><Sprite kind="pack"/><small>BAG</small></button>
      <div className="belt-slots" style={{gridTemplateColumns:`repeat(${4+tools.length},minmax(0,1fr))`}}>{Array.from({length:4},(_,i)=>{const sample=sampleById(m.inventory[i]);return <button className={'belt-slot '+(selected===i?'selected':'')} style={{'--item-color':sample?SCIENCE[sample.kind].color:'#918173'} as CSSProperties} key={'sample'+i} onClick={()=>{setSelected(i);store.openPanel('inventory');}} aria-label={sample?SCIENCE[sample.kind].name:'Empty sample slot '+(i+1)} title={sample?SCIENCE[sample.kind].name:'Empty sample slot'}><span className="slot-index">{i+1}</span>{sample&&<><Sprite kind="rock"/><span className="slot-count">1</span></>}</button>})}{tools.map((tool,i)=><button key={tool.key} className={'belt-slot '+(selected===i+4?'selected':'')} onClick={()=>{setSelected(i+4);tool.action();}} aria-label={tool.name} title={tool.name+' · '+tool.key}><span className="slot-index">{tool.key}</span><Sprite kind={tool.kind}/>{tool.kind==='rover'&&<span className="slot-count">{Math.round(m.roverCharge)}%</span>}{tool.kind==='beacon'&&<span className="slot-count">{m.beacon?'ON':'1'}</span>}</button>)}</div>
      <button className="belt-journal" onClick={()=>store.openPanel('journal')} aria-label={'Science journal: '+m.points+' research points'} title="Science journal"><Sprite kind="book"/><small>{m.points} RP</small></button>
    </nav>
    <nav className="survival-actions" aria-label="Mission shortcuts"><button onClick={()=>pulse(m.riding?'v':'e')}><kbd>{m.riding?'V':'E'}</kbd><span>{m.riding?'DISMOUNT':'INTERACT'}</span></button><button onClick={()=>store.openPanel('map')}><kbd>M</kbd><Sprite kind="map"/><span>MAP</span></button><div><button onClick={()=>store.openPanel('workbench')}><kbd>C</kbd><Sprite kind="wrench"/><span>CRAFT</span></button><button onClick={()=>store.openPanel('journal')}><kbd>J</kbd><Sprite kind="book"/><span>LOG</span></button></div></nav>
    {interactionHint(m)&&<div className="survival-prompt">{interactionHint(m)}</div>}
    {notice&&m.started&&<div className="survival-notice" role="status" key={notice}>{notice}</div>}
  </>;
}
