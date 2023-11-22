import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, List, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible";
import { SendOutlined } from "@ant-design/icons";
import { AudioOutlined, AudioTwoTone } from "@ant-design/icons";
import qizi from "./assets/qizi.png";
import nick from "./assets/nick.png";
import others from "./assets/qizi1.png";
import moment from "moment";
import AudioCard from "./components/AudioCard";
const { TextArea } = Input;

function ChatBox({ onSend, messages, username }) {
  const [message, setMessage] = useState({ type: "", content: "" });
  const [recording, setRecording] = useState(false);

  const messageListRef = useRef(null);

  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef();
  let mediaRecorder = useRef(null);

  const handleMessageChange = (e) => {
    setMessage({ type: "text", content: e.target.value });
  };

  const handleSubmit = () => {
    onSend(message);
    setMessage({ type: "", content: "" });
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleUserType = (item) => {
    if (item.username === "qizi") {
      return (
        <li >
          <Comment
            author={item.username}
            avatar={<Avatar src={qizi} />}
            content={handleMessageType(item)}
            datetime={
              <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </li>
      );
    } else if(item.username === "nick") {
      return (
        <li style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Comment
            author={item.username}
            avatar={<Avatar src={nick} />}
            content={handleMessageType(item)}
            datetime={
              <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </li>
      );
    } else {
      <li style={{ display: "flex", flexDirection: "row-reverse" }}>
      <Comment
        author={item.username}
        avatar={<Avatar src={others} />}
        content={handleMessageType(item)}
        datetime={
          <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
      />
    </li>
    }
  };

  const handleMessageType = (item) => {
    switch (item.type) {
      case "audio":
        return (
          <audio src={item.content} controls ref={audioRef}></audio>
        );
      default:
        return (
          <p>{item.content}</p>
        );
    }
  };

  const startRecording = () => {
    setRecording(true);
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.start();
          const audioChunks = [];
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
          mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("audioUrl", audioUrl);
            setAudioURL(audioUrl);
            onSend({ type: "audio", content: audioUrl });
          };
        })
        .catch((err) => console.log(err));
    }
    console.log("voice start");
  };

  const endRecording = () => {
    setRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    console.log("voice stop");
  };

  const handleVoiceClick = () => {
    if (!recording) {
      return <AudioOutlined onClick={startRecording} />;
    } else {
      return <AudioTwoTone onClick={endRecording} />;
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ width: "600px" }}>
      <div
        ref={messageListRef}
        style={{ height: "600px", overflow: "hidden", overflowY: "scroll" }}
      >
        <List
          dataSource={messages}
          renderItem={(item, index) => handleUserType(item)}
        />
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <Input
          rows={1}
          value={message.content}
          onChange={handleMessageChange}
          addonAfter={handleVoiceClick()}
          onPressEnter={handleEnterPress}
          style={{ width: "85%", marginRight: "10px" }}
        />
        <Button
          icon={<SendOutlined />}
          onClick={handleSubmit}
          style={{ width: "15%" }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default ChatBox;
