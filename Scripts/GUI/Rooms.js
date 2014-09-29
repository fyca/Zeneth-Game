#pragma strict
var maxPlayers : int;
var secretHost : String;
var sDTime : float = 0;
var ip : String;
var port : String;
enum Room{Main, Ranked, Social, Private, Create, CreateHost, Connect, Host, Lobby, Scores};
var currentRoom : Room;
var errorMess : String;
var hostDataSocial : HostData[];
var hostDataRanked : HostData[];
var hostDataPrivate : HostData[];
var numServers : int = -1;
var numServersSocial : int = -1;
var numServersRanked : int = -1;
var numServersPrivate : int = -1;
var registered : boolean = false;
var gameSelected : boolean = false;
var networkManager : NetworkManager;
var hostListFound : boolean;
var latency : Ping;
var latencyFound : boolean = false;

function Awake() {
networkManager = GameObject.FindGameObjectWithTag("NetworkMan").GetComponent(NetworkManager);
}

function Start(){
currentRoom = Room.Main;
}

function Refresh(){

yield StartCoroutine(GetPing());

}

function GetPing(){
yield WaitForSeconds(1);
	if (!latencyFound){
	latency = new Ping("8.8.8.8");
	latencyFound = true;
	//_ping.ip = "67.225.180.24";
		while (!latency.isDone){
		yield;
		}
	Debug.Log("Ping: " + latency.time);
	yield WaitForSeconds(4);
	latencyFound = false;
	}
}

function Update(){
Refresh();
}

function GetServers(type : String){
var cont1 : boolean;
var cont2 : boolean;
GetPing();
yield WaitForSeconds(1.0f);
	if (currentRoom == Room.Create ||currentRoom == Room.CreateHost || currentRoom == Room.Connect || currentRoom == Room.Ranked || currentRoom == Room.Private || currentRoom == Room.Social){
		if (!gameSelected){
		if (type == "Social" || type == "All"){
		MasterServer.ClearHostList();
		MasterServer.RequestHostList("ZenethGameSocial");
		yield WaitForSeconds(1.0f + (latency.time/100));
		hostDataSocial = MasterServer.PollHostList();
			if (hostDataSocial){
			numServersSocial = hostDataSocial.length;
			cont1 = true;
			}
			}
		if (type == "Ranked" || type == "All"){
		MasterServer.ClearHostList();
		if (cont1 ||  type == "Ranked"){
		MasterServer.RequestHostList("ZenethGameRanked");
		yield WaitForSeconds(1.0f + (latency.time/100));
		hostDataRanked = MasterServer.PollHostList();
			if (hostDataRanked){
			numServersRanked = hostDataRanked.length;
			cont2 = true;
			}
			}
			}
		if (type == "Private" || type == "All"){
		MasterServer.ClearHostList();
		if (cont2 || type == "Private"){
		MasterServer.RequestHostList("ZenethGamePrivate");
		yield WaitForSeconds(1.0f + (latency.time/100));
		hostDataPrivate = MasterServer.PollHostList();
			if (hostDataPrivate){
			numServersPrivate = hostDataPrivate.length;
			}
		}
		}
		numServers = numServersSocial+numServersRanked+numServersPrivate;
		hostListFound = true;
		}
	}
}

function OnGUI(){

//SecretHost
	if (Input.GetKey(KeyCode.Home)){
		if (sDTime < 1){
		sDTime += Time.deltaTime;
			if (sDTime > 1){
			currentRoom = Room.CreateHost;
			GetServers("All");
			}
		}
	}
	if (Input.GetKeyUp(KeyCode.Home)){
	sDTime = 0;
	}
// End Secret Host
if (latency){
if (latency.time != -1){
GUI.Label(Rect(Screen.width-200, Screen.height-50, 200, 50), "Your ping is: " + latency.time + "ms");
//}else{
//GUI.Label(Rect(Screen.width-200, Screen.height-50, 200, 50), "Ping is updating");
}
}
	if (currentRoom == Room.Main){
		if (GUI.Button(Rect(0,0,100,50), "Ranked")){
		currentRoom = Room.Ranked;
		if (!hostListFound && latency){
//		MasterServer.RequestHostList("ZenethGameRanked");
		GetServers("Ranked");
		hostListFound = true;
		}
		}
		if (GUI.Button(Rect(0,50,100,50), "Social")){
		currentRoom = Room.Social;
		if (!hostListFound && latency){
//		MasterServer.RequestHostList("ZenethGameSocial");
		GetServers("Social");
		hostListFound = true;
		}
		}
		if (GUI.Button(Rect(0,100,100,50), "Private")){
		currentRoom = Room.Private;
		}
	}
	if (currentRoom == Room.Ranked){
	if (numServersRanked != 0){
//	MasterServer.RequestHostList("ZenethGameRanked");
	var rankedData : HostData[] = MasterServer.PollHostList();
//	if (rankedData){
//			numServersRanked = rankedData.length;
//			}
    // Go through all the hosts in the host list
    	for (var element in rankedData){
			if (element.gameType == "ZenethGameRanked"){
        	GUILayout.BeginHorizontal();    
        	var rankedName = element.gameName + " " + element.connectedPlayers + " / " + element.playerLimit;
       		GUILayout.Label(rankedName);  
        	GUILayout.Space(5);
        	var rankedHostInfo : String;
        	rankedHostInfo = "[";
        		for (var rankedHost in element.ip)
            	rankedHostInfo = rankedHostInfo + rankedHost + ":" + element.port + " ";
        		rankedHostInfo = rankedHostInfo + "]";
        		GUILayout.Label(rankedHostInfo);  
        		GUILayout.Space(5);
        		GUILayout.Label(element.comment);
        		GUILayout.Space(5);
        		GUILayout.FlexibleSpace();
        			if (GUILayout.Button("Connect")){
            		Network.Connect(element);
            		gameSelected = true;           
        			}
        		GUILayout.EndHorizontal(); 
        	} 
    	}
    	}else{
    	GUI.Label(Rect(0, 50, 200, 25), "Servers Not Found");
		}
	}
	if (currentRoom == Room.Social){
    var socialData : HostData[] = MasterServer.PollHostList();
    // Go through all the hosts in the host list
    	for (var element in socialData){
		    if (element.gameType == "ZenethGameSocial"){
        	GUILayout.BeginHorizontal();    
        	var socialName = element.gameName + " " + element.connectedPlayers + " / " + element.playerLimit;
        	GUILayout.Label(socialName);  
        	GUILayout.Space(5);
        	var socialHostInfo : String;
        	socialHostInfo = "[";
        		for (var socialHost in element.ip)
            	socialHostInfo = socialHostInfo + socialHost + ":" + element.port + " ";
        		socialHostInfo = socialHostInfo + "]";
        		GUILayout.Label(socialHostInfo);  
        		GUILayout.Space(5);
        		GUILayout.Label(element.comment);
        		GUILayout.Space(5);
        		GUILayout.FlexibleSpace();
        			if (GUILayout.Button("Connect")){
 	            	Network.Connect(element);
    	        	gameSelected = true;           
		        	}
        		GUILayout.EndHorizontal();  
        	}
    	}
	}
	if (currentRoom == Room.Private){
	GUILayout.BeginArea(Rect(Screen.width - (Screen.width/3), 0, Screen.width - ((Screen.width/3)*2) ,Screen.height));
	GUILayout.Label("Create Server");
		if (GUILayout.Button("Create")){
		hostListFound = false;
		currentRoom = Room.Create;
		if (!hostListFound && latency){
		//MasterServer.RequestHostList("ZenethGamePrivate");
		GetServers("Private");
		}
		}
		if (GUILayout.Button("Connect")){
		currentRoom = Room.Connect;
		hostListFound = false;
		if (!hostListFound){
		//MasterServer.RequestHostList("ZenethGamePrivate");
		GetServers("Private");
		}
		}
	GUILayout.EndArea();
	}
	
	if (currentRoom == Room.Create){
		if (numServers >= -1 && latency){
			if (GUI.Button(Rect(0, 50, 100, 50), "Host Game")){
				if (networkManager.StartServer("ZenethGamePrivate", "Map2", "Map2", false)){
				GetServers("All");
				registered = true;
				}
			}
		}else{
		GUI.Label(Rect(0, 50, 200, 25), "Host List Updating!");
		}
	}
	if (currentRoom == Room.CreateHost){
		if (numServers >= -1 && latency){
			if (GUI.Button(Rect(0, 100, 100, 50), "Host Ranked Game")){
				if (networkManager.StartServer("ZenethGameRanked", "Map2", "Map2", true)){
				GetServers("All");
				registered = true;
				}
			}
			if (GUI.Button(Rect(0, 150, 100, 50), "Host Social Game")){
				if (networkManager.StartServer("ZenethGameSocial", "Map2", "Map2", true)){
				GetServers("All");
				registered = true;
				}
			}
		}else{
		GUI.Label(Rect(0, 50, 200, 25), "Host List Updating!");
		}
	}
	if (currentRoom == Room.Connect){
	var privateData : HostData[] = MasterServer.PollHostList();
    // Go through all the hosts in the host list
    	for (var element in privateData){
		    if (element.gameType == "ZenethGamePrivate"){
        	GUILayout.BeginHorizontal();    
        	var privateName = element.gameName + " " + element.connectedPlayers + " / " + element.playerLimit;
        	GUILayout.Label(privateName);  
        	GUILayout.Space(5);
        	var privateHostInfo : String;
        	privateHostInfo = "[";
        		for (var privateHost in element.ip)
            	privateHostInfo = privateHostInfo + privateHost + ":" + element.port + " ";
        		privateHostInfo = privateHostInfo + "]";
        		GUILayout.Label(privateHostInfo);  
        		GUILayout.Space(5);
        		GUILayout.Label(element.comment);
        		GUILayout.Space(5);
        		GUILayout.FlexibleSpace();
        			if (GUILayout.Button("Connect")){
        		    Network.Connect(element);
            		gameSelected = true;           
        			}
        		GUILayout.EndHorizontal(); 
        	} 
    	}
	}
}
	
