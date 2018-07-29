/* eslint-env browser */           /* this stops the document error*/
/* eslint-disable no-console */    /* this stops the console error*/

function cAllClear() {
    // AC
    zeroValues();
    document.getElementById("total").textContent = "0";
    document.getElementById("outputTyped").textContent = "0";
    oldTotal = 0;
}

function cEqual() {
    if (displayInputString.length && !displayInputString.charAt(displayInputString.length-1).match(/[+x÷-]/)) {
        displayInputString = displayInputString.replace(/x/g, "*");  // replace all (global) occurances so eval works
        displayInputString = displayInputString.replace(/÷/g, "/");
        displayTotal = eval(displayInputString);
        if (!isFinite(displayTotal)) {
            displayTotal = "Divide by zero!";
        } 
        document.getElementById("total").textContent = displayTotal;
        // if you want to make this total available as the start of the next calc need to store it or...
        oldTotal = displayTotal;
        zeroValues();
    }
}

function cEnter() {
    document.getElementById("outputTyped").textContent = displayInputString;
    document.getElementById("total").textContent = "0";
    if (displayInputString=="0") {displayInputString = "";} 
}

function zeroValues() {
    displayTotal = 0;
    displayInputString = "";
}


function backSpacePressed() {
    // Del
    if (displayInputString.length <= 1) {displayInputString = "0"}
    else {
        displayInputString = displayInputString.slice(0, displayInputString.length-1);
    }
    cEnter();
}


function numberPressed(e) {
    var num;
    if (e.type == "click") {num = e.target.textContent;} else {num = e.key;}
    displayInputString += num;
    cEnter();   
}


function numPressed(e) {
    // test for zero being used properly. No double zeros or zero preceding numbers after an operator
    var prevChar = displayInputString.slice(-1);
    var prevPrevChar = displayInputString.slice(-2,-1);
    if(prevChar == "0" && (prevPrevChar == "x" || prevPrevChar == "-" || prevPrevChar == "÷" || prevPrevChar == "+")) {
    // not allowed to have more than one zero 
    } else {
        numberPressed(e);
    }        
}


function decimalPressed() {
    // test for multiple decimal points
    // if any of the previous characters back to an operator are . then don't allow
    i = displayInputString.length - 1;  
    if (i == -1) {displayInputString = "0."; }
    while (i>=0) {
        if (displayInputString.charAt(i).indexOf('.') != -1) {
            // last character is a . so no more . allowed
            break;   
        } else if (displayInputString.charAt(i).match(/[x+÷-]/) || i == 0) {
            // operator found so test if the string after the operator includes a .
            if (displayInputString.slice(i).indexOf('.') != -1) {
                break;
            }
            else { 
                displayInputString += ".";
                break;
            }     
        }
        i--;
    }
    cEnter();
}


function operatorPressed(e) {
    var op;
    if (e.type == "click") {op = e.target.textContent;} else {op = e.key;}
    if (op == "Multiply" || op == "*") {op="x";}
    if (op == "Divide" || op == "/") {op="÷";}
    if (op == "Add" || op == "+") {op="+";}
    if (op == "Subtract" || op == "-") {op="-";} // for completeness
    
    if (displayInputString == "") {
        // start with the old total
        displayInputString = oldTotal.toString();
    }
    
    if (displayInputString.charAt(displayInputString.length-1).match(/[+x÷-]/)) {  // allow change of operator
        displayInputString = displayInputString.slice(0, displayInputString.length-1);
    }
    if ( displayInputString.length == 0 && (op == "x" || op == "÷")) {
        // don't allow update if the first input character is a x or a ÷
    } else {
        displayInputString += op;
    }
    cEnter();
}


var displayTotal, displayInputString, oldTotal;
zeroValues();

// keyboard events
window.addEventListener('keydown', function(e) {   
    console.log("a key has been pressed");     
    if (e.key.match(/[0-9]/)) { numPressed(e); }   
    if (e.key == "Decimal" || e.key.match("\\.") ) { decimalPressed(e); }
    if (e.key == "Del") { cAllClear(); }
    if (e.key == "Backspace") { backSpacePressed(); } 
    if (e.key == "=" || e.key =="Enter") { cEqual(); }   
    if (e.key == "Add" || e.key == "+") { operatorPressed(e); }
    if (e.key == "Subtract" || e.key == "-") { operatorPressed(e); }
    if (e.key == "Multiply" || e.key == "*") { operatorPressed(e); }
    if (e.key == "Divide" || e.key == "/") { operatorPressed(e); } 
});


// number buttons
for (var i=0; i<10; i++) {
    document.getElementById("btn" + i).addEventListener('click', function(e) {
    numPressed(e);  
    });
}


document.getElementById("btnDecimal").addEventListener('click', decimalPressed);
document.getElementById("btnEquals").addEventListener('click', cEqual);
document.getElementById("btnCancel").addEventListener('click', cAllClear);
document.getElementById("btnDelete").addEventListener('click', backSpacePressed);


// operator buttons
var operatorLookup = ["Divide", "Multiply", "Subtract", "Add"];
for (i=0; i<operatorLookup.length; i++) {
    document.getElementById("btn" + operatorLookup[i]).addEventListener('click', operatorPressed);
}


document.getElementById("btnPlusMinus").addEventListener('click', function() {
    console.log("+/- pressed");
    // need to add a - (or toggle it off) before the first character of the last number entered (after the last operator) 

    i = displayInputString.length - 1;  
    while (i>=0) {
    
        if (displayInputString.charAt(i).match(/[0-9]/)) {  // need to check fo a . as well
            if (i==0) {
                displayInputString = "-" + displayInputString.slice(0); // first number. add the -
                break;
            }

        } else {
            // check which operator and if there is another operator behind it
            if (displayInputString.charAt(i).match(/[x+÷-]/)) {   // check needed. Clearer like this
                
                if (i==0) {
                    // first number - remove the -
                    displayInputString = displayInputString.slice(1);
                
                } else if (displayInputString.charAt(i) =="x" || displayInputString.charAt(i) =="÷") {
                    // adding - after x or ÷
                    displayInputString = displayInputString.slice(0, i+1) + "-" + displayInputString.slice(i+1);
                    
                } else if (displayInputString.charAt(i) =="-") {
                    // replacing -- with + (double negative)
                    displayInputString = displayInputString.slice(0, i) + "+" + displayInputString.slice(i+1);
                    
                } else if (displayInputString.charAt(i) =="+") {
                    // replacing + with -
                    displayInputString = displayInputString.slice(0, i) + "-" + displayInputString.slice(i+1);
                }
                
                break;
            }
        }
    i--;    
    }
    if (displayInputString == "") {displayInputString = "0"}
    cEnter();
});






