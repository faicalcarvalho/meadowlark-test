suite("'About' Page Tests", function() {
	console.log("before test:", $("a[href='/contact']").length);
	test("page should contain link to contact page", function() {
		assert($("a[href='/contact']").length);
	});
});