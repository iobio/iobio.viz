const utils = {};

utils.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;
}

utils.format_percent = function(d, precision_places) {
	var precision_places = precision_places || 1;

	var corrector = 1;
	for (var i=0; i < precision_places; i++) { corrector *= 10}

	var percent = parseInt( d * (corrector*100) ) / corrector;

	return percent;
}

utils.getUID = function(separator) {
    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}

utils.value_accessor = function(value, d,i) {
	return typeof value === 'function' ? value(d,i) : value;
}

utils.tooltipHelper = function(selection, tooltipElem, titleAccessor) {
	selection
		.on("mouseover", function(evt, d,i) {
			utils.showTooltip(tooltipElem, titleAccessor, evt, d);
		})
		.on("mouseout", function(d) {
			utils.hideTooltip(tooltipElem);
		})
}

utils.showTooltip = function(tooltipElem, titleAccessor, evt, d) {
	var tooltipStr = utils.value_accessor(titleAccessor, d); // handle both function and constant string
	var opacity = tooltipStr ? .9 : 0; // don't show if tooltipStr is null
	var elemHeight = tooltipElem.node().getBoundingClientRect().height
	tooltipElem.transition()
		.duration(200)
		.style("opacity", opacity);
	tooltipElem.html(tooltipStr)
		.style("left", (evt.clientX + 8) + "px")
		.style("text-align", 'left')
		.style("top", (evt.clientY - elemHeight - 8) + "px");
}

utils.endAll = function (transition, callback) {
    var n;

    if (transition.empty()) {
        callback();
    }
    else {
        n = transition.size();
        transition.on("end", function () {
            n--;
            if (n === 0) {
                callback();
            }
        });
    }
}


// Takes svg and looks for matching styles and explicity defines them
// in a <styles> tag inside the svg elem.
utils.addStylesToSvg = function(svg) {
    var used = "";
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      var rules = sheets[i].cssRules;
      if(rules==null) continue;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (typeof(rule.style) != "undefined") {
          var elems = svg.querySelectorAll(rule.selectorText);
          if (elems.length > 0) {
            used += rule.selectorText + " { " + rule.style.cssText + " }\n";
          }
        }
      }
    }

    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    // s.innerHTML = "<![CDATA[\n" + used + "\n]]>";
    s.innerHTML = used;

    var defs = document.createElement('defs');
    defs.appendChild(s);
    svg.insertBefore(defs, svg.firstChild);
}

utils.hideTooltip = function(tooltipElem) {
	tooltipElem.transition()
			   .duration(500)
			   .style("opacity", 0);
}

// Copies a variable number of methods from source to target.
utils.rebind = function(target, source) {
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

export default utils;
