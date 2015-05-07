var render = function()
{
    
    // init renderer
	this.renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
    this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setClearColor(new THREE.Color('lightgrey'), 1)
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( this.renderer.domElement );

	// array of functions for the rendering loop
    this.onRenderFcts= [];

	// init scene and camera
    this.scene	= new THREE.Scene();
	this.camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
	this.camera.position.z = 17;
	this.camera.position.x = -5;
	this.camera.position.y = 17;
    this.scene.add(this.camera);
//	var controls	= new THREE.OrbitControls(this.camera);
//        controls.noKeys = true;
//    
    this.pause = false;
    
    var _this = this;

    this._onChange = function (event) {
        return _this.visibilityChange(event);
    };

    
	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////

    var renderer = this.renderer;
    var scene = this.scene;
    var camera = this.camera;
    
    // handle window resize
	window.addEventListener('resize', function(){
		renderer.setSize( window.innerWidth, window.innerHeight )
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
	}, false);

    
//	// render the scene
	this.onRenderFcts.push(function renderScene(){
        renderer.render( scene, camera );		
	});
    
    this.checkVisibility();
};

render.prototype.add = function(mesh, func)
{
    this.scene.add(mesh)
    
    if(func)
    {
         this.onRenderFcts.push(func);
    }
};

//HANDLE FOCUS
render.prototype.checkVisibility = function () {

    if (document.webkitHidden !== undefined)
    {
        this._hiddenVar = 'webkitvisibilitychange';
    }
    else if (document.mozHidden !== undefined)
    {
        this._hiddenVar = 'mozvisibilitychange';
    }
    else if (document.msHidden !== undefined)
    {
        this._hiddenVar = 'msvisibilitychange';
    }
    else if (document.hidden !== undefined)
    {
        this._hiddenVar = 'visibilitychange';
    }
    else
    {
        this._hiddenVar = null;
    }

    //  Does browser support it? If not (like in IE9 or old Android) we need to fall back to blur/focus
    if (this._hiddenVar)
    {
        document.addEventListener(this._hiddenVar, this._onChange, false);
    }

    window.onpagehide = this._onChange;
    window.onpageshow = this._onChange;

    window.onblur = this._onChange;
    window.onfocus = this._onChange;
    
    var _this = this;

};

/**
* This method is called when the document visibility is changed.
* 
* @method Phaser.Stage#visibilityChange
* @param {Event} event - Its type will be used to decide whether the game should be paused or not.
*/
render.prototype.visibilityChange = function (event) {

    if (event.type === 'pagehide' || event.type === 'blur' || event.type === 'pageshow' || event.type === 'focus')
    {
        if (event.type === 'pagehide' || event.type === 'blur')
        {
//            console.log("focusLost");
            this.pause = true;
        }
        else if (event.type === 'pageshow' || event.type === 'focus')
        {
//            console.log("focusGain");
             this.pause = false;
        }

        return;
    }

    if (this.disableVisibilityChange)
    {
        return;
    }

    if (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden || event.type === "pause")
    {
//        console.log("focusLost");
        this.pause = true;
    }
    else
    {
//        console.log("focusGain");
        this.pause = false;
    }

};
