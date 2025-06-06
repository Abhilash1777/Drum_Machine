const pads = [
  { key: 'Q', id: 'Kick', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
  { key: 'W', id: 'Snare', src: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' },
  { key: 'E', id: 'Hi-Hat', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
  { key: 'A', id: 'Clap', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
  { key: 'S', id: 'Open-HH', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
  { key: 'D', id: 'Shaker', src: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
  { key: 'Z', id: 'Punchy Kick', src: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3' },
  { key: 'X', id: 'Side Stick', src: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3' },
  { key: 'C', id: 'Snare Roll', src: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' },
];








function DrumPad({ pad, playSound, power, volume }) {
  const handleKeyPress = (e) => {
    if (e.key.toUpperCase() === pad.key) {
      triggerSound();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });

  const originalBackgroundColor = "#f3f4f6"; // Define original color outside component

const triggerSound = () => {
  if (!power) return;

  const audio = document.getElementById(pad.key);
  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
  playSound(pad.id);

  // Flash background
  const body = document.body;
  const flashColor = getSoftPastelColor();

  body.style.transition = "none"; // reset transition instantly
  body.style.backgroundColor = flashColor;

  // Allow the flash to show briefly, then transition back
  setTimeout(() => {
    body.style.transition = "background-color 0.5s ease";
    body.style.backgroundColor = originalBackgroundColor;
  }, 50); // small delay to ensure flash is visible
};


  return (
    <div className="drum-pad" id={pad.id} onClick={triggerSound}>
      {pad.key}
      <audio className="clip" id={pad.key} src={pad.src}></audio>
    </div>
  );
}

function DrumMachine() {
  const [display, setDisplay] = React.useState("Ready");
  const [volume, setVolume] = React.useState(0.5);
  const [power, setPower] = React.useState(true);
  const [recording, setRecording] = React.useState([]);
  const [voiceBlob, setVoiceBlob] = React.useState(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const chunks = React.useRef([]);
  const recorder = React.useRef(null);

  const playSound = (id) => {
    setDisplay(id);
    setRecording((prev) => [...prev, id]);
  };

  const startVoiceRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.current = new MediaRecorder(stream);
    recorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setVoiceBlob(blob);
      chunks.current = [];
    };
    recorder.current.start();
    setIsRecording(true);
    setDisplay("🎙 Recording voice...");
  };

  const stopVoiceRecording = () => {
    if (recorder.current) recorder.current.stop();
    setIsRecording(false);
    setDisplay("✅ Voice Recorded");
  };

  const playRecording = async () => {
    if (voiceBlob) {
      const voiceAudio = new Audio(URL.createObjectURL(voiceBlob));
      voiceAudio.volume = volume;
      voiceAudio.play();
    }

    for (let id of recording) {
      const pad = pads.find(p => p.id === id);
      if (pad) {
        const audio = new Audio(pad.src);
        audio.volume = volume;
        audio.play();
        await new Promise(res => setTimeout(res, 500));
      }
    }
  };

  return (
    <div id="drum-machine">
      <h2>🎧 Drum + Voice Studio</h2>
      <p id="display">{display}</p>

      <div className="controls">
        <button onClick={() => setPower(p => !p)}>{power ? "Turn Off" : "Turn On"}</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
            if (power) setDisplay(`Volume: ${Math.round(e.target.value * 100)}`);
          }}
        />
        <br />
        <button onClick={playRecording}>▶️ Play All</button>
        <button onClick={() => setRecording([])}>🗑 Clear Pads</button>
        <br />
        {!isRecording ? (
          <button onClick={startVoiceRecording}>🎙 Start Voice</button>
        ) : (
          <button onClick={stopVoiceRecording}>⏹ Stop Voice</button>
        )}
      </div>

      <div className="pad-grid">
        {pads.map(pad => (
          <DrumPad
            key={pad.key}
            pad={pad}
            volume={volume}
            power={power}
            playSound={playSound}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<DrumMachine />, document.getElementById("root"));
