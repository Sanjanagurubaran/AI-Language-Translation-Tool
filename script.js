const translateBtn =
document.getElementById("translateBtn");

const outputText =
document.getElementById("outputText");



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

    recognition.lang = "en-US";

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

    };

    recognition.onerror = () => {

        voiceBtn.innerHTML =
        '<i class="fa-solid fa-microphone"></i> Speak';

        alert("Voice recognition failed");

    };

});



/* =========================
   TRANSLATE BUTTON
========================= */

translateBtn.addEventListener("click", async () => {

    const inputText =
    document.getElementById("inputText").value;

    const sourceLang =
    document.getElementById("sourceLang").value;

    const targetLang =
    document.getElementById("targetLang").value;

    if(inputText.trim() === ""){

        alert("Please enter text");

        return;

    }

    outputText.innerHTML = "Translating...";

    try{

        const url =
`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`;

        const response = await fetch(url);

        const data = await response.json();

        let translated = "";

        data[0].forEach(item => {

            translated += item[0];

        });




        /* Tamil Corrections */

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

        outputText.innerHTML = translated;

    }

    catch(error){

        outputText.innerHTML =
        "Translation failed.";

        console.log(error);

    }

});