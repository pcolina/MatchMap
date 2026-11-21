import { spawn } from 'node:child_process';
import { parseStartArgs } from './start-args.mjs';
import { buildServeArgs } from './start-command.mjs';

let options;
try {
  options = parseStartArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const child = spawn('ng', buildServeArgs(options), { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 1));
