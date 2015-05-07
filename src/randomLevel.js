var level = function(scene,world)
{
    this.scene = scene.scene;
//    this.tileSet = [scene.assets.Cube,scene.assets.Cube_2,scene.assets.Cube_3];
    this.tileSet = [scene.assets.Ground_0,scene.assets.Ground_1,scene.assets.Ground_2,scene.assets.Ground_3,scene.assets.Ground_4,scene.assets.Ground_5,scene.assets.Ground_6];
    
    //SET UP TILESET
    for (var i = 0; i < this.tileSet.length; i++) 
    {
        for (var j = 0; j < this.tileSet[i].children.length; j++) 
        {
            var child = this.tileSet[i].children[j];
            
            if( child.name.indexOf("collision") > -1)
            {
                this.tileSet[i].collisionPoly = child.geometry.vertices;
                child.visible = false;
            };
            
            //GET CONNECT A
            if(child.name.indexOf("connectA") > -1)
            {
//                            console.log("ca",tileSet[i])
                 this.tileSet[i].connectA =  child;
            }
//                                        
            //GET CONNECT B
            if(child.name.indexOf("connectB") > -1)
            {
//                             console.log("cb",tileSet[i])
                 this.tileSet[i].connectB =  child;
            }
        };
    };
    
    this.currentPos = 0;
    this.distance = 0;
    this.segmentWidth = 10;
    this.target = null; //PLAYER OBJECT
    this.world = world;
    
    this.prePhysics = 2;  //CALCULATE X PHYSICS SEGMENTS AHEAD -> 1 == only current;
    this.preWorld = 10; //SHOW X/2 MESH MODELS AHEAD AND BEHIND
    
    this.levelSetup=[0,1,0,1,0,2,6,5,3,3,4,2,0,5];
    this.currentLevel = [];
    
    this.create();
}

level.prototype = 
{
    create:function()
    {
        
        //START TILE
        var cube = this.tileSet[this.levelSetup[0]].clone();
            cube.position.set(((-this.preWorld/2)*this.segmentWidth),0,0);
            cube.physicsLoaded = false;    
            
            this.scene.add(cube);
            
            //ADD START SEGMENTS -> TARGET POSITION == CENTER
            this.currentLevel.push(cube)
        
        for (var i = 1; i < this.preWorld-1; i++) 
        {
            this.addSegment(i)
        };
        
        this.currentPos = this.preWorld/2;
        this.createShape(this.currentPos);
        this.createShape(this.currentPos+1);
    },
    
    addSegment:function(pos)
    {
        
        var arrayPos = Math.ceil(pos)%this.levelSetup.length;
        
        var randomPick = Math.round(Math.random()*this.tileSet.length);
        var connectB = this.tileSet[this.levelSetup[arrayPos]].connectB;
        var connectA = this.tileSet[this.levelSetup[Math.ceil(pos-1)%this.levelSetup.length]].connectA;
        var lastPos = this.currentLevel[Math.ceil(pos-1)%this.preWorld].position;
        
        var cube = this.tileSet[this.levelSetup[Math.ceil(pos)%this.levelSetup.length]].clone();
            cube.position.set(((-this.preWorld/2+pos)*this.segmentWidth),lastPos.y-(connectB.position.z-connectA.position.z),0);
            cube.physicsLoaded = false;    
            
            this.scene.add(cube);
            
            this.scene.remove(this.currentLevel[Math.ceil(pos)%this.preWorld]);
            //ADD START SEGMENTS -> TARGET POSITION == CENTER
            this.currentLevel[Math.ceil(pos)%this.preWorld] = cube;
    },
    
    createShape:function(pos)
    {
        var arrayPos = Math.ceil(pos)%this.preWorld;
        var path = []
        var poly = this.tileSet[this.levelSetup[Math.ceil(pos-1)%this.levelSetup.length]].collisionPoly;
        var WHEELS =  1, // Define bits for each shape type
            CHASSIS = 2,
            GROUND =  4,
            OTHER =   8;

        for (var i = 0; i < poly.length; i++) 
        {   
            path.push([poly[i].x,poly[i].z]);
//            path.push(this.tileSet[this.levelSetup[Math.ceil(pos-1)%this.levelSetup.length]].collisionPoly[i]);
        }
        
        var concaveBody = new p2.Body({
            mass : 0,
            position:[this.currentLevel[Math.ceil(pos-1)%this.preWorld].position.x,this.currentLevel[Math.ceil(pos-1)%this.preWorld].position.y]
        });
            concaveBody.fromPolygon(path);
            concaveBody.name = "poly";
        
            this.world.addBody(concaveBody);
            
            for (var i = 0; i < concaveBody.shapes.length; i++) 
            {
                concaveBody.shapes[i].collisionGroup =   GROUND;
                concaveBody.shapes[i].collisionMask =    WHEELS | CHASSIS | OTHER; 
            }
            // Add the body to the world
            this.currentLevel[arrayPos].physicsLoaded = true;
            this.currentLevel[arrayPos].body = concaveBody;
    },
    
    removeShape:function(pos)
    {
        if(this.currentLevel[pos].physicsLoaded)
        {
            this.currentLevel[pos].body.pendingDelet = true;
            this.currentLevel[pos].physicsLoaded = false;
        }
    },
    
    destroy:function()
    {
        //REMOVE FROM RENDER
    },
    
    update:function(delta,now)
    {
        this.distance = this.target.position[0]-(this.currentLevel[(Math.ceil(this.currentPos)%this.preWorld)].body.position[0]-(this.segmentWidth/2));
//        
//        //POSITIVE VELOCITY
        if(this.distance > this.segmentWidth-2 && this.target.velocity[0] > 0 && this.currentPos > 0)
        {
            //LOAD NEXT PHYSICS OBJECT
            if(!this.currentLevel[(Math.ceil(this.currentPos+1)%this.preWorld)].physicsLoaded)
            {
                //ADD NEW PHYSICS SHAPE
                this.createShape(this.currentPos+1);
                //REMOVE UNUSED SHAPES
                this.removeShape((Math.ceil(this.currentPos+1-this.prePhysics)%this.preWorld));
                
            };
            
            //ENTER NEW SEGMENT
            if(this.distance >= this.segmentWidth)
            { 
                this.currentPos += 1;
                
                //ADD/REMOVE NEW 3D OBJECT AT LAST POSITION
                this.addSegment(this.currentPos+2)
            };
        };
        
         if(this.distance < 3 && this.target.velocity[0] < 0 && this.currentPos > 0)
//        {
//            
            //LOAD NEXT PHYSICS OBJECT
            if(!this.currentLevel[(Math.ceil(this.currentPos-1)%this.preWorld)].physicsLoaded)
            {
                //ADD NEW PHYSICS SHAPE
                this.createShape(this.currentPos-1);
                //REMOVE UNUSED SHAPES
                this.removeShape((Math.ceil(this.currentPos-1+this.prePhysics)%this.preWorld));
            };
            
            //ENTER NEW SEGMENT
            if(this.distance <= 0)
            {
                this.currentPos -= 1;
                
            };
//        };
    }
}
