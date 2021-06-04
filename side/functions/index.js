const functions = require("firebase-functions");

const vision = require('@google-cloud/vision');

const cors = require('cors')({origin: true});

const textToSpeech = require('@google-cloud/text-to-speech');
const ttsclient = new textToSpeech.TextToSpeechClient()


const analyseMultipleChoice = function(answer, correct) {
  return correct === answer;
}
const analyseWriting = async function(answer, correct) {
  functions.logger.info("received image to analyse");

  //Call Google Vision API
  const client = new vision.ImageAnnotatorClient();

  const fileName = './test.png';

  const image = answer;

  const imageDetectionReq = image ? {
      image: {
        content: Buffer.from(image, 'base64')
      }
  } : fileName;


  // Read a local image as a text document
  const [result] = await client.documentTextDetection(imageDetectionReq);
  const fullTextAnnotation = result.fullTextAnnotation;

  if(!fullTextAnnotation) {
    return false;
  }

  let residue = fullTextAnnotation.text.trim().toLowerCase().replace(correct.toLowerCase(), '');

  return residue.length === 0;
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.evaluateWriting = functions.runWith({
    // Ensure the function has enough memory and time
    // to process large files
    timeoutSeconds: 300,
    memory: "128MB",
  }).https.onRequest(async (request, response) => {
    return cors(request, response, async () => {

        const client = new vision.ImageAnnotatorClient();

        const fileName = './test.png';

        const image = request.body.imageb64;

        const imageDetectionReq = image ? {
            image: {
              content: Buffer.from(image, 'base64')
            }
        } : fileName;


        // Read a local image as a text document
        const [result] = await client.documentTextDetection(imageDetectionReq);
        const fullTextAnnotation = result.fullTextAnnotation;

        response.json(fullTextAnnotation);

    });

});

exports.submitLevelAssessment = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: "128MB",
}).https.onRequest(async (request, response) => {
  return cors(request, response, async () => {

    let questions = request.body;

    let results={
      level: 0,
      results: []
    }

    let countCorrect = 0;

    for(let i=0; i<questions.length; i++) {
      let result;
      switch(questions[i].type) {
        case 'MultipleChoice':
          result = analyseMultipleChoice(questions[i].answer, questions[i].correctAnswer)
          results.results.push({
            questionID: questions[i].questionID,
            result: result
          });
          break;
        case 'Handwriting':
        result = await analyseWriting(questions[i].answer, questions[i].correctAnswer)
        results.results.push({
          questionID: questions[i].questionID,
          result: result
        });
        break;
        default:
          break;
      }
      if(result) countCorrect++;
    }

    results.level = Math.floor( (countCorrect/results.results.length) * 5 + 1 )

    results.level = Math.min(results.level, 5);

    response.json(results)

  });

});

exports.getSpeechFromText = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {



    var text = request.body.text;

    const options = {
        input: {text: text},
        // Select the language and SSML voice gender (optional)
        voice: {languageCode: 'en-US', ssmlGender: 'MALE'},
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'LINEAR16', pitch: '5.0' },
    };

    const audio = await ttsclient.synthesizeSpeech(options);

    response.json({
            text: text,
            audioBuffer: audio[0].audioContent
        });

  });
});
