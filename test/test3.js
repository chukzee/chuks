/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function run(n){
    console.log(n);
    setTimeout(function(){
        console.log(n);
    }, 1000);
}


run(1);
run(2);
run(3);
run(4);
run(5);
