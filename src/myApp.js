/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();
        /*
        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, 0));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        this.sprite.setScale(0.5);
        this.sprite.setRotation(180);

        lazyLayer.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));
        */
        this.setTouchEnabled(true);
        return true;
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;
var score = 0;
var audio = cc.AudioEngine.getInstance();
    

Box2DTestLayer = cc.Layer.extend({
    world:null,
    //GLESDebugDraw *m_debugDraw;

    ctor:function () {
        this._super();
        audio.init("mp3,ogg");
            
        this.setMouseEnabled(true);
        //setAccelerometerEnabled( true );
        this.setTouchEnabled(true);
        
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var screenSize = cc.Director.getInstance().getWinSize();
        //UXLog(L"Screen width %0.2f screen height %0.2f",screenSize.width,screenSize.height);
        var background = cc.Sprite.create(bg_bluesky);
        background.setPosition(new cc.Point( screenSize.width / 2, screenSize.height / 2));
        this.addChild(background, 0);
        
        // Construct a world object, which will hold and simulate the rigid bodies.
        this.world = createWorld();

        score = 0;
        // Define the ground body.
        //var groundBodyDef = new b2BodyDef(); // TODO
        //groundBodyDef.position.Set(screenSize.width / 2 / PTM_RATIO, screenSize.height / 2 / PTM_RATIO); // bottom-left corner

        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        //var groundBody = this.world.CreateBody(groundBodyDef);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(20, 2);
        fixDef.userData = { sprite :null, name:"floor"};
 
        // upper
        bodyDef.position.Set(10, screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(10, -1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(2, 14);
        // left
        bodyDef.position.Set(-1.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(26.8, 13);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //Set up sprite

        var mgr = cc.SpriteBatchNode.create(s_pathBlock, 150);
        this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

        //this.addNewSpriteWithCoords(cc.p(screenSize.width / 2, screenSize.height / 2));
     
        // Add listeners for contact
        var listener = new Box2D.Dynamics.b2ContactListener;
        var that = this;

        listener.BeginContact = function(contact) {

            if ((contact.GetFixtureA().GetBody().GetUserData().name == 'marker' && contact.GetFixtureB().GetBody().GetUserData().name == 'ball')
                    || (contact.GetFixtureA().GetBody().GetUserData().name == 'ball' && contact.GetFixtureB().GetBody().GetUserData().name == 'marker')) {

                // ball will jump 
                console.log('ball hit marker');
                /*for ( var i = 0; i < that.snailsBodies.length; i++) {
                    // check if it is a snail-hedgehog collision (if yes, remove the snail)
                    if (that.snailsBodies[i] === contact.GetFixtureA().GetBody() || that.snailsBodies[i] === contact.GetFixtureB().GetBody()) {
                        that.snailToRemove = i; // mark snail to remove
                    }
                }*/
                score += 1;
                /**
                 * TODO: Sound effects temporary turned off
                 */
                audio.playEffect("res/sounds/splat");
            }

            if ((contact.GetFixtureA().GetBody().GetUserData().name == 'ball' && contact.GetFixtureB().GetBody().GetUserData().name == 'floor')
                    || (contact.GetFixtureA().GetBody().GetUserData().name == 'floor' && contact.GetFixtureB().GetBody().GetUserData().name == 'ball')) {

                // gameover 
                console.log('gameover');

                var director = cc.Director.getInstance();

            }
        }

        // set contact listener to the world
        world.SetContactListener(listener);

        this.infoLayer = new InfoLayer(this);
        this.infoLayer.init();
        this.addChild(this.infoLayer);

        //this.setupGame();
    },

    setupGame:function(){

        this.removeChild(this.infoLayer);
 
        this.touchLabel = cc.LabelTTF.create("Tap screen", "Marker Felt", 32);
        this.addChild(this.touchLabel, 0);
        this.touchLabel.setColor(cc.c3b(0, 0, 255));
        this.touchLabel.setPosition(cc.p(screenSize.width / 2, screenSize.height - 50));
        
        this.state = "setupGame";
    },

    start:function(){

        this.state = "startGame";
        this.touchLabel.setVisible(false);
        
        //add 4  marker 
        this.addNewMarker(cc.p(screenSize.width*1 / 5, screenSize.height),"marker");
        this.addNewMarker(cc.p(screenSize.width*2 / 5, screenSize.height / 4),"marker");
        this.addNewMarker(cc.p(screenSize.width*3 / 5, screenSize.height / 4),"marker");
        this.addNewMarker(cc.p(screenSize.width*4 / 5, screenSize.height),"marker");
        var self = this;
        setTimeout(function(){
            self.addBall(cc.p(screenSize.width*2 / 5, screenSize.height / 2));
        }, 1000);

        this.scheduleUpdate();
    },

    onTouchStart: function (e) {
        'use strict';
        var touches, touch, point, n, m;

        e.preventDefault();
        touches = e.changedTouches;

        for (n = 0; n < touches.length; n = n + 1) {
            touch = touches[n];
            point = new cc.Point(touch.clientX, this.height - touch.clientY);
            if (cc.Rect.CCRectContainsPoint(circle.getBoundingBox(), point) === true) {
                if (circle.identifier === -1) {
                    circle.identifier = touch.identifier;
                    /* DO STUFF WITH THE CIRCLE ON TOUCH START HERE. */
                }
            }
        }
    },

    onTouchMove: function (e) {
        'use strict';
        var touches, touch, point, n, m;

        e.preventDefault();
        touches = e.changedTouches;

        for (n = 0; n < touches.length; n = n + 1) {
            touch = touches[n];
            point = new cc.Point(touch.clientX, this.height - touch.clientY);
            if (circle.identifier === touch.identifier) {
                /* DO STUFF WITH THE CIRCLE ON TOUCH MOVE HERE. */
                //if (cc.Rect.CCRectContainsPoint(circle.boundingBox(), touches[0]))
                //{
                circle.setPosition(cc.p(touch.getLocation().x, touch.getLocation().y));
                //}
            }
        }
    },

    onTouchEnd: function (e) {
        'use strict';
        var touches, touch, point, n, m;

        e.preventDefault();
        touches = e.changedTouches;

        if (this.state == "setupGame") {
            this.start();
            return false;
        }

        for (n = 0; n < touches.length; n = n + 1) {
            touch = touches[n];
            point = new cc.Point(touch.clientX, this.height - touch.clientY);
            if (circle.identifier === touch.identifier) {
                /* DO STUFF WITH THE CIRCLE ON TOUCH END HERE. */
                circle.identifier = -1;
            }
        }
    },

    addBall:function(p){
        // create player ball 

        var sprite = cc.Sprite.create(s_CloseNormal);
        this.addChild(sprite);
        sprite.setPosition(cc.p(p.x, p.y));
            
        var bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.Set(20,0);
        bodyDef.linearDamping = .03;
        bodyDef.allowSleep = false;
        //create fixture object
        var fixDef = new Box2D.Dynamics.b2FixtureDef;

        //define basic parameters
        fixDef.density = 0.1;
        fixDef.radius = 12;
        fixDef.restitution = 0.5;
        fixDef.friction = 1;
        fixDef.userData = { sprite :sprite, name:  "ball"} ;
 
        //define shape
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(12);

        player.object = world.CreateBody(bodyDef);
        player.object.CreateFixture(fixDef);
    },

    addNewMarker:function (p, tag) {
        this.addNewSpriteWithCoords(p, tag);
    },

    addNewSpriteWithCoords:function (p, tag) {
        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);
        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);

        //We have a 64x64 sprite sheet with 4 different 32x32 images.  The following code is
        //just randomly picking one of the images
        var idx = (Math.random() > .5 ? 0 : 1);
        var idy = (Math.random() > .5 ? 0 : 1);
        if (tag == "marker"){
            var sprite = cc.Sprite.create(s_CloseNormal);
            this.addChild(sprite);
        }else{
            var sprite = cc.Sprite.createWithTexture(batch.getTexture(), cc.rect(32 * idx, 32 * idy, 32, 32));
            batch.addChild(sprite);
        
        }
        sprite.setPosition(cc.p(p.x, p.y));
        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = { sprite :sprite, name: tag?tag:"block"};
        var body = this.world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.1;
        fixtureDef.restitution = 1.0;
        body.CreateFixture(fixtureDef);

    },
    update:function (dt) {
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/

        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                if (myActor.sprite) {
                    myActor.sprite.setPosition(cc.p(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO));
                    myActor.sprite.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
                }
                //console.log(b.GetAngle());
            }
        }

    },
    onMouseUp:function (event) {
        //Add a new body/atlas sprite at the touched location

        var location = event.getLocation();
        //location = cc.Director.getInstance().convertToGL(location);
        this.addNewSpriteWithCoords(location);
    },

    setBox2dDebug : function() {
    //if (this.config.box2dDebug) {
        var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
        debugDraw.SetDrawScale(this.config.box2dScale);
        debugDraw.SetFillAlpha(0.8);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
        world.SetDebugDraw(debugDraw);
    //}
    }

    //CREATE_NODE(Box2DTestLayer);
});

var Box2DTestScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Box2DTestLayer();
        layer.init();
        this.addChild(layer);
    },
    runThisTest:function () {
        var layer = new Box2DTestLayer();
        this.addChild(layer);

        cc.Director.getInstance().replaceScene(this);
    }
});

window.onload = function(){ 
    init();
    initGame();
    //step();

    console.log('onLoad');
};

var InfoLayer = cc.Layer.extend({
    isMouseDown : false,
    /*onEnter : function() {
        this._super();
        this.logo.setScale(0.1);
        this.logo.runAction(cc.Sequence.create(cc.EaseElasticOut
                .create(cc.ScaleTo.create(2, 1, 1), 0.5)));
        setTimeout(function() {
            var level = new classes.scenes.Level();
            game.setScene('level', level);
            game.changeScene(level);
        }, 3000);
    },*/
    ctor : function(game) {
        this._super();
        //tizen.logger.info("classes.layers.Intro.ctor()");
        //var selfPointer = this;
        //this.addExitAppButton();

        // Background layer
        // var background = cc.LayerColor.create(new cc.Color4B(0, 0, 0,
        // 255), 1280, 670);
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        var about = cc.MenuItemImage.create(s_forward,
                s_forward, this, function() {
                    //var level = new classes.scenes.Level();
                    //game.setScene('level', level);
                    //game.changeScene(level);
                    game.setupGame();
                });
        var menuNext = cc.Menu.create(about);
        menuNext.setPosition(cc.p(size.width - 100, 350));

        /*
        var hedgehog = cc.Sprite.create("images/splash/hedgehog.png");
        hedgehog.setPosition(new cc.Point(
                200 + game.getWindowSize().width / 2, (game
                        .getWindowSize().height / 2) - 150));

        var snail = cc.Sprite.create("images/splash/snail.png");
        snail.setPosition(new cc.Point(
                (game.getWindowSize().width / 2) - 200, (game
                        .getWindowSize().height / 2) - 150));

        this.logo = cc.Sprite.create("images/splash/logo.png");
        */
        this.logo = cc.Sprite.create(b_balloon);
        this.logo.setPosition(new cc.Point( (size.width / 2) - 100, (size.height / 2) + 70));
        
        this.setTouchEnabled(true);

        // adds layers/sprites to this layer in given order
        // this.addChild(menuNext, 1);
        //this.addChild(hedgehog, 3);
        //this.addChild(snail, 4);
        this.addChild(this.logo, 2);

        return true;
    }/*,

    adjustSizeForWindow : function() {
        var margin = document.documentElement.clientWidth
                - document.body.clientWidth;
        if (document.documentElement.clientWidth < cc.originalCanvasSize.width) {
            cc.canvas.width = cc.originalCanvasSize.width;
        } else {
            cc.canvas.width = document.documentElement.clientWidth
                    - margin;
        }
        if (document.documentElement.clientHeight < cc.originalCanvasSize.height) {
            cc.canvas.height = cc.originalCanvasSize.height;
        } else {
            cc.canvas.height = document.documentElement.clientHeight
                    - margin;
        }

        var xScale = cc.canvas.width / cc.originalCanvasSize.width;
        var yScale = cc.canvas.height / cc.originalCanvasSize.height;
        if (xScale > yScale) {
            xScale = yScale;
        }
        cc.canvas.width = cc.originalCanvasSize.width * xScale;
        cc.canvas.height = cc.originalCanvasSize.height * xScale;
        var parentDiv = document.getElementById("Cocos2dGameContainer");
        if (parentDiv) {
            parentDiv.style.width = cc.canvas.width + "px";
            parentDiv.style.height = cc.canvas.height + "px";
        }
        cc.renderContext.translate(0, cc.canvas.height);
        cc.renderContext.scale(xScale, xScale);
        cc.Director.getInstance().setContentScaleFactor(xScale);
    }*/
});
