export default class Sound {
    constructor() {
        // Initialize synths
        this.goalSynth = new Tone.PolySynth().toDestination();
        this.kickSynth = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
            }
        }).toDestination();
        this.saveSynth = new Tone.MetalSynth({
            frequency: 200,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.2
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        
        // Effects
        this.reverb = new Tone.Reverb(1.5).toDestination();
        this.goalSynth.connect(this.reverb);
        
        // Volume adjustments
        this.goalSynth.volume.value = -10;
        this.kickSynth.volume.value = -15;
        this.saveSynth.volume.value = -20;
    }
    
    async init() {
        await Tone.start();
        console.log('Audio engine initialized');
    }
    
    playGoalSound() {
        // Play a celebratory arpeggio
        const now = Tone.now();
        this.goalSynth.triggerAttackRelease("C4", "16n", now);
        this.goalSynth.triggerAttackRelease("E4", "16n", now + 0.1);
        this.goalSynth.triggerAttackRelease("G4", "16n", now + 0.2);
        this.goalSynth.triggerAttackRelease("C5", "8n", now + 0.3);
        
        // Add some percussion
        this.kickSynth.triggerAttackRelease("C2", "8n", now);
        this.kickSynth.triggerAttackRelease("C2", "8n", now + 0.3);
    }
    
    playKickSound() {
        // Play a kick sound when shooting
        this.kickSynth.triggerAttackRelease("C1", "8n");
    }
    
    playSaveSound() {
        // Play a metallic sound for saves
        this.saveSynth.triggerAttackRelease("C3", "16n");
    }
    
    playMissSound() {
        // Play a lower pitched sound for misses
        this.kickSynth.triggerAttackRelease("G1", "4n");
    }
} 