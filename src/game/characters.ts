export const CHARACTERS=[
  {id:'nova',name:'Nova',suit:'#e7a35d',skin:'#c88c65',hair:'#48384b',accent:'#a95337'},
  {id:'leo',name:'Leo',suit:'#79b8d8',skin:'#e9bc8e',hair:'#694a36',accent:'#386da2'},
  {id:'aya',name:'Aya',suit:'#b699d4',skin:'#a96e4d',hair:'#292a3e',accent:'#765496'},
  {id:'kai',name:'Kai',suit:'#86c8a5',skin:'#edccaa',hair:'#a56a40',accent:'#377a69'},
] as const;
export const characterById=(id:string)=>CHARACTERS.find(c=>c.id===id)??CHARACTERS[0];
export const ADVENTURE_KITS=[
  {id:'cozy',name:'Cozy Base',icon:'home',tag:'GREAT FIRST TRIP',summary:'More power. Extra air. A safe place to come home.',items:['solar','bank','moxie','supply'],tip:'A little extra backup makes a big adventure easier!'},
  {id:'explorer',name:'Trail Blazer',icon:'rover',tag:'LET’S GO PLACES',summary:'A speedy rover and room for more rocks.',items:['turbo','solar','shield'],tip:'We’ll travel faster! Remember to head home before dark.'},
  {id:'scientist',name:'Rock Star',icon:'scanner',tag:'CURIOUS MINDS',summary:'Scan rocks faster. Rex helps find more science, with extra protection and emergency reserves.',items:['drill','auto','shield','supply'],tip:'So many rocks, so many stories. Let’s discover them together!'},
] as const;

export const characterGender=(id:string):'boy'|'girl'=>id==='leo'||id==='kai'?'boy':'girl';
export const CADET_CHOICES=[{id:'nova',label:'Girl'},{id:'leo',label:'Boy'}] as const;
