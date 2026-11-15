import type {Mission} from './model';
/** Discrete transitions, including crafting while its menu is open. */
export function action_sound_ids(previous:Mission,current:Mission):string[]{
  if(!current.started||current.paused||current.outcome||!previous.started)return [];
  const sounds:string[]=[];
  if(current.shelter!==previous.shelter)sounds.push('building_transition');
  if(current.sleeping!==previous.sleeping)sounds.push('sleep_cycle');
  if(current.upgrades.length>previous.upgrades.length||(current.timeline.length>previous.timeline.length&&current.message.startsWith('Printed ')))sounds.push('craft');
  if(previous.scanning&&!current.scanning&&current.points>previous.points)sounds.push('research_complete');
  if(current.message.startsWith('Scanner:')&&(current.message!==previous.message||current.player.action>previous.player.action))sounds.push('scanner_pulse');
  if(current.message!==previous.message&&/rack is full|not enough|need .*points|already installed|too tired|powered down|upgrade prerequisites/i.test(current.message))sounds.push('action_error');
  return sounds;
}
