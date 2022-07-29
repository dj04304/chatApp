//로그인 시스템 대신 임시방편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

//SSE 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.sender === username) { //로그인 유저가 보낸 메시지
        //파란박스(오른쪽)
        initMyMessage(data);
    }else {
        //회색박스(왼쪽)
        initYourMessage(data);
    }
}

// 메세지를 보냈을 때, 화면에 메세지를 띄워주는 function (파란박스 오른쪽)
function getSendMsgBox(data) {

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md


    return `
    <div class="sent_msg">
        <p>${data.msg}</p>
        <span class="time_date"> ${convertTime}  / <b>${data.sender}</b></span>
    </div>
    `
}

// 메세지를 보냈을 때, 화면에 메세지를 띄워주는 function (회색박스 왼쪽)
function getReceiveMsgBox(data) {

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `
    <div class="received_withd_msg">
        <p>${data.msg}</p>
        <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
    </div>
    `
}

//최초 초기화될 때, 1번방 3건이 있으면 3건을 다 가져온다.
// addMessage() 함수 호출 -> DB에 insert 되고, 그 데이터가 자동으로 Flux된다.(SSE)

//보내는 메시지 (파란박스) 초기화하기
function initMyMessage(data) {
    //alert("click")
    let chatBox = document.querySelector("#chat-box");
    // console.log(msgInput.value);
    
    let sendBox = document.createElement("div");
    
    sendBox.className= "outgoing_msg";

    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    //화면이 다차고 스크롤이 생길 때, 아래로 내려가게끔 해주는 기능
    document.documentElement.scrollTop = document.body.scrollHeight;
}

// 받는 메시지 (회색박스) 초기화하기
function initYourMessage(data) {
    //alert("click")
    let chatBox = document.querySelector("#chat-box");
    // console.log(msgInput.value);
    
    let receivedBox = document.createElement("div");
    
    receivedBox.className= "received_msg";

    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);

    //화면이 다차고 스크롤이 생길 때, 아래로 내려가게끔 해주는 기능
    document.documentElement.scrollTop = document.body.scrollHeight;
}

//비동기 함수로 바꿔준다.
//AJAX로 채팅 메시지를 전송(roomNum으로 전송)
async function addMessage() {

    //alert("click")
    let msgInput = document.querySelector("#chat-outgoing-msg")
    // console.log(msgInput.value);
    
    // 전송할 오브젝트 생성
    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    //통신이 오래 걸리기 때문에 먼저 null을 주고 기다려줌(아래가 먼저실행) let response = await fetch(localhost:~)
    fetch("http://localhost:8080/chat", {
        method: "post", //http post 메서드(새로운 데이터를 write)
        body: JSON.stringify(chat), //JS -> JSON 변환
        headers:{
            "Content-Type":"application/json; charset=utf-8"
        }
    });
    
    // console.log(response)

    // let parseResponse = await response.json();
    // console.log(parseResponse);


    // chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
    // chatBox.append(chatOutgoingBox);

    // 메세지 입력 후 비워주는 역할
    msgInput.value = "";
}




//버튼 클릭시 이벤트 (메시지 전송)
document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    addMessage();
});

//엔터 이벤트 (엔터 입력시 메시지 전송)
document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    //console.log(e.keyCode);
    if(e.keyCode == 13){
        addMessage();
        }
});


