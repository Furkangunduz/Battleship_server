//rooms = 
//{                p1                                   p2
//     roomName :[[ıd,username,board,isReady,isTurn] , [ıd,username,board,isReady,isTurn]]]
//}

var rooms = {};
var users = {}

const addUser = (socketID, userName) => {
    users[socketID] = userName
}

const removeUser = (socketID) => {
    delete users[socketID]
}


const createRoom = (roomName, userId, userName,) => {
    rooms[roomName] = [[userId, userName, "", "", true]];
};

const joinRoom = (roomName, userId, userName) => {
    if (rooms[roomName].length == 2) return
    rooms[roomName].push([userId, userName, "", "", false])
};

const saveMapToUser = ({ gameBoard, roomName, socketID }) => {
    rooms[roomName]?.forEach(element => {
        if (element[0] == socketID) {
            if (gameBoard) {
                element[2] = gameBoard;
            }
        }
    });
}

const setPlayerReady = (userName, roomName) => {
    rooms[roomName].forEach(player => {
        if (player[1] == userName) {
            player[3] = true
        }
    });
}

const isPlayersReady = (roomName) => {
    if (rooms[roomName]?.length == 2) {
        if (rooms[roomName][0][3] && rooms[roomName][1][3]) {
            let isPlayer1Ready = rooms[roomName][0][3]
            let isPlayer2Ready = rooms[roomName][1][3]

            if (isPlayer1Ready && isPlayer2Ready) {
                console.log("Two player is  ready")
                return true
            }
        }
    }
    return false
}

module.exports = { rooms, users, createRoom, joinRoom, saveMapToUser, isPlayersReady, setPlayerReady, addUser, removeUser };