const functions = require("firebase-functions");

const vision = require('@google-cloud/vision');

const cors = require('cors')({origin: true});

const analyseMultipleChoice = function(answer, correct) {
  return correct == answer;
}
const analyseWriting = async function(answer, correct) {
  functions.logger.info("received image to analyse");
  // let result = '';

  //base64 image: https://forum.freecodecamp.org/t/unable-to-detect-text-in-a-base64-image-uri-in-google-cloud-vision/421650

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

  console.log(`Full text: ${fullTextAnnotation.text}`);
  let residue = fullTextAnnotation.text.trim().toLowerCase().replace(correct.toLowerCase(), '');

  if(residue.length > 0) {
    for(let c of residue) {
      if(c >= 'a' && c<='z') {
        return false;
      }
    }
  }

  return true;
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
       
        functions.logger.info("received image to analyse");
        // let result = '';

        //base64 image: https://forum.freecodecamp.org/t/unable-to-detect-text-in-a-base64-image-uri-in-google-cloud-vision/421650

        //Call Google Vision API
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

        console.log(`Full text: ${fullTextAnnotation.text}`);
        // fullTextAnnotation.pages.forEach(page => {
        //     page.blocks.forEach(block => {
        //         console.log(`Block confidence: ${block.confidence}`);
        //         block.paragraphs.forEach(paragraph => {
        //             console.log(`Paragraph confidence: ${paragraph.confidence}`);
        //             paragraph.words.forEach(word => {
        //             const wordText = word.symbols.map(s => s.text).join('');
        //             console.log(`Word text: ${wordText}`);
        //             console.log(`Word confidence: ${word.confidence}`);
        //             word.symbols.forEach(symbol => {
        //                 console.log(`Symbol text: ${symbol.text}`);
        //                 console.log(`Symbol confidence: ${symbol.confidence}`);
        //             });
        //             });
        //         });
        //     });
        // });


        // response.json(imageDetectionReq);
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
     
    //structure: [{questionID:, questionType, correctAnswer, userAnswer:}]
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

    response.json(results)
      
  });
  
});