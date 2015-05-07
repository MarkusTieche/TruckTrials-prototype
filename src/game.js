var game = function(scene)
{
    this.scene = scene;
    this.keys = {  };
    
    this.create();
}

game.prototype = 
{
    create:function()
    {
        var scene = this.scene;
        
        //ADD POINT LIGHT
    var light = new THREE.PointLight(0xffffff,.7);
        light.position.set(0,0,0);
        this.scene.camera.add(light)
        
         //INIT PHYSICS
        this.world = new p2.World();
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.setGlobalStiffness(1e6);
        this.world.solver.iterations = 10;
        this.world.defaultContactMaterial.friction = 100;
        
        //INIT DEBUG VIEW
        var playerCar = new car(this.scene,this.world);
        this.player = playerCar.body;
        this.player.wheel1 = playerCar.wheelBody1;
        this.player.wheel2 = playerCar.wheelBody2;
        this.player.mesh = playerCar.mesh;
            
        this.player.on('sleep',reset)
        
        
        function reset(e)
        {
            playerCar.body.wakeUp();
            playerCar.motor.angularVelocity = -100;
            playerCar.body.angle= 0;
            playerCar.body.position[1] = playerCar.body.position[1]+5;
            playerCar.body.wheel1.position[1] = playerCar.body.position[1]-.5;
            playerCar.body.wheel1.position[0] = playerCar.body.position[0]+.8;
            playerCar.body.wheel2.position[1] = playerCar.body.position[1]-.5;
            playerCar.body.wheel2.position[0] = playerCar.body.position[0]-.8;
        }
        
        document.getElementById("btn_reset").onclick = reset;
        
        this.scene.camera.lookAt(this.player.mesh.position);
        
        this.levelHandler = new level(this.scene,this.world);
        this.levelHandler.target = this.player;
//        
        
        var that = this;
    
        window.addEventListener( 'keydown', checkKey, false );
        
        window.addEventListener('touchstart', function(){ playerCar.motor.angularForce = -200;})
        
        function checkKey(e) 
        {

             that.keys[e.which] = true
    //        e = e || window.event;
    //
    //        if (e.keyCode == '38') {
    //            // up arrow
    //        }
    //        else if (e.keyCode == '40') {
    //            // down arrow
    //        }
             if (e.keyCode == '82')
             {
                 reset();
             } 
             
            if (e.keyCode == '37') {
                // left arrow
                if(playerCar.motor.angularVelocity < 10)
                {
                    playerCar.motor.angularForce = +200;
                }
            }
            else if (e.keyCode == '39') {
                // right arrow
                if(playerCar.motor.angularVelocity > -40)
                {
                    playerCar.motor.angularForce = -200;
                }
            }
        }

        document.onkeyup=function(e){that.keys[e.which] = false}
    
        
        //ADD UPDATE FUNCTION TO MAIN RENDER
//    this.scene.onRenderFcts.push(this.update)
    },
    
    destroy:function()
    {
        //REMOVE FROM RENDER
        this.scene.onRenderFcts.splice(this.renderIndex,1)
    },
    
    
    update:function(delta,now)
    {
        //UPDATE LEVEL
        this.levelHandler.update(delta)
        
        //UPDATE PHYSICS
        this.world.step(1/60,delta);
        
        for (var i = 0; i < this.world.bodies.length; i++) 
        { 
            if(this.world.bodies[i].pendingDelet)
            {
                //REMOVE 2D BODY
                this.world.removeBody(this.world.bodies[i]); 
                //UPDATE LOOP LENGTH
                i--
            };
            
            if(this.world.bodies[i].name == "box")
            {
            };

            if(this.world.bodies[i].name == "circle" && !this.world.bodies[i].data)
            {
                this.player.mesh.position.set(this.world.bodies[i].position[0], this.world.bodies[i].position[1],0);
                this.player.mesh.rotation.z = this.world.bodies[i].angle; 
            };
            
            if(this.world.bodies[i].data){
                for (var j = 0; j < this.world.bodies[i].data.length; j++) 
                { 
                    
                        var obj = this.world.bodies[i].data[j];
                            obj.rotation.y = this.world.bodies[i].angle*-1; 
                            obj.position.set(this.world.bodies[i].position[0], this.world.bodies[i].position[1],obj.position.z);
                }
            }
        };  
        
        this.scene.camera.position.x = this.player.mesh.position.x-5;
        this.scene.camera.position.y = this.player.mesh.position.y+10;
        this.scene.camera.lookAt(this.player.mesh.position);
    }
}

