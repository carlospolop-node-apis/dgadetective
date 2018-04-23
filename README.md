# DGADetective

Check if a domain has been created using a Domain Generation Algorithm.
Usefull to discover malware and trackers.

## How Works

Algorithm to detect DGA:
+ Check if length > 10
+ Check if domain is Hex
+ Check if domain is Hash
+ Check if more than 3 numbers in domain
+ Check if low frecuency letters are contained
+ Check if more than 4 consonants together
+ Check if a char is repeated more than 4 times
+ Check if high entropy (with length > 10)
+ Check if records in [Ecosia](https://www.ecosia.org) (Only in the asynchronous version)

## Install
`npm install dgadetective`

## How to use

The function `checkDGA(DOMAIN)` will return a promise that will return a value. If this value is greater than 100, probably the domain was created using DGA.

### Asynchronous
```javascript
const dgadetective = require('dgadetective');

dgadetective.checkDGA("malwareworld").then(function(result){ 
        console.log(result);
    }, function(err) {
        console.log(err);
});
// Result: 18

dgadetective.checkDGA("google").then(function(result){ 
        console.log(result);
    }, function(err) {
        console.log(err);
});
// Result: 0

dgadetective.checkDGA("facebook").then(function(result){ 
        console.log(result);
    }, function(err) {
        console.log(err);
});
// Result: 20


dgadetective.checkDGA("ikaxbvtyuagnsub").then(function(result){ 
        console.log(result);
    }, function(err) {
        console.log(err);
});
// Result: 152.5

dgadetective.checkDGA("1ro5huh1gh8ilh1823i081rkpgd5").then(function(result){ 
        console.log(result);
    }, function(err) {
        console.log(err);
});
// Result: 272

```


### Synchronous

```javascript
const dgadetective = require('dgadetective');

console.log(dgadetective.checkDGASync("malwareworld"));
// Result: 18

console.log(dgadetective.checkDGASync("google"));
// Result: 0

console.log(dgadetective.checkDGASync("facebook"));
// Result: 20

console.log(dgadetective.checkDGASync("ikaxbvtyuagnsub"));
// Result: 102.5

console.log(dgadetective.checkDGASync("1ro5huh1gh8ilh1823i081rkpgd5"));
// Result: 222


console.log(dgadetective.isDGAlowSync("ikaxbvtyuagnsub"));
// Low version: Check if checkDGA > 60
// Result: true

console.log(dgadetective.isDGAmediumSync("ikaxbvtyuagnsub"));
// Medium version: Check if checkDGA > 100
// Result: true

console.log(dgadetective.isDGAhighSync("ikaxbvtyuagnsub"));
// High version: Check if checkDGA > 150
// Result: false

```
