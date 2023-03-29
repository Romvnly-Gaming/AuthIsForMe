import { fastify } from "fastify";
import { readFile } from "node:fs/promises";
import { ProjectReference } from "typescript";
import getRepoInfo from "git-repo-info";
import ciDetect from "@npmcli/ci-detect";
import isDocker from "is-docker";
import scanEnv from "scan-env";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import figlet from "figlet";
import chalk from "chalk";
import * as app from "./app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readJsonFile(path: string): Promise<Record<string, ProjectReference>> {
	const file = await readFile(path, "utf8");
	return JSON.parse(file);
}

const start = async () => {
	console.log(`Currently running in ${__dirname}`);
	if (process.env.NODE_ENV !== "production") {
		let name, version;
		try {
			const { name: packageName, version: packageVersion } = await readJsonFile("./package.json");
			name = packageName;
			version = packageVersion;
		} catch {
			name = process.env.npm_package_name || "auth-app";
			version = process.env.npm_package_version || "Unknown";
		}
		const gitInfo = getRepoInfo(),
			bannerText = `${figlet.textSync(`<${name}>`, {
				font: "ANSI Shadow",
				horizontalLayout: "default",
				verticalLayout: "default",
				width: 150,
				whitespaceBreak: true,
			})}\n`,
			gitText = chalk.yellowBright.bold(
				`Version: ${version}\n${chalk.blueBright(
					`Commit: ${gitInfo.abbreviatedSha} (${gitInfo.lastTag === "null" ? "unknown" : gitInfo.lastTag})\nAuthor: ${
						gitInfo.author
					} (${gitInfo.authorDate})\nMessage: ${gitInfo.commitMessage}\nCommits since tag: ${
						gitInfo.commitsSinceLastTag
					}\n${chalk.blueBright(`Branch: ${gitInfo.branch}`)}`
				)}`
			),
			warning =
				process.env.NODE_ENV !== "production" || gitInfo.branch !== "master"
					? chalk.redBright.bold("WARNING: This is a development build. Do not use in production.")
					: undefined,
			dockerWarning = chalk.redBright.bold(
				"Psst! Make sure you've set up your .env file and launched the database and redis containers!\nYou can do this with the command: docker compose up -d db db2 cache"
			),
			contextInfo = chalk.yellowBright.bold(
				`CI: ${ciDetect()}\nInside Docker?: ${isDocker() ? "YES!!" : "no🤡"}\nNODE_ENV: ${
					process.env.NODE_ENV
				}\nNODE_APP_INSTANCE: ${process.env.NODE_APP_INSTANCE}\nPORT: ${process.env.PORT}\nFASTIFY_PORT: ${
					process.env.FASTIFY_PORT
				}\n`
			);
		console.log(chalk.greenBright.bold.italic(bannerText));
		console.log(gitText);
		if (warning) console.log(warning);
		console.log(dockerWarning);
		console.log(contextInfo);
	}
	try {
		const scanResult = scanEnv("../../.env.example");

		if (scanResult.length > 0)
			console.error(`The following required environment variables are missing: ${scanResult.join(", ")}`);
	} catch (error) {
		console.error(error);
		console.error("failed to check if environment variables are missing, likely due to a missing .env.example");
	}

	const server = fastify({
		logger: {
			level: "info",
			transport: {
				target: "pino-pretty",
			},
		},
		trustProxy: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
		// Required: Enable TLS
		// https: true,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// Optional: Enable HTTP/2
		// http2: true
	});
	await server.register(app.fastify);
	// await server.register(fastifyTLS, {
	// 	// Optional (default: ./key.pem)
	// 	key: join(__dirname, 'certs', 'key.pem'),
	// 	// Optional (default: ./cert.pem)
	// 	cert: join(__dirname, 'certs', 'cert.pem'),
	// })

	// @ts-expect-error I honestly have no idea why this doesn't work
	// TODO: Remove all ts comments
	server.listen(
		{
			// Tip: Port 443 (HTTPS) requires root permissions. Use a port >1024.
			port: process.env.PORT || process.env.FASTIFY_PORT || "8443",
			host: "::",
		},
		(error, address) => {
			if (error) throw error;

			if (process.env.NODE_APP_INSTANCE === "0" || (!process.env.NODE_APP_INSTANCE && process.env.NODE_ENV !== "test"))
				server.log.info(`Server listening at ${address}`);
		}
	);
};
start();
