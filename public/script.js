
const socket = io()
const videoGrid = document.getElementById('VideoGrid')
const myVideo = document.createElement('video')


var peer = new Peer(undefined,{
    path:'/peerjs',
    host : '/',
    port : '443'

})



myVideo.muted = true

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio :true
}).then(stream =>{
    myVideoStream = stream
    addVideoStream(myVideo,stream)
    
    peer.on('call',call =>{
        call.answer(stream)
        const video =document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        })
    })



    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream)
         
    })

    let msg = $('input')
$('html').keydown((e) => {
if(e.which == 13 && msg.val().length !== 0){
    // e.preventDefault()
    console.log(msg.val())
    socket.emit('message',msg.val())
    msg.val('')
    
}
})

socket.on('createmessage',message => {
$('ul').append(`<li><b class="UserT">User</b><br>${message}</li>`)
// scrollmsg()
})


})

peer.on('open', id=>{
    console.log(id)
    socket.emit('join-room',ROOM_ID,id)
})

//This part is used to call the other person
const connectToNewUser = (userId,stream) =>{
    // console.log('New User connected', userId)
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video, userVideoStream)
    } )
}

const addVideoStream = (video,stream) =>{
    video.srcObject = stream 
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}


//Now writing the function for scrolling messages
const scrollmsg = ()=>{
let x = $('message_window')
x.scrollTop(x.prop("scrollHeight"))
}

//now the code for the mute unmute button
const microphone = () =>{
const enabled = myVideoStream.getAudioTracks()[0].enabled
if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false
    unmuteMike()
}
else{
    muteMike()
    myVideoStream.getAudioTracks()[0].enabled = true
    
}
}

const unmuteMike = () =>{
    let changes = `
    <i class="red fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.mute').innerHTML = changes
}

const muteMike = () =>{
    let changes = `
    <i class=" fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.unmute').innerHTML = changes
}

const camera = () =>{
    
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false
       
        play()
    }
    else{
        stop()
        myVideoStream.getVideoTracks()[0].enabled = true
        
    }
    }


 const stop = () =>{
     
    const changes = `
    <i class=" fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.camonoff').innerHTML = changes
 }   

 const play = () =>{

    const changes = `
    <i class="red fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.camonoff').innerHTML = changes
 }   