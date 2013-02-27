window.onload = function(){
//=========================DATA and OBJECTS=================
var btnGo = o('btnPwd');
var txtUser = o('txtUser');
var txtPwd = o('txtPwd');
var aryUsers = [];
//============================MISC=======================
  txtUser.focus();
  txtUser.value = "";
  txtPwd.value = "";
//========================HANDLERS==========================
  objectEventHandler( btnGo, "click", go );
//========================================================== 
  objectEventHandler( txtUser, "keyup", function(){
    if ( window.event.keyCode === 13 ) go();
  });
//==========================================================
 objectEventHandler( txtPwd, "keyup", function(){
    if ( window.event.keyCode === 13 ) go();
 });
//==========================================================
function go(){

    var publink = "https://dl.dropbox.com/u/21142484/StudentLookup/";
    var users = publink + txtPwd.value + "/usernames";
    var userAjax = new HttpObject();
    userAjax.open("GET",users,false);
    userAjax.send(null);
    if(userAjax.status !== 200 && userAjax !== 0){
      alert("Wrong Username and/or Password");
      txtPwd.focus();
      return;      
    }
    aryUsers=userAjax.responseText.split(":");      
    if(!chkUser()){
      alert("Wrong Username and/or Password");
      txtPwd.focus();
      return;
    }
    location.assign( "docs/StudentLookup.html" );
  }
//==========================check username=================
  function chkUser(){
    var flag = false;
    for(var i=0; i<aryUsers.length;i++){
      if(aryUsers[i].toLowerCase() === txtUser.value.toLowerCase()){
         if(aryUsers[i] !== ""){ 
          flag=true;
          break;
         }
      }
    }
    return flag;
  }//end of chkUser() 
//=============================================== 
};