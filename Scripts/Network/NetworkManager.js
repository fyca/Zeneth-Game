#pragma strict
var roomsScript : Rooms;

function Awake(){
//MasterServer.ipAddress = "127.0.0.1";
//MasterServer.port = 23466;
roomsScript = GameObject.FindGameObjectWithTag("Rooms").GetComponent(Rooms);
}

function OnFailedToConnect(error: NetworkConnectionError) {
roomsScript.errorMess = "Could not connect to server: "+ error;
}

function OnServerInitialized(){
Debug.Log("Server Initialized! Server Time is "+Network.time);
}

function StartServer(type :String, name:String, description:String, dedicated:boolean) : boolean{
	if (roomsScript.numServers >= -1){
	Network.InitializeServer(32, 10002 + roomsScript.numServers, !Network.HavePublicAddress());
	// Not running a client locally? dedicated=true;
	MasterServer.dedicatedServer = dedicated;
	MasterServer.RegisterHost(type, name, description);
	}
	return true;
}

function OnServerConnected(){

}