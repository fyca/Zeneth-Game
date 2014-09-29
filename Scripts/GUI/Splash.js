#pragma strict
var timer : float;
var splashTex : Texture;
var startTimer : boolean;

function Start () {

}

function Update () {
if (startTimer){
timer += Time.deltaTime;
}
if (timer >= 5f){
startTimer = false;
}

}

function DisplaySplash(timer : float){
	startTimer = true;
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), splashTex);
	if (timer >= 5f){
//	if (GUI.Button(Rect((Screen.width/2)-50, Screen.height-50, 100, 50), "Continue")){
	Application.LoadLevel(1);
//	}
	}
}

function OnGUI(){
DisplaySplash(timer);
}