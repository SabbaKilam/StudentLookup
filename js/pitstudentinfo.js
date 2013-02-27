//==============DATA=======================
var ajax = new HttpObject()
, records = []
, recordCount = 0
, recordPointer = 1
, greenLight = true
, stepping = false
, delay = 100
, matchIndexes = []
, indexPointer = 0
, matchCount = 0
, currentMatch = ""
;
//==============Handlers and Functions=============
objectEventHandler( window, "load", init );
//=================================================
objectEventHandler( o("f"), "click", forward );
//=================================================
objectEventHandler( o("r"), "click", reverse );
//=========================================================
objectEventHandler( o("ff"), "mousedown", fastForward );
//---------------------------------------------------------
objectEventHandler( o("ff"), "mouseup", stopFastForward );
//---------------------------------------------------------
objectEventHandler( o("ff"), "mouseout", shortRedLight );
//=========================================================
objectEventHandler( o("fr"), "mousedown", fastReverse );
//---------------------------------------------------------
objectEventHandler( o("fr"), "mouseup", stopFastReverse );
//---------------------------------------------------------
objectEventHandler( o("fr"), "mouseout", shortRedLight );
//=========================================================
objectEventHandler( o("rs"), "click", reverseStop );
//=================================================
objectEventHandler( o("fs"), "click", forwardStop );
//=================================================
objectEventHandler( o("match"), "keyup", search );
//=================================================
objectEventHandler( document.body, "keydown", step );
//=================================================
objectEventHandler(o("btnClear"), "click", clearSearch );
//==============Forward Button Handler=============
function forward(){
    if ( notTooFar() ) pointToNextRecord();
    else pointToFirstRecord();
    nowShowRecord();
}
//----------Details of forward button handler-------
var notTooFar = function(){
    if ( o("match").value === ""  ){
        if ( recordPointer +1 < recordCount ) return true;
        else return false;
    }
    else{
        if ( indexPointer +1 < matchCount) return true;
        else return false;       
    }
};
//-------------------------------------------------
var pointToNextRecord = function(){
    if( o("match").value === "" ){
        recordPointer++;
    }
    else{
        recordPointer = matchIndexes[++indexPointer];
    }
};
//-------------------------------------------------
var pointToFirstRecord = function(){
    if( o("match").value === "" ){
        recordPointer = 1;
    }
    else{
        indexPointer = 0;
        recordPointer = matchIndexes[indexPointer];    
    }
};
//------------------------------------------------
var nowShowRecord = function(){
    var record = records[recordPointer].split(",");
    for( var i = 0; i< record.length; i++ ) {
        o("field"+i.toString()).value = " " + record[i];
    }
    o("c").innerHTML = recordPointer;
    if( matchCount != 0 ){
        o('matchIndex').innerHTML = indexPointer +1;
    }    
};
//=============Reverse Button Handler===========
function reverse(){
    if ( notTooFarBack() ) pointToPreviousRecord();
    else pointToFinalRecord();
    nowShowRecord();
}
//--------Details of Reverse  button handler-----
var notTooFarBack = function(){
    if ( o("match").value === "" ){
        if ( recordPointer - 1 > 0 ) return true;
        else return false;
    }
    else{
        if ( indexPointer - 1 >= 0 ) return true;
        else return false;
    }
};
//------------------------------------------------
var pointToPreviousRecord = function(){
    if( o("match").value === "" ){
        recordPointer--;
    }
    else{
        recordPointer = matchIndexes[--indexPointer];    
    }
};
//------------------------------------------------
var pointToFinalRecord = function(){
    if( o("match").value === ""  ){
        recordPointer = recordCount - 1;
    }
    else{
        indexPointer = matchCount-1;
        recordPointer = matchIndexes[matchCount-1];    
    }
};
//============fast forward=========================
function fastForward(){
    if(greenLight){
        forward();
        setTimeout(fastForward, delay);
    }
    else greenLight = true;        
}
//----------------Stop fast forward---------------
function stopFastForward(){
    greenLight = false;
}
//============fast reverse ========================
function fastReverse(){
    if(greenLight){
        reverse();
        setTimeout(fastReverse, delay);
    }
    else greenLight = true;
}
//------------Stop fast reverse--------------------
function stopFastReverse(){
    greenLight = false;   
}
//============Reverse Stop========================
function reverseStop(){
    pointToFirstRecord();
    nowShowRecord(); 
}
//=============Forward Stop========================
function forwardStop(){
    pointToFinalRecord();
    nowShowRecord();
}
//=================================================
function shortRedLight(){
    greenLight = false;
    setTimeout(function(){greenLight = true;},2*delay);
}
//=================================================
function search(){
    if ( o("match").value === "" ) {
        shortRedLight();
        clearSearch();
        matchCount = 0;
        currentMatch = ""
        return;
    }
    //---------------------------------------------
    if ( window.event.keyCode === 13 ){ 
        forward();
        return;
    }
    else if( o("match").value.toLowerCase() == currentMatch.toLowerCase() ){
        return;
    }
    matchCount = 0;
    matchIndexes.length = 0;
    for ( var i = 1; i < recordCount; i++){
        if ( matchFound(i) ) {
            matchIndexes.push(i);
            matchCount += 1;
        }
    }
    currentMatch = o("match").value.toLowerCase();
    
    indexPointer = 0;    
    if ( matchCount !== 0 ){
        recordPointer = matchIndexes[0];
        o('matchIndex').innerHTML = "1";
        nowShowRecord();
    }
    else{
        o('matchCount').innerHTML = "0"
        o('matchIndex').innerHTML = "0"
    }
    o('matchCount').innerHTML = matchCount.toString();
    //return false;
}
//=================================================
function matchFound(n){
    return records[n].toLowerCase().indexOf(o("match").value.toLowerCase() ) != -1;
}
//=================================================
function clearSearch(){
    o("match").value = "";
    o("match").focus();
    o('matchCount').innerHTML = "0"
    o('matchIndex').innerHTML = "0"
    indexPointer = 0;
    matchCount = 0;
}
//=================================================
function step(){
     if ( window.event.keyCode === 39 ) forward();
     else if( window.event.keyCode === 37 ) reverse();
}
//=================================================
function init(){
    o("match").focus();
    ajax.open("GET", "https://dl.dropbox.com/u/21142484/StudentNames/StudentsCV.csv", false);
    ajax.send(null);
    if ( ajax.status == 200 || ajax.status == 0 ){
        records = ajax.responseText.split("\r");
        recordCount = records.length;
        o("c").innerHTML = recordPointer;
        o("m").innerHTML = recordCount - 1;
        nowShowRecord();
    }
    else alert("Trouble getting Data remotely.");   
}
//==============================================




















