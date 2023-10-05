import React from 'react';
import './App.css';
import { FiMessageSquare } from "react-icons/fi";
import { BiSolidHome, BiSolidBookmark, BiPlus, BiSolidSend, BiCopy } from "react-icons/bi";
import { IoRocketSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_SOME_API_KEY;

function App() {

  const [userText, setUserText] = useState("");
  const [chat, setChat] = useState([]);

  const chatRef = useRef();

  // To handle scoll on chat box
  useEffect(() => {
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  }, [chat])

  // To get chat response from ChatGpt
  const getChatGptAnswer = async () => {
    setChat([...chat, { text: userText, isBot: false }]);

    const API_URL = `https://api.openai.com/v1/completions`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: userText,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null
      })
    }
    setUserText("");

    try {
      const res = await fetch(API_URL, requestOptions);
      const answer = await res.json();
      setChat(chat => [...chat, { text: answer.choices[0].text.trim(), isBot: true }]);
    }
    catch (error) {
      setChat(chat => [...chat, { text: "Don't refresh the browser while getting the chat responce from ChatGpt, Please try again !", isBot: true }]);
      console.log("Error is : ", error);
    }
  }

  const handleEnterKey = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await getChatGptAnswer();
    }
  }

  // To handle query
  const handlequery = (query) => {
    if (query === "What is Programming") {
      const queryResponse = "Programming is the process of creating computer software, applications, and other digital solutions using a specific set of instructions or code. It involves designing, writing, testing, and maintaining code to instruct a computer to perform specific tasks or solve problems. Programming languages, such as Java, Python, and C++, are used to write these instructions and communicate with computers. Programmers use their knowledge of programming languages and problem-solving skills to create efficient and functional software that can be used for a variety of purposes. Programming is an essential skill in today's digital world and is used in various industries, including technology, finance, healthcare, and entertainment.";
      setChat([...chat, { text: query, isBot: false }, { text: queryResponse, isBot: true }]);
    } else {
      const queryResponse = "1. Understand the API documentation: The first step in using an API is to understand its documentation. This will provide information on the API's purpose, endpoints, parameters, and authentication methods. 2. Obtain an API key: Many APIs require an API key for authentication. This key is unique to each user and is used to identify and authorize requests to the API. 3. Choose a programming language: APIs can be used with a variety of programming languages, so choose the one that you are most comfortable with. 4. Make a request: Once you have your API key and chosen a programming language, you can make a request to the API. This typically involves constructing a URL with the appropriate endpoint and parameters. 5. Handle the response: After making a request, the API will send back a response. This response can be in various formats such as JSON, XML, or HTML. You will need to handle this response in your code to extract the desired information. 6. Test and troubleshoot: It is important to test your API requests and handle any errors or unexpected responses. This will ensure that your code is functioning correctly and that you are getting the desired data from the API. 7. Implement in your project: Once you have successfully tested and troubleshooted your API requests, you can implement them in your project. This could involve integrating the API data into your website or application, or using it to automate certain tasks. 8. Monitor and update: APIs are constantly evolving, so it is important to monitor any changes or updates to the API you are using. This may require making changes to your code to ensure it continues to function correctly.";
      setChat([...chat, { text: query, isBot: false }, { text: queryResponse, isBot: true }]);
    }
  }

  return (
    <>
      <div className="App">
        <div className="sidebar">
          <div className="upperContainer">
            <div className="logo">
              <img src="https://www.edigitalagency.com.au/wp-content/uploads/chatgpt-logo-black-png.png" alt="" />
              <span>ChatGpt</span>
            </div>
            <button className="chatBtn" onClick={() => { window.location.reload(); }}>
              <BiPlus className='icon' /> New Chat
            </button>
            <div className="askInfo">
              <button onClick={(e) => handlequery(e.target.value)} value="What is Programming">
                <FiMessageSquare className='chaticon' /> What is Programming ?
              </button>
              <button onClick={(e) => handlequery(e.target.value)} value="How to use API">
                <FiMessageSquare className='chaticon' /> How to use API ?
              </button>
            </div>
          </div>
          <div className="lowerContainer">
            <li><BiSolidHome className='listicon' /> Home</li>
            <li><BiSolidBookmark className='listicon' />Saved</li>
            <li><IoRocketSharp className='listicon' />Upgrade to Pro</li>
          </div>
        </div>

        <div className="main">
          <div ref={chatRef} className="chats">
            {
              chat.map((e, index) => {
                return (
                  <div key={index} className={e.isBot ? "chat response" : "chat"}>
                    <img src={e.isBot ? "https://www.edigitalagency.com.au/wp-content/uploads/chatgpt-logo-black-png.png" : "https://www.shareicon.net/data/512x512/2016/06/25/786525_people_512x512.png"} alt="" />
                    <p>{e.text}</p>
                    <button><BiCopy className='copyicon' /></button>
                  </div>
                );
              })
            }
          </div>
          <div className="chatFooter">
            <input type="text" placeholder='Enter prompt here' value={userText} onChange={(e) => setUserText(e.target.value)} onKeyDown={(e) => { userText === "" ? {} : handleEnterKey(e); }} required />
            <button style={userText === "" ? { visibility: "hidden" } : { visibility: "visible" }}><BiSolidSend className='messageicon' onClick={() => { userText === "" ? {} : getChatGptAnswer(); }} /></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
