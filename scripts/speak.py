# Spricht die fehlenden Aufnahmen mit der Stimme Thorsten ein. Aufruf: speak.py <liste.json> <stimme.onnx>
import json, os, subprocess, sys, wave
from piper import PiperVoice, SynthesisConfig

CEDILLA = "̧"
OUT = "public/audio"


def keep_ich_sound(sentence):
    # Piper zerlegt das ç des ich-Lauts, die Stimme kennt aber nur das ganze Zeichen.
    out = []
    for phoneme in sentence:
        if phoneme == CEDILLA and out and out[-1] == "c":
            out[-1] = "ç"
        else:
            out.append(phoneme)
    return out


todo = json.load(open(sys.argv[1], encoding="utf8"))
args = {"espeak_data_dir": os.environ["ESPEAK_DIR"]} if "ESPEAK_DIR" in os.environ else {}
voice = PiperVoice.load(sys.argv[2], **args)
phonemize = voice.phonemize
voice.phonemize = lambda text: [keep_ich_sound(s) for s in phonemize(text)]

for item in todo:
    raw = f"{OUT}/{item['file']}.wav"
    with wave.open(raw, "wb") as w:
        voice.synthesize_wav(item["text"], w, syn_config=SynthesisConfig(length_scale=1.12))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-ac", "1", "-b:a", "48k", f"{OUT}/{item['file']}"], check=True)
    os.remove(raw)
    print(item["file"])
