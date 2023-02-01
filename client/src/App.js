import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  InnerContainer,
  TextArea,
  ButtonBlue,
  ButtonGrey,
  Form,
  MyRow,
  MyMessage,
  PartnerRow,
  PartnerMessage,
  InputBox,
  ButtonDrop,
  PageUpload,
  ContainerUpload,
  PageChat,
  ContainerChat,
  SendButton
} from "./components/base_components.js"

import Alert from 'react-bootstrap/Alert';
import Image from "./components/Image.js"
import Dropzone from "./components/Dropzone.js";

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({});
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(); // for file upload

  // affect elems displayed
  const [initialRender, setInitialRender] = useState(true)
  const [chatStarted, setChatStarted] = useState(false);
  const [choseContinue, setchoseContinue] = useState(true);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const socketRef = useRef();

  // socket.io logic
  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("job queued", (serverMessage) => {
      receivedMessage(serverMessage);
      setLoading(true)
    })

    socketRef.current.on("job result", (serverMessage) => {
      // update message list
      receivedMessage(serverMessage);
      // update display
      setLoading(false)
      // add img to next message
      setMessage(prevState => (
        {...prevState, 
        imageUrl: serverMessage.body.imageUrl,
        imageName: serverMessage.body.imageName,
        imageType: serverMessage.body.imageType}));
    })
  }, []);

  // initialize first message and (fake) response
  // when an image is uploaded
  useEffect(() => {
    // skip initial page render
    if (!chatStarted && !initialRender) {
      const startMessage = {
        body: message,
        id: yourID,
      };
      const startResponse = {
        body: {prompt: "What can I do for you ?"},
        id: "from-client"
      }
      setMessages(oldMsgs => [...oldMsgs, startMessage, startResponse]);
    }
  }, [message])

  // render chat once the first message is added to the message list
  useEffect(() => {
    // skip intial page render
    if (initialRender) {
      setInitialRender(false)
    } else if (!chatStarted) {
      console.log("setting chat started")
      setChatStarted(true)
    }
  }, [messages])


  function receivedMessage(serverMessage) {
    setMessages(oldMsgs => [...oldMsgs, serverMessage]);
  }

  // send message to server with prompt and image
  function sendMessage(e) {
    e.preventDefault();
    if (message.prompt) {
      const messageObject = {
        body: message,
        id: yourID,
      };
      setMessage({});
      setPrompt("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  // encode to base64 and setMessage
  function handleUpload(acceptedFile) {
    
    if (acceptedFile.length == 0) {
      setError(true)
    } else {
      var file = acceptedFile[0]
      var reader = new FileReader();
      reader.onloadend = function() {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  
        setMessage(prevState => (
          {...prevState, 
          imageUrl: reader.result,
          image64: base64String,
          imageName: file.name,
          imageType: file.type}));
      }
      reader.readAsDataURL(file);
    }

  }


  function RenderInputBox() {
    return (
      <InputBox>
        <h2 className="text-center">Start from an image</h2>
        <Dropzone onDrop={handleUpload}/>
      </InputBox>
    )
  }

  function updatePrompt(e) {
    setPrompt(e.target.value);
    setMessage(prevState => (
      {...prevState, 
      prompt: e.target.value,
      num_inference_steps: 20,
      image_guidance_scale: 7,
      prompt_guidance_scale: 2,
      seed: 42,
      randomize_seed: true,
      randomize_cfg: false
      }));
  }
 
  function handleContinue() {
    setchoseContinue(true)
  }

  function RenderDecisionBox() {
    return (
      <InnerContainer>
          <ButtonGrey>Reset</ButtonGrey>
          <ButtonBlue onClick={handleContinue}>Continue to edit</ButtonBlue>
      </InnerContainer>
    )
  }

  
  function RenderChat() {
    return (
      messages.map((message, index) => {
        if (message.id === yourID) {
          return (
            <MyRow key={index}>
              {message.body.prompt ? 
                    <MyMessage> {message.body.prompt} </MyMessage>
                    : Image({imageUrl: message.body.imageUrl,
                     fileName: message.body.imageName})}
            </MyRow>
          )
        }
        return (
          <PartnerRow key={index}>
            
              {message.body.prompt ? 
              <PartnerMessage> {message.body.prompt} </PartnerMessage>
              : Image(message.body)}
            
          </PartnerRow>
        )
        })
    )
  }

  function RenderLoadingMessage() {
    return (
      <PartnerRow>
        <PartnerMessage>
          I am doing the editing, it should take about 10 to 20 seconds...
        </PartnerMessage>
      </PartnerRow>
    )
  }

  function RenderWrongFileType() {
    return (
      <Alert variant={"warning"}> DreamRoom only supports png, jpeg and jpg </Alert>
    )
  }

  // app rendering
  if (chatStarted) {
    return (
      <PageChat>
      <ContainerChat>
        <RenderChat/> 
        {choseContinue ? <></> : <RenderDecisionBox/>}
        {loading ? <RenderLoadingMessage/> : <></>}
      </ContainerChat>
      <Form onSubmit={sendMessage}>
        <TextArea value={prompt} onChange={updatePrompt} placeholder="Tell me how to edit the image..." />
        <SendButton>Send</SendButton>
      </Form>
    </PageChat>
    )
  } else {
    return (
      <PageUpload>
        <ContainerUpload>
          {error ? <RenderWrongFileType/> : <></>}
          <RenderInputBox/>
        </ContainerUpload>
      </PageUpload>
    );
  }

};

export default App;