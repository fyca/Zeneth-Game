#pragma strict
var projectile : GameObject;
var projectileSpeed : float;

function Start () {

}

function Update () {
	if (networkView.isMine){
	Fire();
	}
}

function Fire(){
	if (Input.GetButtonDown("Fire1")){
	var clone : GameObject = Network.Instantiate(projectile, transform.position, transform.rotation, 1);
//	clone.rigidbody.AddForce(clone.transform.forward * projectileSpeed);
	}
}

