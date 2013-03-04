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
objectEventHandler( o("rs"), "click", reverseStop );
//=================================================
objectEventHandler( o("fs"), "click", forwardStop );
//=================================================
objectEventHandler( o("match"), "keyup", search );
//=================================================
objectEventHandler( o("match"), "change", search );
//=================================================
objectEventHandler( document.body, "keydown", step );
//=================================================
objectEventHandler(o("btnClear"), "click", clearSearch );
//=================================================
objectEventHandler(o("field6"), "click", function(){email(6);} );
//=================================================
objectEventHandler(o("field7"), "click", function(){email(7);} );
//=================================================
objectEventHandler(o("field6"), "mouseover", function(){pointer("field6");} );
//=================================================
objectEventHandler(o("field7"), "mouseover", function(){pointer("field7");} );
//=================================================
objectEventHandler(o("field6"), "mouseout", function(){pointer("field6");} );
//=================================================
objectEventHandler(o("field7"), "mouseout", function(){pointer("field7");} );
//=================================================
objectEventHandler(o("field8"), "click", function(){dialNumber("field8");} ); //homephone
//=================================================
objectEventHandler(o("field8"), "mouseover", function(){pointer("field8");} ); //homephone
//=================================================
objectEventHandler(o("field8"), "mouseout", function(){pointer("field8");} ); //homephone
//==============Forward Button Handler=============
function forward(){
    if ( notTooFar() ) pointToNextRecord();
    else pointToFirstRecord();
    nowShowRecord();
}
//----------Details of forward button handler-------
function notTooFar(){
    if ( o("match").value === ""  ){
        if ( recordPointer +1 < recordCount ) return true;
        else return false;
    }
    else{
        if ( indexPointer +1 < matchCount) return true;
        else return false;       
    }
}
//-------------------------------------------------
function pointToNextRecord(){
    if( o("match").value === "" ){
        recordPointer++;
    }
    else{
        recordPointer = matchIndexes[++indexPointer];
    }
}
//-------------------------------------------------
function pointToFirstRecord(){
    if( o("match").value === "" ){
        recordPointer = 1;
    }
    else{
        indexPointer = 0;
        recordPointer = matchIndexes[indexPointer];    
    }
}
//------------------------------------------------
function nowShowRecord(){
    var record = records[recordPointer].split(",");
    o("field0").value = record[0];
    for( var i = 1; i< record.length; i++ ) {
        o("field"+i.toString()).value = " " + record[i];
    }
    o("c").innerHTML = recordPointer;
    if( matchCount != 0 ){
        o('matchIndex').innerHTML = indexPointer +1;
        o('sp').innerHTML = singularPlural("match", matchCount)+" ";
    }    
}
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
        callAfterMilliseconds(fastForward, delay);//setTimeout(fastForward, delay);
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
        o("match").focus();
        matchCount = 0;
        o('sp').innerHTML = singularPlural("match", matchCount)+" ";        
        currentMatch = ""
        return;
    }
    //---------------------------------------------
    if ( (typeof window.event != undefined) && window.event.keyCode === 13 ){ 
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
    o('sp').innerHTML = singularPlural("match", matchCount)+" ";   
    currentMatch = o("match").value.toLowerCase();
    
    indexPointer = 0;    
    if ( matchCount !== 0 ){
        recordPointer = matchIndexes[0];
        o('matchIndex').innerHTML = "1";
        o('sp').innerHTML = singularPlural("match", matchCount)+" ";
        nowShowRecord();
    }
    else{
        o('matchCount').innerHTML = "0";
        o('sp').innerHTML = "matches ";
        o('matchIndex').innerHTML = "0";
    }
    o('matchCount').innerHTML = matchCount.toString();
    o('sp').innerHTML = singularPlural("match", matchCount)+" ";    
    //return false;
}
//=================================================
function matchFound(n){
    return records[n].toLowerCase().indexOf(o("match").value.toLowerCase() ) != -1;
}
//=================================================
function clearSearch(){
    o("match").value = "";
    o("btnClear").focus();
    o('matchCount').innerHTML = "0"
    o('sp').innerHTML = singularPlural("match", matchCount)+" ";    
    o('sp').innerHTML = "matches ";
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
function senseChange(){
 if (o("match").value.toLowerCase() !== currentMatch.toLowerCase()) search();
 callAfterMilliseconds(senseChange,300);
}
//===============================================
//senseChange();
//=================================================
function init(){
    o("match").focus();
    ajax.open("GET", "https://dl.dropbox.com/u/21142484/StudentNames/StudentsCV.csv", true );
    ajax.onreadystatechange = function() {
        if ( ajax.readyState == 4 ){
            if ( ajax.status == 200 || ajax.status == 0 ){
                records = ajax.responseText.split("\r");
                recordCount = records.length;
                o("c").innerHTML = recordPointer;
                o("m").innerHTML = recordCount - 1;
                nowShowRecord();
            }
            else { 
                if ( confirm("Trouble getting Data remotely.\r\rClick OK to try again.") ) init();                
            }            
        }      
    };
    ajax.send(null);
}
//===============================================
function email(num){
    if ( confirm("OK to send email?") ){
        document.location.href = "mailto:"+
        o('field2').value+
        " "+
        o('field1').value+
        " "+
        "<"+
        o("field"+num).value.trim()+
        "> ?"+
        "cc="+o( ( num == 6 ) ? "field6" : "field7" ).value;       
    }
}
//==============================================
function singularPlural(word,count){
    return ((count == 1)?word:word+"es");
}
//===============================================
function deselect(){
    //alert("typeof document.selection.empty(): "+typeof document.selection.empty())
    try{
        if ( typeof document.selection.empty() == "function" ){
        document.selection.empty();
        }
    }
    catch(e) {window.getSelection().removeAllRanges();}
}
/*
For the problematic browser:
document.selection.empty();
For other browsers:
window.getSelection().removeAllRanges();
//-----------------------------------------------
// clever: univeral event type identifier
function eventType() {
	if (!e) var e = window.event;
	return e.type;
}
*/
//===============================================
function eventType() {
	if ( !e ) var e = window.event;
	return e.type;
}
//===============================================
function pointer(id){
    if ( eventType() == "mouseover" ){
        o(id).select();
        o(id).style.cursor="pointer";
    }
    else if ( eventType() == "mouseout" ){
        deselect();
        o(id).style.cursor="default"; 
    }
}
//===============================================
function dialNumber(id){
if ( confirm("OK to Dial Number?") ){
        document.location.href = "tel:+1-" + o(id).value.trim(); 
    }
}
//===============================================















