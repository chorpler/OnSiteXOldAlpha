const fs = require('fs');                            // Node.js File System
const util = require('util');                        // Node.js utility
const _FLAGS = require('./config/constants').FLAGS;

let arrFlags = [];
let modHrs = [];
let modStrt = [];
let modEnd = [];

let arrStrt = [ , 19,  9, 11   ,  3.25, 16, 22  ];
let arrEnd =  [ , 21, 11, 14.25,  4   , 10, 23.5];
let arrHrs =  [ ,  2,  2,  3.25,   .75, 14,  1.5];

const A = arrStrt;
const B = arrEnd;
const C = modStrt;
const D = modEnd;
const E = modHrs;
const F = arrFlags;

let rprtHrs  = arrHrs.reduce((prev, curr) => prev + curr);
let tRptHrs: number;
let modRpHrs: number;
let tS1 = [];
let tE1 = [];
let tH1 = [];
let B1 = (rprtHrs > 17);
let B2: Boolean;
let B3: Boolean;
let B4: Boolean;

function tStEarrTest() {
  tS1[1] = arrStrt[1];
    if (arrStrt.length > 2) {
      for (let i = 1; i < arrStrt.length - 1; ++i) {
            if (arrStrt[i + 1] > arrStrt[i]) {
                    if (arrStrt[i + 1] - arrStrt[i] > 12) { tS1[i + 1] = arrStrt[i + 1] - 12; }
                    else { tS1[i + 1] = arrStrt[i + 1]; };
                  }
            if (arrStrt[i + 1] < arrStrt[i]) { tS1[i + 1] = arrStrt[i + 1] + 12; }
      }
      for (let i = 1; i < arrEnd.length; ++i) {
                if (arrEnd[i] < tS1[i]) { tE1[i] = arrEnd[i] + 12; }
                  else {
                    if (arrEnd[i] > tS1[i] && arrEnd[i] - tS1[i] > 12) {tE1[i] = arrEnd[i] - 12; }
                    else { tE1[i] = arrEnd[i]; }
                  }
      }
    }
    for (let i = 1; i < arrHrs.length; ++i) { tH1[i] = tE1[i] - tS1[i]; }
      tRptHrs  = tH1.reduce((prev, curr) => prev + curr);
}

function tStEarrRefine() {
  for (let j = 0; j < arrStrt.length; ++j) {
    for (let i = 1; i < tS1.length - 1; ++i) {
        if (tS1[i + 1] > tS1[i]) {
                if (tS1[i + 1] - tS1[i] > 12) { tS1[i + 1] = tS1[i + 1] - 12; }
                else { tS1[i + 1] = tS1[i + 1]; };
              }
        if (tS1[i + 1] < tS1[i]) { tS1[i + 1] = tS1[i + 1] + 12; }
    }
    for (let i = 1; i < tE1.length; ++i) {
              if (tE1[i] < tS1[i]) { tE1[i] = tE1[i] + 12; }
                else {
                  if (tE1[i] > tS1[i] && tE1[i] - tS1[i] > 12) {tE1[i] = tE1[i] - 12; }
                  else { tE1[i] = tE1[i]; }
                }
    }
  }
}

function runErrDetection() {
  for (let i = arrStrt.length - 1; i >= 1; i--) {
      modStrt[i] = arrStrt[i];
      modEnd[i]  = arrEnd[i];
      modHrs[i]  = arrHrs[i];
    }
  for (let j = 0; j < A.length; j++) {
    for (let i = 2; i < A.length; i++) {
      if (C[i] === D[i - 1] || C[i] - 1 === D[i - 1]) { C[i] = C[i]; }
        else {
          if (C[i] - D[i - 1] < 3 && C[i] - D[i - 1] > 0) { F.push(_FLAGS[6]); }
          else {
            if (C[i] - D[i - 1] >= 12 && C[i] - D[i - 1] < 15) { C[i] = C[i] - 12; }
              else {
                if ((C[i] - D[i - 1]) * -1 >= 12 && (C[i] - D[i - 1]) * -1 < 15 ) {D[i - 1] = D[i - 1] - 12; }
              }
          }
        }
    }
  }
  for (let i = 1; i < arrHrs.length; ++i) { E[i] = D[i] - C[i]; }
    modRpHrs  = E.reduce((prev, curr) => prev + curr);
}

if (B1) { tStEarrTest(); tStEarrRefine(); }

if (modRpHrs <= 17 && modRpHrs >= 7) { F.push[_FLAGS[4]], B3 = false, B2 = false; }
else { if (modRpHrs > 17 || modRpHrs < 7) { B3 = true, B2 = true; } else { B3 = false, B2 = true; } }

if (B2 || B3) { runErrDetection(); }

console.log('arrStrt: [' + arrStrt + ']');
console.log('arrEnd:  [' + arrEnd + ']');
console.log('tS1:     [' + tS1 + ']');
console.log('tE1:     [' + tE1 + ']');
console.log('modStrt: [' + modStrt + ']');
console.log('modEnd:  [' + modEnd + ']');
console.log('rprtHrs:  ' + rprtHrs);
console.log('tRptHrs:  ' + tRptHrs);
console.log('modRpHrs: ' + modRpHrs);
console.log('B2:  ' + B2);
console.log('B3:  ' + B3);
console.log('Flags:   [' + F + ']');
