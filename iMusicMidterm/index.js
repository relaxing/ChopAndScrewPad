/**
 *  Forking from Tommy Payne, hacking at the NYC Monthly Music Hackathon 3/28/2015
 *  Using Tone.JS and NexusUI
 *
 *  by Lee Tusman, Tim Bieniosek, Jason Sigal
 */

		var loaded = 0;

		// SETUP TONE
		// default playback rates
		var player1Rate = 0.75;
		var player2Rate = 0.75;

		var player1 = new Tone.Player("./samples/screwTheAir.mp3", function(){
			loaded++;
			sampleLoaded();
		});

		var player2 = new Tone.Player("./samples/screwTheAir.mp3", function(){
			loaded++;
			sampleLoaded();
		});

        var player3 = new Tone.Player("./samples/Crackle_Loop_11.wav", function(){
			loaded++;
			sampleLoaded();
		});

		function sampleLoaded(e){
			if (loaded ===4){
				console.log("loaded sample: " + e);
			}
		}

		//invoked when the queued sample is done loading
		Tone.Buffer.onload = function(){
            player3.start();
            player1.loopStart = 200;
            player2.loopStart = 200.0 + (64.0 * (1.0/94.5));
			player1.start(0);
			player1.output.gain.value = 3;
			player2.start();
			player2.output.gain.value = 3;
			console.log("everything is loaded");
		};

		var fader = new Tone.CrossFade(0.5);
		player1.connect(fader, 0, 0);
		player2.connect(fader, 0, 1);
		//fader.toMaster();


        player3.toMaster();
		player1.loop = true;
		player2.loop = true;
        player3.loop = true;
		player1.retrigger = true;
		player2.retrigger = true;
		player3.retrigger = true;

        var bpfilter = new Tone.Filter(500, "bandpass", -12);
        var lpfilter = new Tone.Filter(300, "lowpass", -12);
        
        fader.connect(bpfilter);
        fader.connect(lpfilter);
        lpfilter.toMaster();
        bpfilter.toMaster();

        var noise = new Tone.Noise();
        noise.toMaster();
		noise.volume.value = -50;
        noise.start();

		nx.onload = function(){
			nx.colorize("#7D26CD"); // sets accent (default)
			nx.colorize("border", "#222222");
			nx.colorize("fill", "#222222");

			vinyl1.colors.accent = "#FF00CC";
			vinyl1.draw();

			vinyl1.on("*", function(data){
				//callback inside the function 
				//next line of code is where the mp3 PBR is mapped to the speed of the Vinyl object
				//we are changing the players PBR based on the user interaction speed of the Vinyl GUI
				player1.playbackRate = data.speed * player1Rate;
			});

			vinyl2.on("*", function(data){
				player2.playbackRate = data.speed * player2Rate;
			});

			tt1Slider.on("*", function(data) {
				player1Rate = map(data.value, 1, 0, 0.78, 0.7);
				player1.playbackRate = player1Rate;
			});

			tt2Slider.on("*", function(data) {
				player2Rate = map(data.value, 1, 0, 0.78, 0.7);
				player2.playbackRate = player2Rate;
			});

			crossfader.on("*", function(data) {
				// console.log(data.value);
				fader.fade.value = data.value;
			});

	}; // end nx-onload

// HELPER METHODS
var map = function (n, start1, stop1, start2, stop2) {
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

var constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low);
};
