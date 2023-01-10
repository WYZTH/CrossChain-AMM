var express = require('express');
var app = express();
app.use(express.static(__dirname));

const port = 8082;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`)
})
