import type {Mission} from './model';

export type KidMission={id:string;title:string;detail:string;progress:number;target:number;complete:boolean};

const missionList=(m:Mission):KidMission[]=>[
  {id:'mars-walker',title:'Mars Walker',detail:'Explore a new region with Rex.',progress:Math.min(1,m.explored.length>1?1:0),target:1,complete:m.explored.length>1},
  {id:'rock-ranger',title:'Rock Ranger',detail:'Collect three interesting rocks.',progress:Math.min(3,m.collected.length),target:3,complete:m.collected.length>=3},
  {id:'science-scout',title:'Science Scout',detail:'Analyze your first sample in the Lab.',progress:Math.min(1,m.discoveries.length),target:1,complete:m.discoveries.length>0},
  {id:'storm-watcher',title:'Storm Watcher',detail:'Deploy the weather beacon.',progress:Math.min(1,m.beacon?1:0),target:1,complete:!!m.beacon}
];

export function currentKidMission(m:Mission):KidMission{
  return missionList(m).find(mission=>!mission.complete)??{id:'mars-explorer',title:'Mars Explorer',detail:'Discover five samples before Sol 14.',progress:Math.min(5,m.discoveries.length),target:5,complete:m.discoveries.length>=5};
}

export function kidBadges(m:Mission){
  return [
    {id:'walker',label:'WALKER',earned:m.explored.length>1},
    {id:'rock-ranger',label:'ROCK RANGER',earned:m.collected.length>=3},
    {id:'science-scout',label:'SCIENCE SCOUT',earned:m.discoveries.length>0},
    {id:'storm-watcher',label:'STORM WATCHER',earned:!!m.beacon}
  ];
}

export function discoveryMessage(m:Mission){
  if(m.discoveries.length>0)return 'A new sample is ready for your science story.';
  if(m.explored.includes('margin'))return 'Rex found the ancient crater margin. What secrets are hiding here?';
  if(m.explored.includes('delta'))return 'The delta has arrived in view. Mars keeps getting more interesting.';
  return 'Every step helps map our corner of Mars.';
}
