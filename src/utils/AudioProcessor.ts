export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private onAudioData: (base64: string) => void;
  private targetSampleRate = 24000;
  private isProcessing = false;

  constructor(onAudioData: (base64: string) => void) {
    this.onAudioData = onAudioData;
  }

  start(stream: MediaStream) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    console.log(" startingggagafda")

    // Create AudioContext
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)({
      sampleRate: this.targetSampleRate, // Try to request 24kHz directly
    });

    // If browser doesn't support requested sample rate, we might need manual resampling
    // But for now let's rely on the context to handle input sample rate mismatch if possible,
    // or checks.
    // NOTE: Many browsers ignore the sampleRate param in constructor or clamp it.
    // If audioContext.sampleRate is NOT 24000, we need to resample.

    this.sourceNode = this.audioContext.createMediaStreamSource(stream);

    // Buffer size 4096 is a good balance between latency and performance
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (!this.isProcessing) return;

      const inputData = e.inputBuffer.getChannelData(0);
      let pcmData: Int16Array;

      // Resample if necessary
      if (this.audioContext!.sampleRate !== this.targetSampleRate) {
        // Simple linear interpolation / downsampling
        pcmData = this.resampleAndConvert(
          inputData,
          this.audioContext!.sampleRate,
          this.targetSampleRate
        );
      } else {
        pcmData = this.floatTo16BitPCM(inputData);
      }

      // Encode to Base64
      const base64 = this.arrayBufferToBase64(pcmData.buffer as ArrayBuffer);
      this.onAudioData(base64);
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
  }

  stop() {
    this.isProcessing = false;
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  private floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  }

  private resampleAndConvert(
    input: Float32Array,
    sampleRate: number,
    targetRate: number
  ): Int16Array {
    if (sampleRate === targetRate) {
      return this.floatTo16BitPCM(input);
    }

    const ratio = sampleRate / targetRate;
    const newLength = Math.round(input.length / ratio);
    const output = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const originalIndex = i * ratio;
      // Simple nearest-neighbor or linear could be used here.
      // Doing simple decimation/nearest for speed as per requirements "small packets".
      // Proper resampling requires filters but let's test this efficiently first.
      const index = Math.floor(originalIndex);
      const val = input[index] || 0; // Guard against out of bounds

      const s = Math.max(-1, Math.min(1, val));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
