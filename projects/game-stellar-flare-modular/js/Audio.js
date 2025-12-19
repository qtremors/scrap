export class AudioController {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        await Tone.start();

        this.masterGain = new Tone.Gain(0.6).toDestination();
        const reverb = new Tone.Reverb({
            decay: 2.5,
            preDelay: 0.01,
            wet: 0.3
        }).connect(this.masterGain);

        this.hummer = new Tone.Oscillator({
            type: 'sine',
            frequency: 50,
        }).start();

        this.hummerGain = new Tone.Gain(0).connect(reverb);
        this.hummer.connect(this.hummerGain);

        this.pickupSynth = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.1,
                release: 0.5,
            },
        }).connect(this.masterGain);

        this.gameOverSynth = new Tone.Synth({
            oscillator: { type: 'sawtooth' },
            envelope: {
                attack: 0.01,
                decay: 1,
                sustain: 0,
                release: 1,
            },
        }).connect(this.masterGain);

        this.isInitialized = true;
        console.log('Audio Initialized');
    }

    toggleHum(inShadow) {
        if (!this.isInitialized) return;
        const targetGain = inShadow ? 0 : 0.1;
        this.hummerGain.gain.rampTo(targetGain, 0.5);
    }

    playPickupSound() {
        if (!this.isInitialized) return;
        this.pickupSynth.triggerAttackRelease('C5', '8n');
    }

    playGameOverSound() {
        if (!this.isInitialized) return;
        this.gameOverSynth.triggerAttackRelease('C3', '1n');
    }
}
