'use client';
import { useMission } from '@/game/store';
export default function Status(){const message=useMission(s=>s.mission.message);const paused=useMission(s=>s.mission.paused);return <div className="py-4"><p>{paused?'MISSION PAUSED':message}</p><p className="text-sm text-stone-400 mt-2">WASD / arrows · Move　 Shift · Dash　 E · Interact　 F · Light　 Esc · Pause</p></div>}
