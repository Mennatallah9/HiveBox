const fs = require('fs');

function printVersion() {
    const packageFile = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    console.log(`v${packageFile.version}`);
    process.exit(0);
}

printVersion();