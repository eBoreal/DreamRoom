const http = require("http");
const axios = require('axios');
const path = require('path')

const express = require("express");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const banana = require("@banana-dev/banana-dev")


//   banana 
require('dotenv').config()
apiKey = process.env.BANANA_API_KEY
modelKey = process.env.BANANA_MODEL_KEY
just_test_img = process.env.JUST_TEST_IMAGE
use_local = process.env.USE_LOCAL

const  makeMessageObject = (clientMessage, mlResponse) => {
    return {
        body: {
            imageUrl: mlResponse.imageUrl,
            imageName: clientMessage.imageName, 
            imageType: clientMessage.imageType},
        id: "server-id"
     }
}

const makeModelInputObject = (messageBody) => {
    return {
        'prompt': messageBody.prompt,
        'image': messageBody.imageUrl,
        'num_inference_steps': Math.min(messageBody.inference_steps, 50),
        'image_guidance_scale': messageBody.image_cfg_scale,
        'prompt_guidance_scale': messageBody.prompt_guidance_scale,
        'seed': messageBody.seed,
        'randomize_cfg': messageBody.randomize_cfg,
        'randomize_seed': messageBody.randomize_seed,
        'test_mode': just_test_img
    }

}

const runInference = async (messageBody, socket) => {
    const modelInputs = makeModelInputObject(messageBody)

    var response;
    try {
        console.time()
        if (!use_local) {
            out = await banana.run(apiKey, modelKey, modelInputs)
            response = makeMessageObject(messageBody, out)
        } else {
            const req = await axios.post('http://localhost:8000', modelInputs).catch(err => {
                if (err.response) {
                    throw `server error: status code ${err.response.status}`
                } else if (err.request) {
                    throw 'server error: endpoint busy or not available.'
                } else {
                    console.log(err)
                    throw "Misc axios error. Please email erik@banana.dev with above error"
                }
            })
            const jsonOut = req.data
            response = makeMessageObject(messageBody, jsonOut)
        }
        console.timeEnd()

    } catch (e) {
        console.log(e)
        response = {
            body: {
                prompt: "Server failed",
                error: e
            },
            id: "server-id"
        }
    }

    socket.emit("job result", response)
}

// each socket that gets created from a connection event
// gets a specific id
// communication is only client-server and never client-client
io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", messageObject => {
        // notify user we are generating the image
        socket.emit("job queued", messageObject)

        // call inference
        runInference(messageObject.body, socket)


    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "remod-client", "build", "index.html"));
  }
  )

server.listen(8000, () => console.log("server is running on port 8000"));