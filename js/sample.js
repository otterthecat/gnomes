// loop through elements sample - think jquery,
// but with vastly inferior selector handling.
// seriously, it's weaksauce at the moment...
_g('.sample').each(function(item, value){

	console.log(item + " : " + value.innerHTML);
});


// Merge sample
(function(){

	// obj 1
	var sample_obj = {
		foo: "bar",
		test: true
	};

	// obj 2
	var other_obj = {
		foo: "bar-b-q"
	};

	// merge objects
	console.log(_g.do.merge(sample_obj, other_obj));
})();