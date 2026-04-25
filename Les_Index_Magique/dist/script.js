jQuery(document).ready(function ($) {
	var split = new SplitText(".split", {
		type: "chars,words",
		charsClass: "char",
		wordsClass: "word word++"
	});

	var letter = $(".char");

	gsap.set(letter, {
		y: 5,
		opacity: 0,
		textShadow: "-5px -5px #00acc1, -10px -10px #064273"
	});

	gsap.to(letter, {
		opacity: 1,
		stagger: 0.2
	});

	gsap.to(letter, {
		y: -5,
		duration: 0.5,
		stagger: {
			each: 0.2,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true
		}
	});

	gsap.to(letter, {
		duration: 4,
		textShadow: "5px 5px #00acc1, 10px 10px #064273",
		stagger: {
			each: 0.8,
			ease: "linear",
			repeat: -1,
			yoyo: true
		}
	});
}); // end doc ready