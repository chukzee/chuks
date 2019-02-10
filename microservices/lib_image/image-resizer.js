
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};

console.log('image resizer');

process.on('message', (msg) => {
  console.log('child --> ', msg)  ;
  const sum = longComputation();
  process.send(msg);
});