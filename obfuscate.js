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
	identifiersPrefix: 'RzDev',
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

function formatDate() {
	let now = new Date();
	let year = now.getFullYear()
	let month = (now.getMonth() + 1)
	let date = now.getDate()
	let hour = now.getHours()
	let minute = now.getMinutes()
	let second = now.getSeconds()
	
	let ap = "AM";
    if (hour   > 11) { ap = "PM";             }
    if (hour   > 12) { hour = hour - 12;      }
	if (hour   == 0) { hour = 12;             }
	if (hour   < 10) { hour   = "0" + hour;   }
	if (minute < 10) { minute = "0" + minute; }
	if (second < 10) { second = "0" + second; }
	
    return `${year}/${month}/${date} ${hour}:${minute}:${second} ${ap}`;
}

function obfuscate(targetPath, savePath, isNode) {
	fs.readFile(targetPath, 'utf8', (err, data) => {
		if (err) {
			//console.error('讀取檔案時發生錯誤：', err)
			return false
		}
		
		let _isNode = (isNode === "1") ? true : false;
		obfuscateConfig.target = (_isNode != undefined && _isNode == true) ? "node" : "browser"

		const obfuscationResult = JavaScriptObfuscator.obfuscate(data, obfuscateConfig)
		let time = formatDate()
		let writeText = `// Make By Rz#9978 ${time}\n\n${obfuscationResult.getObfuscatedCode()}`
		fs.writeFile(savePath, writeText, (err) => {
		  if (err) {
			//console.error('寫入文件時發生錯誤：', err);
			return false
		  }
		  
		  return true
		});
	});

	return true
}

function readFilesRecursively(targetPath, savePath, isNode) {
  const files = fs.readdirSync(targetPath);

  files.forEach((file) => {
    const filePath = path.join(targetPath, file);

    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (path.extname(file) === '.js') {
		console.log(obfuscate(filePath, path.join(savePath, file), isNode))
      }
    } else if (stat.isDirectory()) {
      readFilesRecursively(filePath, savePath);
    }
  });
}

function start() {
	readFilesRecursively(options["targetPath"], options["savePath"], options["isNode"]);
}

start()
