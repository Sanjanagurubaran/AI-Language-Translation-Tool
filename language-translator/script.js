const translateBtn =
document.getElementById("translateBtn");

const outputText =
document.getElementById("outputText");

const inputBox =
document.getElementById("inputText");


/* =========================
   COPY BUTTON
========================= */

const copyBtn =
document.getElementById("copyBtn");

copyBtn.addEventListener("click", () => {

    const translated =
    outputText.innerText;

    navigator.clipboard.writeText(translated);

    alert("Copied!");

});


/* =========================
   SWAP BUTTON
========================= */

const swapBtn =
document.querySelector(".swap");

swapBtn.addEventListener("click", () => {

    const source =
    document.getElementById("sourceLang");

    const target =
    document.getElementById("targetLang");

    let temp = source.value;

    source.value = target.value;

    target.value = temp;

});


/* =========================
   SPEECH TO TEXT
========================= */

const voiceBtn =
document.getElementById("voiceBtn");

voiceBtn.addEventListener("click", () => {

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    const recognition =
    new SpeechRecognition();

    let sourceLang =
    document.getElementById("sourceLang").value;

    const languageMap = {

        "en": "en-US",

        "ta": "ta-IN",

        "hi": "hi-IN",

        "te": "te-IN",

        "ml": "ml-IN",

        "fr": "fr-FR"

    };

    recognition.lang =
    languageMap[sourceLang] || "en-US";

    recognition.start();

    voiceBtn.innerHTML =
    "Listening...";

    recognition.onresult = (event) => {

        const transcript =
        event.results[0][0].transcript;

        document.getElementById("inputText").value =
        transcript;

        voiceBtn.innerHTML =
        '<i class="fa-solid fa-microphone"></i> Speak';

        translateText();

    };

    recognition.onerror = () => {

        voiceBtn.innerHTML =
        '<i class="fa-solid fa-microphone"></i> Speak';

        alert("Voice recognition failed");

    };

});


/* =========================
   TRANSLATION HISTORY
========================= */

const historyList =
document.getElementById("historyList");

function saveHistory(input, translated){

    let history =
    JSON.parse(localStorage.getItem("translations"))
    || [];

    history.unshift({

        input,

        translated

    });

    localStorage.setItem(
        "translations",
        JSON.stringify(history)
    );

    loadHistory();

}


function loadHistory(){

    let history =
    JSON.parse(localStorage.getItem("translations"))
    || [];

    historyList.innerHTML = "";

    history.forEach(item => {

        const li =
        document.createElement("li");

        li.innerHTML =
        `<b>Input:</b> ${item.input}
        <br>
        <b>Output:</b> ${item.translated}`;

        historyList.appendChild(li);

    });

}

loadHistory();


/* =========================
   CLEAR HISTORY
========================= */

const clearHistoryBtn =
document.getElementById("clearHistoryBtn");

clearHistoryBtn.addEventListener("click", () => {

    const confirmClear =
    confirm("Clear all history?");

    if(confirmClear){

        localStorage.removeItem("translations");

        historyList.innerHTML = "";

    }

});


/* =========================
   OCR IMAGE TEXT EXTRACTION
========================= */

const imageInput =
document.getElementById("imageInput");

imageInput.addEventListener("change", async () => {

    const file =
    imageInput.files[0];

    if(!file) return;

    outputText.innerHTML =
    "Extracting text from image...";

    const result =
    await Tesseract.recognize(
        file,
        "eng"
    );

    document.getElementById("inputText").value =
    result.data.text;

    outputText.innerHTML =
    "Text Extracted Successfully";

    translateText();

});


/* =========================
   DOWNLOAD PDF
========================= */

const pdfBtn =
document.getElementById("pdfBtn");

pdfBtn.addEventListener("click", () => {

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    const input =
    document.getElementById("inputText").value;

    const translated =
    outputText.innerText;

    doc.setFontSize(16);

    doc.text("AI Language Translator", 20, 20);

    doc.setFontSize(12);

    doc.text("Input Text:", 20, 40);

    doc.text(input, 20, 50);

    doc.text("Translated Text:", 20, 80);

    doc.text(translated, 20, 90);

    doc.save("translation.pdf");

});


/* =========================
   THEME TOGGLE
========================= */

const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }

    else{

        themeToggle.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});
/* =========================
   CAMERA OCR TRANSLATION
========================= */

const video =
document.getElementById("video");

const canvas =
document.getElementById("canvas");

const cameraBtn =
document.getElementById("cameraBtn");

const captureBtn =
document.getElementById("captureBtn");

let stream;


/* OPEN CAMERA */

cameraBtn.addEventListener("click", async () => {

    stream =
    await navigator.mediaDevices.getUserMedia({

        video:true

    });

    video.srcObject = stream;

    video.style.display = "block";

});


/* CAPTURE IMAGE */

captureBtn.addEventListener("click", async () => {

    const context =
    canvas.getContext("2d");

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

    context.drawImage(
        video,
        0,
        0
    );

    outputText.innerHTML =
    "Extracting text from image...";

    const result =
    await Tesseract.recognize(
        canvas,
        "eng"
    );

    document.getElementById("inputText").value =
    result.data.text;

    translateText();

});


/* =========================
   MAIN TRANSLATE FUNCTION
========================= */

async function translateText(){

    const inputText =
    document.getElementById("inputText").value;

    let sourceLang =
    document.getElementById("sourceLang").value;

    const targetLang =
    document.getElementById("targetLang").value;

    const detectedLangText =
    document.getElementById("detectedLang");

    if(inputText.trim() === ""){

        return;

    }

    outputText.innerHTML =
    "Translating...";


    /* =========================
       AUTO LANGUAGE DETECTION
    ========================= */

    if(sourceLang === "auto"){

        const text =
        inputText.trim();

        if(/[அ-ஹ]/.test(text)){

            sourceLang = "ta";

            detectedLangText.innerHTML =
            "Detected Language: Tamil";

        }

        else if(/[ఀ-౿]/.test(text)){

            sourceLang = "te";

            detectedLangText.innerHTML =
            "Detected Language: Telugu";

        }

        else if(/[ഀ-ൿ]/.test(text)){

            sourceLang = "ml";

            detectedLangText.innerHTML =
            "Detected Language: Malayalam";

        }

        else if(/[ऀ-ॿ]/.test(text)){

            sourceLang = "hi";

            detectedLangText.innerHTML =
            "Detected Language: Hindi";

        }

        else{

            sourceLang = "en";

            detectedLangText.innerHTML =
            "Detected Language: English";

        }

    }

    else{

        detectedLangText.innerHTML = "";

    }


    try{

        const url =
`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`;

        const response =
        await fetch(url);

        const data =
        await response.json();

        let translated = "";

        data[0].forEach(item => {

            translated += item[0];

        });


        /* =========================
           CUSTOM TAMIL CORRECTIONS
        ========================= */

        const customTamil = {

            "hello": "வணக்கம்",

            "hi": "வணக்கம்",

            "good morning":
            "காலை வணக்கம்",

            "thank you":
            "நன்றி",

            "how are you":
            "நீங்கள் எப்படி இருக்கிறீர்கள்"

        };


        if(targetLang === "ta"){

            const lowerText =
            inputText.toLowerCase().trim();

            if(customTamil[lowerText]){

                translated =
                customTamil[lowerText];

            }

        }


        /* =========================
           SHOW OUTPUT
        ========================= */

        outputText.innerHTML =
        translated;


        /* =========================
           SAVE HISTORY
        ========================= */

        saveHistory(inputText, translated);


        /* =========================
           TEXT TO SPEECH
        ========================= */

        const speech =
        new SpeechSynthesisUtterance(
            translated
        );

        const speechMap = {

            "en": "en-US",

            "ta": "ta-IN",

            "hi": "hi-IN",

            "te": "te-IN",

            "ml": "ml-IN",

            "fr": "fr-FR"

        };

        speech.lang =
        speechMap[targetLang];

        window.speechSynthesis.speak(speech);

    }

    catch(error){

        outputText.innerHTML =
        "Translation failed.";

        console.log(error);

    }

}


/* =========================
   TRANSLATE BUTTON
========================= */

translateBtn.addEventListener("click", () => {

    translateText();

});


/* =========================
   REAL TIME TRANSLATION
========================= */

let typingTimer;

inputBox.addEventListener("input", () => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {

        if(inputBox.value.trim() !== ""){

            translateText();

        }

    }, 800);

});