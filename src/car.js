var car = function(scene,world)
{
    this.frontWheels = [scene.assets.frontWheel,scene.assets.frontWheel_1]
    this.backWheels = [scene.assets.backWheel,scene.assets.backWheel_1]
    this.carBody = [scene.assets.carBody];
    this.mesh = this.carBody[0];
    
    this.scene = scene.scene;
    var car_1 = scene.assets.Car
    this.scene.add(car_1)
    
    this.carBody[0].position.y += 7;
    this.frontWheels[0].position.y += 7;
    this.frontWheels[1].position.y += 7;
    this.backWheels[0].position.y += 7;
    this.backWheels[1].position.y += 7;
    
    
    var chassisBody = new p2.Body({ mass : 1, position:[this.carBody[0].position.x,this.carBody[0].position.y] }),
        chassisShape = new p2.Rectangle(2,.5);
        chassisBody.name = "box";
        chassisBody.data = this.carBody;
        chassisBody.sleepSpeedLimit = .1;
        chassisBody.sleepTimeLimit =  2; // Body falls asleep after 1s of sleepiness
        chassisBody.addShape(chassisShape);
        world.addBody(chassisBody);
//
//            // Create wheels
    var wheelBody1 = new p2.Body({ mass : 1, position:[this.frontWheels[0].position.x,this.frontWheels[0].position.y]}),
        wheelBody2 = new p2.Body({ mass : 1, position:[this.backWheels[0].position.x,this.backWheels[0].position.y]}),
        wheelShape = new p2.Circle(.4);
        wheelBody1.addShape(wheelShape);
        wheelBody1.name = "circle";
        wheelBody1.allowSleep = false;
        wheelBody1.data = this.frontWheels;
        wheelBody2.addShape(wheelShape);
        wheelBody2.name = "circle";
        wheelBody2.allowSleep = false;
        wheelBody2.data = this.backWheels;
        world.addBody(wheelBody1);
        world.addBody(wheelBody2);
    
    this.motor = wheelBody2;
    this.body = chassisBody;
    this.wheelBody1 = wheelBody1;
    this.wheelBody2 = wheelBody2;
//    
//    
////      var gBody = new p2.Body({ mass : 0, position:[0,0] }),
////        gShape = new p2.Rectangle(15,5);
////        gBody.name = "box";
////        gBody.addShape(gShape);
////        world.addBody(gBody);
//    
    var WHEELS =  1, // Define bits for each shape type
        CHASSIS = 2,
        GROUND =  4,
        OTHER =   8;

            wheelShape.collisionGroup =   WHEELS; // Assign groups
            chassisShape.collisionGroup =   CHASSIS;
//            gShape.collisionGroup =   GROUND;

            wheelShape.collisionMask =    GROUND | OTHER;             // Wheels can only collide with ground
            chassisShape.collisionMask =    GROUND | OTHER;             // Chassis can only collide with ground
//            gShape.collisionMask =    WHEELS | CHASSIS | OTHER;   // Ground can collide with wheels and chassis
//     // Constrain wheels to chassis
            var c1 = new p2.PrismaticConstraint(chassisBody,wheelBody1,{
                localAnchorA : [this.frontWheels[0].position.x-this.carBody[0].position.x,(this.frontWheels[0].position.y-this.carBody[0].position.y)],
                localAnchorB : [0,0],
                localAxisA : [0,1],
                disableRotationalLock : true,
            });
            var c2 = new p2.PrismaticConstraint(chassisBody,wheelBody2,{
                localAnchorA : [ this.backWheels[0].position.x-this.carBody[0].position.x,(this.backWheels[0].position.y-this.carBody[0].position.y)],
                localAnchorB : [0,0],
                localAxisA : [0,1],
                disableRotationalLock : true,
            });
            c1.setLimits(-.2, .12);
            c2.setLimits(-.2, .12);
            world.addConstraint(c1);
            world.addConstraint(c2);
//
////            // Add springs for the suspension
            var stiffness = 50,
                damping = 2,
                restLength = this.carBody[0].position.y-this.frontWheels[0].position.y;
    
            // Left spring
            world.addSpring(new p2.LinearSpring(chassisBody, wheelBody1, {
                restLength : restLength,
                stiffness : stiffness,
                damping : damping,
                localAnchorA : [this.frontWheels[0].position.x-this.carBody[0].position.x,0],
                localAnchorB : [0,0],
            }));
            // Right spring
            world.addSpring(new p2.LinearSpring(chassisBody, wheelBody2, {
                restLength : restLength,
                stiffness : stiffness,
                damping : damping,
                localAnchorA : [this.backWheels[0].position.x-this.carBody[0].position.x,0],
                localAnchorB : [0,0],
            }));

}

car.prototype.update =  function (delta) 
{
    
    
}