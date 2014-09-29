#pragma strict
var playerHealth : int = 100;
var hit : boolean = false;
var damage : int = 20;

function Start () {

}

function Update () {

}


function OnCollisionEnter(c:Collision){
	if (networkView.isMine){
		if (c.gameObject.tag == "Bullet"){
		ModifyHealth(damage);
		}
	} 
}

function OnGUI(){
	if (hit){
	DisplayHealth();
	}

}

@RPC
function ModifyHealth(d : int){
    hit=true;
	playerHealth = playerHealth-d;
	yield WaitForSeconds(2.0f);
	hit=false;
}

@RPC
function DisplayHealth(){
GUI.Label(Rect((Screen.width/2)-175,0, 350, 25), "Health is now " +playerHealth+"%");
}