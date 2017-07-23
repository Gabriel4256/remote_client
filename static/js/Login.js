/* Login을 웹페이지에서 '연결' 이라는 버튼을 눌렀을 때, 특정 라우터로 포스트요청이 들어가면서 거기에서 TCP Server가 여기에 아이디와 비밀번호를 담은 객체를
   보내서 여기에 저장된 객체의 정보와 일치하는지 여부를 확인하는 방식으로 구현 */
var socketInfo;


/* tcp socket generating */
chrome.sockets.tcp.create({}, function(createInfo){
	chrome.sockets.tcp.connect(createInfo.socketId, "localhost", 4002, function(){	//따로 만든 tcp서버에 연결하여 tcp socket을 만듬
		console.log("Tcp connected");
		console.log(createInfo);
		socketInfo = createInfo;
	})
})

/* tcp소켓을 통해 메세지를 보낼 때 사용하는 함수(귀찮은 변환 과정을 함수로 만듬) */
function sendMsg(msg){
	chrome.sockets.tcp.send(socketInfo.socketId, stringToArrayBuffer(JSON.stringify(msg)), function(sendInfo){
		console.log("sent: " + sendInfo);
	});
}

/* data type transformation: arrayBuffer is binary type chrome socket using */
function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}
function stringToArrayBuffer(str){
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this needs encoding, like UTF-8");
    }
    var arr = new Uint8Array(str.length);
    for(var i=str.length; i--; )
        arr[i] = str.charCodeAt(i);
    return arr.buffer;
}
