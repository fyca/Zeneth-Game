#pragma strict

function Start () {

}

function Update () {

}

function OnCollisionEnter(c:Collision){
	if (c.gameObject.tag == "Bullet"){
	Destroy(c.gameObject);
	}
}