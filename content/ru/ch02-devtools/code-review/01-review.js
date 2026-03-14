// Код для ревью: плохие практики в настройке проекта
// Найдите и объясните проблемы

var PORT = 3000
var HOST = "localhost"

function startServer(port, host) {
    var server = require('http').createServer()
    server.listen(port, host, function() {
        console.log("Server started at " + host + ":" + port)
        console.log("Debug info: " + JSON.stringify({port: port, host: host}))
    })
    return server
}

function loadConfig() {
    var fs = require('fs')
    var config = JSON.parse(fs.readFileSync('./config.json'))
    console.log(config)
    return config
}

var unusedVariable = "this is never used"

startServer(PORT, HOST)
