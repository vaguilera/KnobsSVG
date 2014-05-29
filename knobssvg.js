// KnobsSVG
// copyright Victor Aguilera
// forked from:
// Artan Sinani
// https://github.com/lugolabs/circles

/*
  Lightwheight JavaScript library that generates interactive circular knobs in SVG.

  Call Circles.create(options) with the following options:

    id         - the DOM element that will hold the graph
    percentage - the percentage dictating the smaller circle
    radius     - the radius of the circles
    width      - the width of the ring (optional, has value 10, if not specified)
    number     - the number to display at the centre of the graph (optional, the percentage will show if not specified)
    colors     - an array of colors, with the first item coloring the full circle 
                 (optional, it will be `['#EEE', '#F00']` if not specified)


*/

(function() {
  var KnobsSVG = window.KnobsSVG = function(options) {
    this.elId = options.id;
    this._el = document.getElementById(this.elId);
    
    if (this._el === null) return;
    
    var endAngleRad = Math.PI / 180 * 270;

    this._radius         = options.radius;
    this._percentage     = options.percentage;
	this._prevpercent	 = options.percentage;
    this._strokeWidth    = options.width  || 10;
    this._colors         = options.colors || ['#EEE', '#F00'];
    
    this._svgSize        = this._radius * 2;
    this._radiusAdjusted = this._radius - (this._strokeWidth / 2);
    this._start          = -Math.PI / 180 * 90;
    this._startPrecise   = this._precise(this._start);
    this._circ           = endAngleRad - this._start;
    this._el.innerHTML   = this._wrap(this._generateSvg());

    this._clicked         = false;
	this._onChange		 = null; 
    
    this._updateArc();
    this._setListeners();
  };

  KnobsSVG.prototype = {
    VERSION: '0.0.1',

    _updateArc: function() {
        
        var path     = this._el.getElementsByTagName('path')[1];
        
        path.setAttribute('d', this._calculatePath(this._percentage, true));

    },

    _wrap: function(content) {
    
      return '<div class="Knobs-wrp" style="position:relative; display:inline-block;">' + content + '</div>';
    
    },

    _generateSvg: function() {
      
      return '<svg width="' + this._svgSize + '" height="' + this._svgSize + '">' + 
      this._generatePath(100, false, this._colors[0]) + 
      this._generatePath(this._canAnimate ? 1 : this._percentage, true, this._colors[1]) + 
      '</svg>';

    },

    _generatePath: function(percentage, open, color) {
    
      return '<path fill="transparent" stroke="' + color + '" stroke-width="' + this._strokeWidth + '" d="' + this._calculatePath(percentage, open) + '"/>';
    
    },

    _calculatePath: function(percentage, open) {
    
      var end = this._start + ((percentage / 100) * this._circ),
      endPrecise = this._precise(end);
      
      return this._arc(endPrecise, open);
    
    },

    _arc: function(end, open) {
    
      var endAdjusted = end - 0.001,
        longArc       = end - this._startPrecise < Math.PI ? 0 : 1;

      return [
        'M',
        this._radius + this._radiusAdjusted * Math.cos(this._startPrecise),
        this._radius + this._radiusAdjusted * Math.sin(this._startPrecise),
        'A', // arcTo
        this._radiusAdjusted, // x radius
        this._radiusAdjusted, // y radius
        0, // slanting
        longArc, // long or short arc
        1, // clockwise
        this._radius + this._radiusAdjusted * Math.cos(endAdjusted),
        this._radius + this._radiusAdjusted * Math.sin(endAdjusted),
        open ? '' : 'Z' // close
      ].join(' ');

    },

    _precise: function(value) {
      
      return Math.round(value * 1000) / 1000;
    
    },

    _setListeners: function() {

        var self = this;
        
        var onMouseClick = function(ev) {
          self._clicked = true;        		  
        }

        var onMouseMove = function(ev) {

          if (self._clicked === true) {
            var x = ev.pageX - self._el.offsetLeft;
            var y = ev.pageY - self._el.offsetTop;
            
            x = -(x - self._radius);
            y = (y - self._radius);
                    		    
            self._percentage = ((Math.atan2(x,y) + Math.PI)*50) / Math.PI ;

            path = self._el.getElementsByTagName('path')[1];     
            self._updateArc();

          }

        }

        var onMouseUp = function(ev) {        
         
			if (self._clicked) { 
				if (self._prevpercent !== self._percentage) { 
					self._prevpercent = self._percentage;
					self._onChange(Math.round(self._percentage));				
				}
			}
			
			self._clicked = false;

        }        
        
        this._el.getElementsByClassName('Knobs-wrp')[0].addEventListener( 'mousedown', onMouseClick , false );
        this._el.getElementsByClassName('Knobs-wrp')[0].addEventListener( 'mousemove', onMouseMove , false );
        this._el.getElementsByClassName('Knobs-wrp')[0].addEventListener( 'mouseup', onMouseUp , false );
        this._el.getElementsByClassName('Knobs-wrp')[0].addEventListener( 'mousein', onMouseUp , false );
        document.getElementById(this.elId).addEventListener( 'mouseout', function(event) { 
          if ((event.relatedTarget || event.toElement) == this.parentNode) onMouseUp(event);
        } , false );
    },
	
	onChange:  function(callback) {
		
		this._onChange = callback;	
	
	}

  
  };

  KnobsSVG.create = function(options) {
    
    return new KnobsSVG(options);
  
  };
})();