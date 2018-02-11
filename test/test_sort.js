
console.log(`${new Date(1518361390285)}`);
var time_remain = 2.33333332234 * 60* 1000;
var time_span = time_remain >= 60000 ? Math.round(time_remain / 60000) : Math.round(time_remain / 1000); //in minutes and seconds
var tm_str = time_remain >= 60000 ? (time_span > 1 ? 'minutes' : 'minute') : (time_span > 1 ? 'seconds' : 'second');
 
console.log('time_remain', time_remain); 
console.log('time_span', time_span);
console.log('tm_str', tm_str);

console.log(Math.round(1.5));