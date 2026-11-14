import { spawnSync } from 'node:child_process';
const [message, tag] = process.argv.slice(2);
if (!message || !/^v\d+\.\d+\.\d+$/.test(tag)) throw new Error('Usage: node scripts/milestone.mjs "message" v0.1.0');
function run(command,args){const r=spawnSync(command,args,{stdio:'inherit',shell:process.platform==='win32'});if(r.status!==0)process.exit(r.status||1)}
run('npm',['run','typecheck']); run('npm',['run','lint']); run('npm',['run','build']);
run('git',['add','.']);
// Quotes are needed for Windows cmd's spawn shell.
run('git',['commit','-m',JSON.stringify(message)]);
run('git',['tag',tag]); run('git',['push','origin','main']); run('git',['push','origin',tag]);
