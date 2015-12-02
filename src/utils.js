
module.exports.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;            
}

module.exports.format_percent = function(d, precision_places) {
	var precision_places = precision_places || 1;
		
	var corrector = 1;
	for (var i=0; i < precision_places; i++) { corrector *= 10}

	var percent = parseInt( d * (corrector*100) ) / corrector;

	return percent;            
}

module.exports.getUID = function(separator) {    	
    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());	
}

module.exports.value_accessor = function(value, d) {
	return typeof value === 'function' ? value(d) : value;
}

module.exports.tooltipHelper = function(selection, tooltipElem, titleAccessor) {
	var utils = require('./utils.js')
	selection
		.on("mouseover", function(d,i) {    
			var tooltipStr = utils.value_accessor(titleAccessor, d); // handle both function and constant string
			var opacity = tooltipStr ? .9 : 0; // don't show if tooltipStr is null
			tooltipElem.transition()        
				.duration(200)      
				.style("opacity", opacity);      
			tooltipElem.html(tooltipStr)
				.style("left", (d3.event.pageX) + "px") 
				.style("text-align", 'left')
				.style("top", (d3.event.pageY - 24) + "px");    
		})
		.on("mouseout", function(d) {       
			tooltipElem.transition()        
				.duration(500)      
				.style("opacity", 0);   
		})
}

// Copies a variable number of methods from source to target.
module.exports.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = iobio_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function iobio_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}