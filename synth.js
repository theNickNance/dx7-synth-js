var POLYPHONY = 16;

function Synth(voiceClass) {
	this.voices = [];
	this.voiceClass = voiceClass;
}

Synth.prototype.noteOn = function(note, velocity) {
		var voice = new this.voiceClass(note, velocity);
		this.cursor++;
		if (this.voices.length >= POLYPHONY) {
			this.voices.shift(); // remove first
//		} else {
//			var now = new Date().getTime();
//			this.voices.sort(function(a, b) {
//				var ageA = now - a.time;
//				var ageB = now - b.time;
//				return a.velocity - b.velocity;
//			});
		}
		this.voices.push(voice);
};

Synth.prototype.noteOff = function(note) {
	for (var i = 0; i < this.voices.length; i++) {
		if (this.voices[i] && this.voices[i].note == note && this.voices[i].down == true) {
			this.voices[i].noteOff();
			break;
		}
	}
};

Synth.prototype.panic = function() {
	for (var i = 0, l = this.voices.length; i < l; i++) {
		if (this.voices[i])
			this.voices[i].noteOff();
	}
	this.voices = [];
};

Synth.prototype.render = function() {
	var val = 0;
	var perVoiceLevel = 0.125; // nominal per-voice level borrowed from Hexter

	for (var i = 0, length = this.voices.length; i < length; i++) {
		var voice = this.voices[i];
		if (voice) {
			if (voice.isFinished()) {
				// Clear the note after release
				this.voices.splice(i, 1);
				i--; // undo increment
			} else {
				val += voice.render() * perVoiceLevel;
			}
		}
	}
	return val;
};