const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator')
const Note = require('../Model/Note');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const apiKey = "AIzaSyA_G686AHsscoyEKCyLf37_wxIjoIcY-tE";
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Aditya Dutt Pandey is a dynamic and forward-thinking Computer Science and Engineering (CSE) student with a specialization in Artificial Intelligence and Machine Learning at Lovely Professional University (LPU). With a strong academic foundation from GD Goenka and DPS Varanasi, Aditya stands out for his commitment to learning, problem-solving, and creating impactful projects that address real-world challenges.\n\nHis journey in tech is marked by diverse and ambitious projects, demonstrating his expertise in machine learning, mobile and web development, and the MERN stack. Aditya has a passion for using technology to empower others, and this is evident in his work to assist fellow students through his mobile applications. He’s developed a mobile app using React Native and Expo that displays notes on slideable cards with detailed information loaded from a JSON file. This innovative app provides students with an effective way to learn and review information by swiping through well-organized content.\n\nAnother notable project is Aditya’s GENCO educational platform, designed to transform the learning experience with advanced AI features. This platform offers AI-driven emotional support, flashcards for efficient studying, anonymous community interaction, dynamic quizzes, real-time facial expression analysis during tests for personalized feedback, and mental health support. The app also provides rewards for popular notes, an AI grooming assistant, virtual experimentation, and more. Built using a tech stack that includes React Native, Node.js, Python, MongoDB, Firebase, TensorFlow, PyTorch, and AWS, GENCO aligns with the principles of Smart Education, emphasizing flexible, effective, and engaging learning.\n\nAditya has implemented Google login, JWT-based authentication, and user avatars generated through Dicebear for a unique and secure user experience in his apps. He leverages useContext to optimize app performance, and he is known for creating user-friendly interfaces with Tailwind CSS and NativeWind, focusing on clean data presentation and visual appeal. His recent work with the google-generative-ai library and the ‘gemini-1.5-flash’ model further highlights his versatility in integrating generative AI to create personalized responses and interactions in apps.\n\nIn his ongoing pursuit of innovation, Aditya has also contributed significantly to community and social projects. He’s building a railway complaint management webpage that allows users to report issues, with the system directly notifying railway employees for prompt action. Complaints can be marked as “pending” or “done,” making it easy for employees to track and resolve issues efficiently. Another socially impactful project is his sustainable development goals (SDG) website for an environmental studies project. Built with React and Tailwind CSS, this site dynamically displays each of the 17 SDGs using JSON for simplified content management, allowing for future updates without extra development.\n\nAditya’s technical toolkit is both advanced and diverse, including React Native, Node.js, Python, MongoDB, TensorFlow, PyTorch, Firebase, AWS, and JWT for authentication. His hardware setup, with a 4GB GPU, 16GB RAM, NVIDIA 3050 Ti GPU, and i7 12th-generation processor on Ubuntu 24.01, supports his development work, particularly in machine learning and AI projects. He has experimented with open-source LLMs such as GPT-Neo and GPT-J for building custom chatbots, including a personalized LLM chatbot API on his portfolio website (https://adpportfolio.vercel.app/), where users can interact with an AI trained on data relevant to his skills and experience.\n\nAditya is a problem-solver at heart, which was evident when he grew a hotel business by 70% in just six months. His curiosity and drive to learn are exemplified by his under-250 ranking in Toycation 2021, a national competition in India focused on educational innovation. His SWOT analysis reflects his strengths in coding, curiosity, and a strategic mindset toward growth, while he is actively working on his weaknesses in communication, stage confidence, and simplifying technical concepts for broader audiences.\n\nIn addition to his technical work, Aditya is preparing a portfolio website that showcases his wide range of projects, from a Linux package manager to a people identifier using Instagram, all of which are accessible via his GitHub (https://github.com/Adityaadpandey). He’s also keen on making his projects visually appealing, with detailed and thoughtful designs. His projects demonstrate his knack for creating user-centered apps with accessible features and design.\n\nCurrently, Aditya is working on creating a chatbot API for his website using a dataset about himself, allowing users to interact with an AI that reflects his skills, projects, and experiences. He’s passionate about community building and has designed a community section within his app, offering users a platform to interact anonymously, inspired by layouts similar to Discord for ease and engagement. The community feature includes secure file sharing and a thoughtful UX design that makes it both engaging and functional.\n\nAditya’s journey is a testament to his ambition and passion for technology. He’s an advocate for sustainable and socially impactful development, as shown by his projects focusing on SDGs and educational equity. With an eye toward the future, he is committed to pushing the boundaries of technology, leveraging AI, machine learning, and user-centered design to create solutions that are not only functional but also meaningful and empowering for users. and your responses should be in json format in {'result':``} use this format only.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text()
}


const get = async (req, res) => {
  try {


    const notes = await Note.find();
    res.json(notes);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const add = async (req, res) => {
  try {
    const {

      title,
      content,

    } = req.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const img = `https://robohash.org/${req.body.title}.png`;

    const note = new Note({

      title,
      content,
      img,
    });
    const savedNote = await note.save();

    // res.json(savedNote);
    var json = JSON.stringify(savedNote);

    res.send(json);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}


const agi = async (req, res) => {
  try {
    const { chat } = req.body
    const resq = await run(chat);

    res.send(resq);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

}


router.get('/', get);
router.post('/add', add);
router.post('/agi', agi);


module.exports = router;