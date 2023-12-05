/*聊天界面，所有对话的逻辑和声音的处理都在这里实现*/
import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, List, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible"; 
import { SendOutlined } from "@ant-design/icons";
import { AudioOutlined, AudioTwoTone } from "@ant-design/icons";
import qiqi from "./assets/qiqi.jpg";
import Lin from "./assets/Lin.jpg";
import moment from "moment";
const { TextArea } = Input;

function ChatBox({ onSend, messages, username }) {
  {/*在逐渐内部使用Hook管理组件的状态*/}
  //使用usestate定义本地状态变量
  const [message, setMessage] = useState({ type: "", content: "" });
  const [recording, setRecording] = useState(false);
  //使用useref定义了消息列表的应用
  const messageListRef = useRef(null);
  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef();
  let mediaRecorder = useRef(null);
  //处理消息变化
  const handleMessageChange = (e) => {
    setMessage({ type: "text", content: e.target.value });
  };
  //消息发送
  const handleSubmit = () => {
    onSend(message);
    setMessage({ type: "", content: "" });
  };
  //按下enter键
  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  //根据用户不同类型渲染不同内容的函数：
  const handleUserType = (item) => {
    if (item.username === "qiqi") {
      return (
        <li >
          <Comment
            author={item.username}
            avatar={<Avatar src={qiqi} />}
            content={handleMessageType(item)}
            datetime={
              <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </li>
      );
    } else if(item.username === "Lin") {
      return (
        <li style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Comment
            author={item.username}
            avatar={<Avatar src={Lin} />}
            content={handleMessageType(item)}
            datetime={
              <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </li>
      );
    } 
  };
  //对于音频信息和文本信息采用不同的处理方式，处理根据消息类型渲染不同内容
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
  //开始录音
  const startRecording = () => {
    //录音开始
    setRecording(true);
    //检查浏览器是否支持媒体设备的访问
    if (navigator.mediaDevices.getUserMedia) {
      //获取声卡输入流
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          //获取输入流后创建一个对象，并且开始录音
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.start();
          //在录音的过程中将录制的音频保存到数组audioChunks中,方便后续的处理
          const audioChunks = [];
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
          mediaRecorder.current.onstop = () => {
            //录音结束后将音频数据组合成Blob对象
            const audioBlob = new Blob(audioChunks);
            //创建一个用于播放该录音的URL
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
  //结束录音
  const endRecording = () => {
    setRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    console.log("voice stop");
  };
  //处理语言点击事件
  const handleVoiceClick = () => {
    if (!recording) {
      return <AudioOutlined onClick={startRecording} />;
    } else {
      return <AudioTwoTone onClick={endRecording} />;
    }
  };
  //使用 useEffect 监听 messages 变化，自动滚动到最新消息处
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  //返回一个JSX结构，渲染了聊天界面的各个部分
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
//将 ChatBox 组件导出
export default ChatBox;
