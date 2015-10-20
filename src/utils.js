
module.exports.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;            
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