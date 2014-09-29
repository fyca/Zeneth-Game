#pragma strict
var playerPrefab : GameObject;
var spawnPoint : Vector3;

function Start () {
SpawnPlayer();
}

function Update () {

}

function SpawnPlayer(){
Network.Instantiate(playerPrefab, spawnPoint, Quaternion.identity, 0);
}