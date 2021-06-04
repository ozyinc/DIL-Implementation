const functions = require('firebase-functions');

const vision = require('@google-cloud/vision');

const cors = require('cors')({ origin: true });

const textToSpeech = require('@google-cloud/text-to-speech');

const ttsclient = new textToSpeech.TextToSpeechClient();

const analyseMultipleChoice = function (answer, correct) {
  return correct === answer;
};
const analyseWriting = async function (answer, correct) {
  functions.logger.info('received image to analyse');

  // Call Google Vision API
  const client = new vision.ImageAnnotatorClient();

  const fileName = './test.png';

  const image = answer;

  const imageDetectionReq = image ? {
    image: {
      content: Buffer.from(image, 'base64'),
    },
  } : fileName;

  // Read a local image as a text document
  const [result] = await client.documentTextDetection(imageDetectionReq);
  const { fullTextAnnotation } = result;

  if (!fullTextAnnotation) {
    return false;
  }

  const residue = fullTextAnnotation.text.trim().toLowerCase().replace(correct.toLowerCase(), '');

  return residue.length === 0;
};

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

exports.evaluateWriting = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: '128MB',
}).https.onRequest(async (request, response) => cors(request, response, async () => {
  const client = new vision.ImageAnnotatorClient();

  const fileName = './test.png';

  const image = request.body.imageb64;

  const imageDetectionReq = image ? {
    image: {
      content: Buffer.from(image, 'base64'),
    },
  } : fileName;

  // Read a local image as a text document
  const [result] = await client.documentTextDetection(imageDetectionReq);
  const { fullTextAnnotation } = result;

  response.json(fullTextAnnotation);
}));

exports.submitLevelAssessment = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: '128MB',
}).https.onRequest(async (request, response) => cors(request, response, async () => {
  const questions = request.body;

  const results = {
    level: 0,
    results: [],
  };

  let countCorrect = 0;

  for (let i = 0; i < questions.length; i++) {
    let result;
    switch (questions[i].type) {
      case 'MultipleChoice':
        result = analyseMultipleChoice(questions[i].answer, questions[i].correctAnswer);
        results.results.push({
          questionID: questions[i].questionID,
          result,
        });
        break;
      case 'Handwriting':
        result = await analyseWriting(questions[i].answer, questions[i].correctAnswer);
        results.results.push({
          questionID: questions[i].questionID,
          result,
        });
        break;
      default:
        break;
    }
    if (result) countCorrect++;
  }

  results.level = Math.floor((countCorrect / results.results.length) * 5 + 1);

  results.level = Math.min(results.level, 5);

  response.json(results);
}));

exports.getSpeechFromText = functions.https.onRequest((request, response) => cors(request, response, async () => {
  const { text } = request.body;

  const options = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'LINEAR16', pitch: '5.0' },
  };

  const audio = await ttsclient.synthesizeSpeech(options);

  response.json({
    text,
    audioBuffer: audio[0].audioContent,
  });
}));
