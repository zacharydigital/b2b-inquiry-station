#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const args = new Set(process.argv.slice(2));

function printHelp() {
  console.log(`Local browser acceptance runner.

Usage:
  pnpm accept:local
  pnpm accept:local -- --headed

Behavior:
  - Reuses an existing server at BASE_URL when one is already running.
  - Otherwise starts pnpm dev -- --host 127.0.0.1.
  - Runs pnpm accept:visual and pnpm accept:rfq.
  - Stops only the dev server process it started.

Environment:
  BASE_URL  Local site URL. Default: http://127.0.0.1:4321
  HEADED=1  Pass through headed mode to the acceptance scripts.
`);
}

async function isServerReady(url) {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isServerReady(url)) return;
    await delay(500);
  }
  throw new Error(`Local server did not respond at ${url} within ${timeoutMs / 1000}s.`);
}

function runPnpm(scriptArgs) {
  const result = spawnSync('pnpm', scriptArgs, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`pnpm ${scriptArgs.join(' ')} failed with exit code ${result.status}.`);
  }
}

async function stopStartedServer(child) {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  const exited = await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    delay(5000).then(() => false),
  ]);
  if (exited === false && child.exitCode === null) child.kill('SIGKILL');
}

if (args.has('--help') || args.has('-h')) {
  printHelp();
  process.exit(0);
}

let serverProcess;

try {
  const alreadyRunning = await isServerReady(`${baseUrl}/`);

  if (!alreadyRunning) {
    serverProcess = spawn('pnpm', ['dev', '--', '--host', '127.0.0.1'], {
      stdio: 'inherit',
      env: process.env,
    });
    await waitForServer(`${baseUrl}/`);
  }

  const passThroughArgs = process.argv.slice(2);
  runPnpm(['accept:visual', ...passThroughArgs]);
  runPnpm(['accept:rfq', ...passThroughArgs]);

  console.log('\nLocal browser acceptance completed.');
} catch (error) {
  console.error(`\n${error instanceof Error ? error.message : 'Local browser acceptance failed.'}`);
  process.exitCode = 1;
} finally {
  await stopStartedServer(serverProcess);
}
