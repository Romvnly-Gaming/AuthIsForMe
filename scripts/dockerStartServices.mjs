import { exec } from 'child_process';

function execPromise(command) {
	return new Promise(function (resolve, reject) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(stdout.trim());
		});
	});
}

if (process.env.CI) {
	console.log('Not starting any Docker containers, CI mode is activated.');
} else {
	try {
		if (process.stdout.isTTY && process.env.GIT_PROXY?.includes('stackblitz')) {
			execPromise('docker compose up cache -d');
		} else {
			console.log('not tty or whatever, not starting any Docker containers');
		}
	} catch (e) {
		console.log(`SILENT ERROR: ${e.message}`);
	}
}
