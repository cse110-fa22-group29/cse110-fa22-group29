module.exports = {test, item, assert};

var itemsFailed;

/*
 * Calls multiple item functions.
 *
 * param 	name 		string 	name of the test
 * param 	items 		func	callable function that contains item calls
 * 
 * return				bool	whether the test passed or failed
*/
function test(name, items) {
	console.log(name);    
    items();
}

/*
 * Contain multiple assertions to test specific behavior
 * 
 * param 	name		string 	name of the specific item
 * param	items		func	multple assertion calls
 * 
 * return 				bool	whether the item passed or failed
*/
function item(name, method) {
	try{
		method();
		console.log('\t\x1b[32m%s\x1b[0m', '\u2714 ' + name);
		itemsFailed += 0;
		return true;
	}
	catch (error) {
		console.log('\t\x1b[31m%s\x1b[0m', '\u2718 ' + name);
        itemsFailed += 1;
		return false;
	}
}

/*
 * Given two inputs, comapres if they equivalent.
 *
 * param 	input		any		output of some function to be tested.
 * param	expected	any		expected output of the function
 * 
 * return				bool 	whether input = expected
*/
function assert(input, expected) {
	let result;
	if (typeof(input) === 'object') {
		result = JSON.stringify(input) === JSON.stringify(expected);
	}
	else {
		result = input === expected;
	}
	if(!result){
		throw new Error();
	}
}