const JavaScriptObfuscator = require('javascript-obfuscator')
const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2);
const options = {};

const obfuscateConfig = {
	optionsPreset: "high-obfuscation",
	target: "browser",
	send: 0,
	disableConsoleOutput: false,
	selfDefending: false,
	debugProtection: false,
	debugProtectionInterval: 0,
	ignoreImports: false,
	domainLock: [],
	domainLockRedirectUrl: 'about:blank',
	sourceMap: false,
	sourceMapBaseUrl: '',
	sourceMapFileName: '',
	stringArray: true,
	stringArrayRotate: true,
	stringArrayShuffle: true,
	stringArrayThreshold: 1,
	stringArrayIndexShift: true,
	stringArrayIndexesType: [
		'hexadecimal-number',
		'hexadecimal-numeric-string'
	],
	stringArrayCallsTransform: true,
	stringArrayCallsTransformThreshold: 1,
	stringArrayWrappersCount: 5,
	stringArrayWrappersType: 'function',
	stringArrayWrappersParametersMaxCount: 5,
	stringArrayWrappersChainedCalls: true,
	stringArrayEncoding: ["base64", "rc4"],
	splitStrings: true,
	splitStringsChunkLength: 5,
	unicodeEscapeSequence: false,
	forceTransformStrings: [],
	reservedStrings: [],
	identifierNamesGenerator: 'mangled',
	identifiersDictionary: [],
	identifiersPrefix: 'RzDev_',
	renameGlobals: true,
	renameProperties: false,
	renamePropertiesMode: 'safe',
	reservedNames: [],
	compact: true,
	simplify: true,
	transformObjectKeys: true,
	numbersToExpressions: true,
	controlFlowFlattening: true,
	controlFlowFlatteningThreshold: 1,
	deadCodeInjection: true,
	deadCodeInjectionThreshold: 1,
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg.startsWith("--")) {
    const optionName = arg.slice(2);
    
    if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      options[optionName] = args[i + 1];
      i++;
    } else {
      options[optionName] = true;
    }
  }
}

function obfuscate(targetPath, savePath) {
	fs.readFile(targetPath, 'utf8', (err, data) => {
		if (err) {
			//console.error('讀取檔案時發生錯誤：', err)
			return false
		}

		const obfuscationResult = JavaScriptObfuscator.obfuscate(data, obfuscateConfig)
		fs.writeFile(savePath, obfuscationResult.getObfuscatedCode(), (err) => {
		  if (err) {
			//console.error('寫入文件時發生錯誤：', err);
			return false
		  }
		  
		  return true
		});
	});

	return true
}


function readFilesRecursively(targetPath, savePath) {
  const files = fs.readdirSync(targetPath);

  files.forEach((file) => {
    const filePath = path.join(targetPath, file);

    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (path.extname(file) === '.js') {
		console.log(obfuscate(filePath, savePath))
      }
    } else if (stat.isDirectory()) {
      readFilesRecursively(filePath, savePath);
    }
  });
}

function start() {
	readFilesRecursively(options["targetPath"], options["savePath"]);
}

start()

