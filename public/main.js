const ajax = axios.create({
    baseURL: 'http://localhost:8080'
});

function loadGarden() {
    ajax.get('/garden').then(function (response) {
        console.log("GARDEN", response.data);

        // BORDERS
        const points = [];
        response.data.boundaryNodes.forEach(function (position) {
            points.push(position.x);
            points.push(position.y);
        });
        var line = two.makePath(...points);
        gardenGroup.add(line);

        // LAWN MOWER 
        paintLawnMower(response.data.lawnMower);
    });
}

function processStep() {
    ajax.post('/step').then(function (response) {
        console.log(response.data);
        paintLawnMower(response.data.lawnMower);
    });
}

function resetGarden() {
    ajax.post('/reset').then(function (response) {
        loadGarden();
    });
}

let animationInterval = null;
function toggleAnimation() {
  if(animationInterval == null){
    animationInterval = setInterval(function(){
      processStep();
    }, 200);
    document.getElementById('play').value = 'Stop';

  }else{
    clearInterval(animationInterval);
    animationInterval = null;
    document.getElementById('play').value = 'Start';
  }

}

/**
 * WINDOW ON LOAD
 */
window.onload = function () {

    initTwo();
    loadGarden();

    document.getElementById('reset').addEventListener('click', function () {
        resetGarden();
    });

    document.getElementById('step').addEventListener('click', function () {
        processStep();
    });

    document.getElementById('play').addEventListener('click', function () {
      toggleAnimation();
  });
};

/**
 * GRAPHIC LIBRARY
 */
var lawnMower = null;
var lawnMowerGroup = new Two.Group();
var gardenGroup = new Two.Group();
var stage = new Two.Group();
var two = null;

function initTwo() {
    const canvas = document.getElementById("canvas");
    
    two = new Two({
        fullscreen: false,
        autostart: true
    }).appendTo(canvas);
    //var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);
    //two.bind('update', function() {
    //    rect.rotation += 0.001;
    //});

    stage = new Two.Group();
    stage.add(gardenGroup);
    stage.add(lawnMowerGroup);

    two.add(stage);
    addZUI();
}

function paintLawnMower(lawnMowerData)
{
    if(lawnMower == null)
    {
        lawnMower = two.makeRectangle(lawnMowerData.position.x, lawnMowerData.position.y, 25, 10);
        lawnMowerGroup.add(lawnMower);
    }
    lawnMower.rotation = lawnMowerData.angle;
    lawnMower.position.x = lawnMowerData.position.x;
    lawnMower.position.y = lawnMowerData.position.y;
}


function addZUI() {

    var domElement = two.renderer.domElement;
    var zui = new Two.ZUI(stage);
    var mouse = new Two.Vector();
    var touches = {};
    var distance = 0;
    var dragging = false;

    zui.addLimits(0.06, 8);

    domElement.addEventListener('mousedown', mousedown, false);
    domElement.addEventListener('mousewheel', mousewheel, false);
    domElement.addEventListener('wheel', mousewheel, false);

    domElement.addEventListener('touchstart', touchstart, false);
    domElement.addEventListener('touchmove', touchmove, false);
    domElement.addEventListener('touchend', touchend, false);
    domElement.addEventListener('touchcancel', touchend, false);

    function mousedown(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      window.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', mouseup, false);
    }

    function mousemove(e) {
      var dx = e.clientX - mouse.x;
      var dy = e.clientY - mouse.y;
      zui.translateSurface(dx, dy);
      mouse.set(e.clientX, e.clientY);
    }

    function mouseup(e) {
      window.removeEventListener('mousemove', mousemove, false);
      window.removeEventListener('mouseup', mouseup, false);
    }

    function mousewheel(e) {
      var dy = (e.wheelDeltaY || - e.deltaY) / 1000;
      zui.zoomBy(dy, e.clientX, e.clientY);
    }

    function touchstart(e) {
      switch (e.touches.length) {
        case 2:
          pinchstart(e);
          break;
        case 1:
          panstart(e)
          break;
      }
    }

    function touchmove(e) {
      switch (e.touches.length) {
        case 2:
          pinchmove(e);
          break;
        case 1:
          panmove(e)
          break;
      }
    }

    function touchend(e) {
      touches = {};
      var touch = e.touches[ 0 ];
      if (touch) {  // Pass through for panning after pinching
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
      }
    }

    function panstart(e) {
      var touch = e.touches[ 0 ];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
    }

    function panmove(e) {
      var touch = e.touches[ 0 ];
      var dx = touch.clientX - mouse.x;
      var dy = touch.clientY - mouse.y;
      zui.translateSurface(dx, dy);
      mouse.set(touch.clientX, touch.clientY);
    }

    function pinchstart(e) {
      for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[ i ];
        touches[ touch.identifier ] = touch;
      }
      var a = touches[ 0 ];
      var b = touches[ 1 ];
      var dx = b.clientX - a.clientX;
      var dy = b.clientY - a.clientY;
      distance = Math.sqrt(dx * dx + dy * dy);
      mouse.x = dx / 2 + a.clientX;
      mouse.y = dy / 2 + a.clientY;
    }

    function pinchmove(e) {
      for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[ i ];
        touches[ touch.identifier ] = touch;
      }
      var a = touches[ 0 ];
      var b = touches[ 1 ];
      var dx = b.clientX - a.clientX;
      var dy = b.clientY - a.clientY;
      var d = Math.sqrt(dx * dx + dy * dy);
      var delta = d - distance;
      zui.zoomBy(delta / 250, mouse.x, mouse.y);
      distance = d;
    }
  
}