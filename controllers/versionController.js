const fs = require('fs');

const getVersion = async (req, res) =>{
    try{
        const packageFile = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        res.status(200).json(`v${packageFile.version}`)
    }catch(error){
        res.status(500).json({
            message: "Error fetching the project version!",
            error: error.message
        })
    }
}

module.exports = getVersion;