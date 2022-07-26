function battleShipMapValidator(field) {
    let count = 0;
    //check are there 17 block 
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (field[i][j] == "1") count++;
        }
    }
    if (count != 17) {
        return false;
    }
    let twoTileShipAmount = 1
    let threeTileShipAmount = 2;
    let fourTileShipAmount = 1;
    let fiveTileShipAmount = 1


    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (field[i][j] == "2") {
                let x = j;
                let y = i;

                if (++y <= 9 && ++x <= 9) {
                    if (field[y][x] != "0") {
                        console.log("26")
                        return false
                    }
                }
                x -= 2;
                if (y <= 9 && x >= 0) {
                    if (field[y][x] != "0") {
                        console.log("33")
                        return false
                    }
                }
            }

            if (field[i][j] == "1") {
                let x = j;
                let y = i;

                //check bottomleft and bottomright corners and righ

                if (++y <= 9 && ++x <= 9) {
                    if (field[y][x] != "0") {
                        console.log("47")
                        return false
                    }
                }
                x -= 2;
                if (y <= 9 && x >= 0)
                    if (field[y][x] != "0") {
                        console.log("54")
                        return false
                    }

                x = j;
                y = i;
                while (true) {
                    //go bottom to find lenght of ship
                    if (++y <= 9) {
                        if (field[y][x] == "1") {
                            //check right to is there any ship in contact

                            field[i][j] = "2";
                            field[y][x] = "2";

                            let count = 2;

                            while (field[++y >= 9 ? 9 : y][x] == "1") {
                                field[y][x] = "2";
                                count++;
                            }
                            switch (count) {
                                case 2:
                                    twoTileShipAmount--;
                                    break;
                                case 3:
                                    threeTileShipAmount--;
                                    break;
                                case 4:
                                    fourTileShipAmount--;
                                    break;
                                case 5:
                                    fiveTileShipAmount--;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    x = j;
                    y = i;

                    //go right to find lenght of ship
                    if (++x <= 9) {
                        if (field[y][x] == "1") {
                            //check bottom to is there any ship in contact
                            field[i][j] = "2";
                            field[y][x] = "2";

                            let count = 2;
                            while (field[y][++x >= 9 ? 9 : x] == "1") {
                                field[y][x] = "2";
                                count++;
                            }
                            switch (count) {
                                case 2:
                                    twoTileShipAmount--;
                                    break;
                                case 3:
                                    threeTileShipAmount--;
                                    break;
                                case 4:
                                    fourTileShipAmount--;
                                    break;
                                case 5:
                                    fiveTileShipAmount--;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    break;
                }
            }
        }
    }
    //check how many ship remain
    //if all amoun are 0 its valid board

    if (twoTileShipAmount != 0) return false
    if (threeTileShipAmount != 0) return false
    if (fourTileShipAmount != 0) return false
    if (fiveTileShipAmount != 0) return false
    return true;
}

function isGameFinish(field) {
    let count = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (field[i][j] == "3") count++;
        }
    }
    if (count == 17) {
        return true;
    }
    return false;

}


module.exports = { battleShipMapValidator, isGameFinish }