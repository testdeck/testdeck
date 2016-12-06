#!/usr/bin/env node

// Run "tsc" with watch, upon successful compilation run mocha tests.

declare var require;

var child_process = require("child_process");
var spawn = child_process.spawn;
var readline = require("readline");
var chalk = require("chalk");
var yargs = require("yargs");

var argv = yargs
    .options({
        "p": {
            alias: "project",
            demand: false,
            default: ".",
            describe: "Path to tsconfig file or directory containing tsconfig, passed to `tsc -p <value>`.",
            type: "string"
        },
        "t": {
            alias: "tsc",
            demand: false,
            default: "./node_modules/typescript/bin/tsc",
            describe: "Path to executable tsc, by default points to typescript installed as dev dependency. Set to 'tsc' for global tsc installation.",
            type: "string"
        },
        "o": {
            alias: "opts",
            demand: false,
            default: "./test/mocha.opts",
            describe: "Path to mocha.opts file containing additional mocha configuration.",
            type: "string"
        },
        "m": {
            alias: "mocha",
            demand: false,
            default: "./node_modules/mocha/bin/_mocha",
            describe: "Path to executable mocha, by default points to mocha installed as dev dependency.",
            type: "string"
        }
    })
    .help("h")
    .alias("h", "help")
    .argv;

var mocha = null;
var mochal = null;
var errors = 0;

function compilationStarted() {
    if (mocha) {
        mocha.kill("SIGINT");
    }
    mocha = null;
    mochal = null;
    errors = 0;
}
function foundErrors() {
    errors ++;
}
function compilationComplete() {
    if (errors) {
        console.log(chalk.red("TS errors!"));
        return;
    } else {
        console.log(chalk.gray("Run mocha."));
    }

    mocha = spawn("node", [argv.mocha, "--opts", argv.opts, "--colors"]);
    mocha.on("close", code => {
        if (code) {
            console.log(chalk.red("Exited with " + code));
        } else {
        }
        mocha = null;
        mochal = null;
    });
    mochal = readline.createInterface({ input: mocha.stdout });
    mochal.on("line", line => {
        console.log(line);
    });
}

var tsc = spawn("node", [argv.tsc, "-p", argv.project, "-w"]);
var tscl = readline.createInterface({ input: tsc.stdout });
tscl.on("line", line => {
    console.log(line);
    if (line.indexOf("Compilation complete.") >= 0) {
        compilationComplete();
    } else if (line.indexOf("File change detected.") >= 0) {
        compilationStarted();
    } else if (line.indexOf(": error TS") >= 0) {
        foundErrors();
    }
});
