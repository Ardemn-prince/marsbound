import type { Mission } from './model';
export const EARTH_SOL_SECONDS=86400;
export const MARS_SOL_SECONDS=88775;
export const SOL_SECONDS=360*(MARS_SOL_SECONDS/EARTH_SOL_SECONDS);
export const TIME_SCALE=360/SOL_SECONDS;
export function forecast(elapsed:number){const sol=Math.floor(elapsed/SOL_SECONDS)+1;const phase=elapsed%SOL_SECONDS;const phaseScale=SOL_SECONDS/360;const kind: 'dust'|'radiation'=sol>=8&&sol%2===0?'radiation':'dust';const start=(sol%3===0?210:150)*phaseScale;const duration=55*phaseScale;return {sol,phase,kind,start,until:start-phase,active:phase>=start&&phase<start+duration,night:phase>=240*phaseScale};}
export function outsideTemperature(elapsed:number){return forecast(elapsed).night?-75:-23;}
export function experiencedTemperature(m:Pick<Mission,'feltTemperature'>){return Math.round(m.feltTemperature);}
