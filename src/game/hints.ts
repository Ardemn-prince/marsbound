import type {Mission} from './model';
import {distance} from '@/engine/math';
import {samples} from './research';
export function interactionHint(m:Mission){if(m.riding)return 'V · Leave rover';if(m.shelter==='lab')return m.scanning?'Analysis in progress':'E · Analyze sample';if(m.shelter==='command')return 'E · Command console';if(m.shelter==='storage')return 'E · Recharge rover';if(samples.some(s=>!m.collected.includes(s.id)&&distance(m.player,s)<52))return 'E · Collect sample';if(distance(m.player,m.rover)<65)return 'V · Board rover';if(distance(m.player,{x:760,y:650})<100)return 'E · Clean solar panels';return '';}
