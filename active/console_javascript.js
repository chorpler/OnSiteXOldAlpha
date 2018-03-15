var roundMaxDecimals = function(value, decimals) { let string1 = value.toFixed(decimals); let num1 = Number(string1); return num1; };
var round = function(value, decimals) { let firstString = `${value}e${decimals}`; let firstNum = Math.round(Number(firstString)); let secondString = `${firstNum}e-${decimals}`; let secondNum = Number(secondString); return secondNum; };

