import {GoogleGenAI} from '@google/genai';
import wav from 'wav';
import path from "path";
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve("../.env") });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestionAudio() {
    const question = await generateQuestion();
    await generateAudio(question);
}

async function generateQuestion() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Give one behavioural based interview question for a software developer role. Just the question, nothing else",
  });
  return response.text;
}

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function generateAudio(question) {

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say: ${question}` }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
               },
            },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
}
