#!/usr/bin/env node

// Run "tsc" with watch, upon successful compilation run mocha tests.

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
        },
        "g": {
            alias: "grep",
            demand: false,
            default: undefined,
            describe: "Passed down to mocha: only run tests matching <pattern>",
            type: "string"
        },
        "f": {
            alias: "fgrep",
            demand: false,
            default: undefined,
            describe: "Passed down to mocha: only run tests containing <string>",
            type: "string"
        }
    })
    .help("h")
    .alias("h", "help")
    .argv;

var stdl = readline.createInterface({ input: process.stdin, });
stdl.on("line", line => {
    // TODO: handle "g <pattern>" or "f <pattern>" to run mocha with pattern
    // Ctrl + R may restart mocha test run?
});

var mochap = null;
var mochal = null;
var errors = 0;

function compilationStarted() {
    if (mochap) {
        mochap.kill("SIGINT");
    }
    mochap = null;
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

    var mocha_options = ["--opts", argv.opts, "--colors"].concat(argv._);
    if (argv.g) {
        mocha_options.push("-g");
        mocha_options.push(argv.g);
    }
    if (argv.f) {
        mocha_options.push("-f");
        mocha_options.push(argv.f);
    }
    mochap = spawn("node", [argv.mocha].concat(mocha_options));
    mochap.on("close", code => {
        if (code) {
            console.log(chalk.red("Exited with " + code));
        } else {
        }
        mochap = null;
        mochal = null;
    });
    mochal = readline.createInterface({ input: mochap.stdout });
    mochal.on("line", line => {
        console.log(line);
    });
}

var tscp = spawn("node", [argv.tsc, "-p", argv.project, "-w"]);
var tscl = readline.createInterface({ input: tscp.stdout });
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
