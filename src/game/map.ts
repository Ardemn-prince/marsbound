import type {Vec2} from '@/engine/math';
import {BASE_CENTER,WORLD} from './world';
/** Schematic radial map: preserve bearings and biome membership, compress outer distances. */
export function mapPosition(p:Vec2){const dx=((p.x-BASE_CENTER.x+WORLD.width/2)%WORLD.width+WORLD.width)%WORLD.width-WORLD.width/2,dy=((p.y-BASE_CENTER.y+WORLD.height/2)%WORLD.height+WORLD.height)%WORLD.height-WORLD.height/2;const r=Math.hypot(dx,dy);const max=Math.hypot(WORLD.width/2,WORLD.height/2);const plotted=r<=520?r/520*60:r<=1100?60+(r-520)/580*52:112+(r-1100)/(max-1100)*89;return {x:250+(r?dx/r*plotted:0),y:250+(r?dy/r*plotted:0)};}
