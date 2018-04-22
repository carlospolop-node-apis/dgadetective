const request = require('request');

// Check if domain is Hexadecimal
function isHex(domain){
    var h = domain.match(/[\dabcdef]+/i);
    if (h && h[0] == domain) return true;
    return false;
}

// Check if domain is a hash
function isHash(domain){
    var ih = isHex(domain);
    var lengths = [ 40, //sha1
                    32, //md5
                    64, //sha
                    128, //sha3
                    ]
    if (ih && domain.indexOf(domain.length) != -1) return true;
    return false;
}

// Check number of numbers
function checkNums(domain){
    var nums = domain.match(/\d/g);
    if (nums) return nums.length;
    return 0;
}

// Check low Frecuency letter
function checkLowFrecLets(domain){
    var let_frec = 0;
    var letters = ["z", "x", "j", "k", "q"]
    letters.forEach(function(letter){ // Check how many of each letter
        var indexes = domain.split('').map((e, i) => e === letter ? i : '').filter(String);
        if (indexes.length > 0) let_frec = indexes.length;
    });
    return let_frec;
}

// Check consonants
function checkConsonats(domain){
    arr_cons = domain.match(/[qwrtypsdfghjklzxcvbnm]{4}[qwrtypsdfghjklzxcvbnm]*/g);
    return (arr_cons) ? arr_cons : [];
}

//Check unique chars
function checkEntropy(domain){
    if (domain.length > 10){
        var uni_lets = [];
        domain.split('').forEach(function(letter){
            if (uni_lets.indexOf(letter) == -1) uni_lets.push(letter);
        });
        perct = uni_lets.length / domain.length;
        return perct;
    }
    else return 0;
}

//Check repeated chars
function checkRepeated(domain){
    letters = [];
    rep = []
    domain.split('').forEach(function(letter){
        if (letters.indexOf(letter) == -1){
            var indexes_len = domain.split('').map((e, i) => e === letter ? i : '').filter(String).length;
            rep.push(indexes_len);
            letters.push(letter);
        }
    });
    return rep;
}

/*
Algorithm to detect DGA statically:
    - If length > 10 --> Suspicious
    - If domain is Hex --> More suspicious
    - If domain is Hash --> Very suspicios
    (If this 3 are met, val > 100 --> is DGA)

    - If more than 3 numbers in domain
    - Check if low frecuency letters are contained
    - Check if more than 4 consonants together
    - Check if a char is repeated more than 4 times
    - Check if high entropy (with length > 10)
    - Check if records in Ecosia
*/

// Check if domain could be created using DGA
function checkDGASync(domain){
    var val = 0;

    if (domain.length > 10){ 
        val += domain.length * 1.5;
        ///-console.log("Domain length > 10: +" +val);
    }

    if (isHex(domain)){
        val += 30;
        ///-console.log("Is Hex: +30");
    }

    if (isHash(domain)){
        val += 30;
        ///-console.log("Is Hash: +30");
    }

    // Check if 4 or more numbers
    var nums = checkNums(domain);
    if (nums > 6){
        val += nums * 10;
        ///-console.log(nums+ " nums in the domain: +" +nums * 10);
    }
    else if (nums > 3){
        val += nums * 8;
        ///-console.log(nums+ " nums in the domain: +" +nums * 8);
    }

    // Check if low frecuency letters contained
    var let_frec = checkLowFrecLets(domain);
    if (let_frec > 0) ///-console.log("Low Frec letters contained: +" +let_frec*20);
    val += let_frec*20;

    // Check if several consonants together (+3)
    var arr_cons = checkConsonats(domain)
    arr_cons.forEach(function(cons){
        val += cons.length*8;
        ///-console.log("Consonants together: +" +cons.length*8);
    })

    //Check if several repetitions of a char
    checkRepeated(domain).forEach(function(num_rep){
        if (num_rep > 4){
            val += num_rep*num_rep*2;
            ///-console.log("-- Chars repeated: +" +num_rep*num_rep*2);
        }
    });

    var perct = checkEntropy(domain);
    if (perct > 0.75){ 
        val += 20;
        ///-console.log("Entropy: +25");
    }
    else if (perct > 0.80){ 
        val += 30;
        ///-console.log("Entropy: +35");
    }
    else if (perct > 0.90){ 
        val += 40;
        ///-console.log("Entropy: +50");
    }
    else if (perct > 0.95){ 
        val += 50;
        ///-console.log("Entropy: +60");
    }

    return val;
}

function checkDGA(domain){
    var promise = new Promise(function(resolve, reject) {
        var val = checkDGASync(domain);

        var url = "https://www.ecosia.org/search?q="+domain;
        request({url: url}, function (error, response, body) {
            if (error) reject(Error("Error checking duckduckgo: "+error));
            if (body){
                if (body.indexOf(">No results found<") != -1){
                    val += 50;
                    ///-console.log("No results in ecosia: +50");
                }
                resolve(val);
            }
        });
    });
    return promise;
}


function isDGAlowSync(domain){
    return checkDGA(domain) > 60 ? true : false;
}

function isDGAmediumSync(domain){
    return checkDGA(domain) > 100 ? true : false;
}

function isDGAhighSync(domain){
    return checkDGA(domain) > 150 ? true : false;
}

exports.checkDGA = checkDGA;

exports.checkDGASync = checkDGASync;
exports.isDGAlowSync = isDGAlowSync;
exports.isDGAmediumSync = isDGAmediumSync;
exports.isDGAhighSync = isDGAhighSync;


