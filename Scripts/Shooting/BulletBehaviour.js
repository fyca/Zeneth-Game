#pragma strict
var projectileSpeed : float = 1000;

function Start () {
	if (networkView.isMine){
	rigidbody.AddForce(transform.forward * projectileSpeed);
	}
}

function Update () {
DestroyProjectile(1.0f);
}

@RPC
function DestroyProjectile(time : float){
yield WaitForSeconds(time);
NetworkView.Destroy(this.gameObject);
}

function OnCollisionEnter(c:Collision){
	if (c.gameObject.tag == "Bullet"){
	NetworkView.Destroy(c.gameObject);
//	Destroy(c.gameObject);
	}
	if (c.gameObject.tag == "Player"){
//	ModifyHealth();
	}
}

//@RPC
//function ModifyHealth(){
//    hit=true;
//	playerHealth = playerHealth-20;
//	yield WaitForSeconds(2.0f);
//	hit=false;
//}