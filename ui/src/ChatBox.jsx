import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, List, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible";
import { SendOutlined } from "@ant-design/icons";
import {
  AudioOutlined,
  AudioTwoTone,
  VideoCameraOutlined,
} from "@ant-design/icons";
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
  const [videoUrl, setVideoURL] = useState("");
  const audioRef = useRef();
  const videoRef = useRef();
  let mediaRecorder = useRef(null);
  let mediaRecorderByVideo = null;
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
        <li>
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
    } else if (item.username === "nick") {
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
      </li>;
    }
  };

  const handleMessageType = (item) => {
    switch (item.type) {
      case "audio":
        return <audio src={item.content} controls ref={audioRef}></audio>;
      case "video":
        return (
          <div>
            <video
              src={item.content}
              controls
              playsInline
              id="videoRecorded"
            ></video>
          </div>
        );
      default:
        return <p>{item.content}</p>;
    }
  };

  const startRecording = () => {
    setRecording(true);
    setSuffix(
      <>
        <AudioOutlined
          onClick={endRecording}
          style={{
            fontSize: 16,
            color: "#1677ff",
          }}
        />
        <span></span>
        <VideoCameraOutlined
          onClick={startRecordingVideo}
          style={{
            fontSize: 16,
          }}
        />
      </>
    );

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

  const startRecordingVideo = async () => {
    setRecording(true);
    setSuffix(
      <>
        <AudioOutlined
          onClick={startRecording}
          style={{
            fontSize: 16,
          }}
        />
        <span></span>
        <VideoCameraOutlined
          onClick={endRecordingVideo}
          style={{
            fontSize: 16,
            color: "#1677ff",
          }}
        />
      </>
    );
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    mediaRecorderByVideo = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    const videoLive = document.querySelector("#videoLive");
    videoLive.style.display = "block";
    videoLive.srcObject = stream;
    mediaRecorderByVideo.start();
    console.log("video start");
  };

  const endRecording = () => {
    setSuffix(
      <>
        <AudioOutlined
          onClick={startRecording}
          style={{
            fontSize: 16,
          }}
        />
        <span></span>
        <VideoCameraOutlined
          onClick={startRecordingVideo}
          style={{
            fontSize: 16,
          }}
        />
      </>
    );
    setRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    console.log("voice stop");
  };

  const endRecordingVideo = () => {
    setSuffix(
      <>
        <AudioOutlined
          onClick={startRecording}
          style={{
            fontSize: 16,
          }}
        />
        <span></span>
        <VideoCameraOutlined
          onClick={startRecordingVideo}
          style={{
            fontSize: 16,
          }}
        />
      </>
    );

    mediaRecorderByVideo.stop();

    mediaRecorderByVideo.addEventListener("dataavailable", (event) => {
      onSend({ type: "video", content: `${URL.createObjectURL(event.data)}` });
    });

    setRecording(false);
    const videoLive = document.querySelector("#videoLive");
    videoLive.style.display = "none";
    console.log("video stop");
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const [suffix, setSuffix] = useState(
    <>
      <AudioOutlined
        onClick={startRecording}
        style={{
          fontSize: 16,
        }}
      />
      <span></span>
      <VideoCameraOutlined
        onClick={startRecordingVideo}
        style={{
          fontSize: 16,
        }}
      />
    </>
  );

  return (
    <div style={{ width: "800px" }}>
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
          suffix={suffix}
          value={message.content}
          onChange={handleMessageChange}
          onPressEnter={handleEnterPress}
          style={{ width: "85%", marginRight: "10px" }}
        />
        <Button onClick={handleSubmit} style={{ width: "15%" }}>
          Send
        </Button>
      </div>

      <video
        autoPlay
        muted
        playsInline
        id="videoLive"
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      ></video>
    </div>
  );
}

export default ChatBox;
