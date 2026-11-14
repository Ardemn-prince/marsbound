export const SOL_SECONDS=360;
export function forecast(elapsed:number){const sol=Math.floor(elapsed/SOL_SECONDS)+1;const phase=elapsed%SOL_SECONDS;const kind: 'dust'|'radiation'=sol>=8&&sol%2===0?'radiation':'dust';const start=sol%3===0?210:150;return {sol,phase,kind,start,until:start-phase,active:phase>=start&&phase<start+55,night:phase>=240};}
