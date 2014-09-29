#pragma strict
var username : String;
var password : String;
var invalidMess : String;
var loggedIn : boolean = false;
var loading : boolean = false;

var tempMatch : String = "admin";

function Start () {
DontDestroyOnLoad(this);
}

function Update () {

}

function OnGUI(){
	if (!loggedIn){
	GUI.Label(Rect((Screen.width/2)-60, (Screen.height/2)+50, 120, 25), invalidMess);
	GUI.Label(Rect((Screen.width/2)-150, Screen.height/2, 50, 25), "User");
	GUI.Label(Rect((Screen.width/2)-150, (Screen.height/2)+25, 50, 25), "Pass");
	username = GUI.TextField(Rect((Screen.width/2)-100, Screen.height/2, 200, 25), username);
	password = GUI.PasswordField(Rect((Screen.width/2)-100, (Screen.height/2)+25, 200, 25), password, "*"[0]);
		if (GUI.Button(Rect((Screen.width/2)-50, (Screen.height/2)+100, 100, 50), "Login")){
			if (username == tempMatch){
			loggedIn = true;
			loading = true;
			Application.LoadLevel(2);
			loading = false;
			}else{
			invalidMess = "Invalid User or Pass";
			}
		}
	}
	if (loading){
	GUI.Label(Rect((Screen.width/2)-60, (Screen.height/2)+50, 120, 25), "Loading Server Rooms");
	}
}