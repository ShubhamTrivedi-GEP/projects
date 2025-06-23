console.log('start');

setTimeout(function a() {
    console.log('a');
}, 1000);

setTimeout(function b() {
    console.log('b');
}, 500);

setTimeout(function c() {
    console.log('c');
}, 0);


function d() {}

d();

console.log('end');