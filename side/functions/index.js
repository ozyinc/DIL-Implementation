const functions = require("firebase-functions");

const vision = require('@google-cloud/vision');


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.evaluateWriting = functions.https.onRequest(async (request, response) => {
    functions.logger.info("received image to analyse");
    // let result = '';

    //Call Google Vision API
    const client = new vision.ImageAnnotatorClient();

    const fileName = './test.png';

    // Read a local image as a text document
    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;

    console.log(`Full text: ${fullTextAnnotation.text}`);
    fullTextAnnotation.pages.forEach(page => {
        page.blocks.forEach(block => {
            console.log(`Block confidence: ${block.confidence}`);
            block.paragraphs.forEach(paragraph => {
                console.log(`Paragraph confidence: ${paragraph.confidence}`);
                paragraph.words.forEach(word => {
                const wordText = word.symbols.map(s => s.text).join('');
                console.log(`Word text: ${wordText}`);
                console.log(`Word confidence: ${word.confidence}`);
                word.symbols.forEach(symbol => {
                    console.log(`Symbol text: ${symbol.text}`);
                    console.log(`Symbol confidence: ${symbol.confidence}`);
                });
                });
            });
        });
    });


    response.json(fullTextAnnotation);
})