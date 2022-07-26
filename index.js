const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3001

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const { battleShipMapValidator, isGameFinish } = require("./battleShip")
const {
    rooms,
    users,
    createRoom,
    joinRoom,
    saveMapToUser,
    isPlayersReady,
    setPlayerReady,
    addUser,
    removeUser } = require('./server-functions');


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log(rooms)
    socket.on("create_room", ({ roomName, userName }) => {
        if (rooms[roomName]) {
            socket.emit("room_already_exist")
            console.log(`${userName} :  ${roomName} Room already exit.`)
            return
        }
        socket.emit("room_successfuly_created")
        socket.join(roomName)
        createRoom(roomName, socket.id, userName)
        addUser(socket.id, userName)
        console.log(`${userName} :  ${roomName} room created.`)
    })

    socket.on("join_room", ({ roomName, userName }) => {
        if (rooms[roomName]) {
            if (rooms[roomName].length == 2) {
                socket.emit(`room_is_full`)
                console.log(`${userName} : ${roomName} room is full.`)
                return
            }
            socket.emit("succesfully_joined")
            socket.join(roomName)
            joinRoom(roomName, socket.id, userName)
            addUser(socket.id, userName)
            console.log(`${userName} joined to ${roomName}`)
        } else {
            console.log(`${userName} : ${roomName} room not exist  `)
            socket.emit(`room_not_exist`)
        }

    })

    socket.on("waiting_for_opponent", ({ userName, roomName }) => {
        if (rooms[roomName]) {
            setPlayerReady(userName, roomName)
        }

        if (isPlayersReady(roomName)) {
            io.to(roomName).emit("players", [[rooms[roomName][0][1], rooms[roomName][0][4]], [rooms[roomName][1][1], rooms[roomName][1][4]]])
            setTimeout(() => {
                io.to(roomName).emit("start_battle")
            }, 5000)
        }
    })

    socket.on("board_validation", (board) => {
        socket.emit("board_validation", { result: battleShipMapValidator(board) })
    })

    socket.on("save_map", ({ gameBoard, roomName }) => {
        if (gameBoard) saveMapToUser({ gameBoard, roomName, "socketID": [socket.id] })

    })


    socket.on("fire", ({ player, pos }) => {

        let { roomName, userName } = player;
        let { x, y } = pos

        x -= 1;
        y -= 1;


        let isValidFire;
        let attackerIndex;
        let defenderIndex;

        rooms[roomName]?.forEach((player, ındex) => {
            if (player[1] == userName) {
                if (player[4] == true) {
                    attackerIndex = ındex
                    isValidFire = true
                }
                else {
                    isValidFire = false
                    socket.emit("not_your_turn")
                    return;
                }
            } else {
                defenderIndex = ındex
            }
        })

        if (isValidFire) {
            if (rooms[roomName]) {
                let defenderBaord = rooms[roomName][defenderIndex][2];
                let defenderName = rooms[roomName][defenderIndex][1]
                let attackerBoard = rooms[roomName][attackerIndex][2]
                let attackerName = rooms[roomName][attackerIndex][1]

                //if hit have one more chance.
                if (defenderBaord[y][x] == "1") {
                    defenderBaord[y][x] = "3"
                }
                //if miss change turn.
                if (defenderBaord[y][x] == "0") {
                    defenderBaord[y][x] = "4"
                    rooms[roomName][defenderIndex][4] = true
                    rooms[roomName][attackerIndex][4] = false
                }

                if (isGameFinish(defenderBaord)) {
                    io.to(roomName).emit("game-finish", attackerName)
                }

                let afterChangeTurn_Attacker = rooms[roomName][attackerIndex][4]
                let afterChangeTurn_Defender = rooms[roomName][defenderIndex][4]


                io.to(roomName).emit("new_map", [[attackerName, attackerBoard, afterChangeTurn_Attacker], [defenderName, defenderBaord, afterChangeTurn_Defender]])
                console.log("new_map\n",
                    attackerName, ":", attackerBoard, "\n",
                    defenderName, ":", defenderBaord, "\n")
            }

        }

    })
    socket.on("disconnect", () => {
        console.log(users[socket.id], "leave")
        for (const [roomName, players] of Object.entries(rooms)) {
            players.forEach((player, index) => {
                if (player[1] == users[socket.id]) {
                    io.to(roomName).emit("opponent-left")
                    removeUser(socket.id)
                    delete rooms[roomName]
                }
            })
        }
    })


});
server.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON " + PORT);
});