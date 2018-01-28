

//--- EVEN AND ODD NUMBER OF/PLAYERS-------
var players_count = 7;

var rounds = [];
var is_even = players_count % 2 === 0;
var half = players_count / 2;
if (!is_even) {
    half = (players_count + 1) / 2;
}

var arr1 = [];
var arr2 = [];
for (var i = 1; i < half + 1; i++) {
    arr1[i-1] = i;
    arr2[i-1] = i + half;
}

var EMPTY = '-';

if (!is_even) {// if old number of players then add a dummy player
    arr2[arr2.length - 1] = EMPTY;//DUMMY PLAYER - ANY PLAYER PAIRED WITH THIS DUMMY PLAYER WILL BE IDLE  ON THAT ROUND - ie will get a bye see https://en.wikipedia.org/wiki/Bye_%28sports%29
}

var total_rounds = arr1.length + arr1.length - 1;

for (var i = 0; i < total_rounds; i++) {
    var ls1 = arr1[arr1.length - 1];
    var ls2 = arr2[0];
    for (var k = 0; k < half; k++) {
        if (k < half - 1) {
            arr1[half - k - 1] = arr1[half - k - 2];
            arr2[k] = arr2[k + 1];
        } else {
            arr1[1] = ls2; // set the 2 index which is index 1 to the initial first index of the other half array
            arr2[k] = ls1;
        }
    }

    //one rotationg done
    console.log(arr1);
    console.log(arr2);
    console.log('--------------------');

}






