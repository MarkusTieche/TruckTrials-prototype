function init()
{
    //CREATE NEW GAME
    var Scene = new render();
        Scene.assets = {};
    
    var gameReady = false;
    document.getElementById("playButton").onclick = function(){gameReady = true;document.getElementById("loadingScreen").style.display = "none";document.getElementById("menu").style.display = "block";}
    document.getElementById("btn_help").onclick = function(){gameReady = false;document.getElementById("loadingScreen").style.display = "block";document.getElementById("menu").style.display = "none";}
    //CREATE NEW GAME OBJECT
    
//    addStats();
    
    var loadingBar = document.getElementById("loadingBar");
        loadingBar.w = loadingBar.offsetWidth
    //LOAD ASSETS
    var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            
//					console.log("loader "+ item, loaded, total,(loaded/total)*100+"%" );
                    loadingBar.style.width = (loaded/total)*loadingBar.w+"px";
				};
    var carGame;
    
        //LOAD COMPLETE
        manager.onLoad = function () {

            console.log("loading Finished");
            document.getElementById("loadingScreen").className ="ready";
            //INIT GAME
            carGame = new game(Scene);
            //START RENDER
            requestAnimationFrame(animate);
        };
        
        
        function loadObject( url ) {
       
            var loader = new THREE.ObjectLoader(manager);
                loader.load( url, function (object) {
                    //CHANGE OBJECT OR ADD PROPERTIES IN THIS STATE
                    object.traverse( function ( child ) {

                                if(child instanceof THREE.Mesh && child.material.name.indexOf("Flat") > -1)
                                {
                                    child.material.shading = THREE.FlatShading;
                                };
                                Scene.assets[child.name] = child;
                    });
                });
        };
        
        loadObject("assets/models/levelTilesTest.json");
        loadObject("assets/models/car2.json");
    
    
    //RENDER
    var lastTimeMsec = null;
    
    function animate(nowMsec)
    {
            // keep looping
            requestAnimationFrame( animate );
            // measure time
            lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
            var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec	= nowMsec
            Scene.onRenderFcts.forEach(function(onRenderFct){
                    onRenderFct(deltaMsec/1000, nowMsec/1000)
                });
            
            if(!Scene.pause && gameReady)
            {
                // call each update function
                carGame.update(deltaMsec/1000, nowMsec/1000);
//                stats.update(); //DEBUG
            }
            else
            {
            }
            //UPDATE OBJECTS

    };
};

function addStats()
{
    // STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
    document.getElementsByTagName("body")[0].appendChild( stats.domElement );
//	document.getElementById("wrapper").appendChild( stats.domElement );
}
