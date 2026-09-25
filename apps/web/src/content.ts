export type Pair = [string, string];
export const steps: {
  title: Pair;
  body: Pair;
  question: Pair;
  room: string;
}[] = [
  {
    title: ["Before we go", "قبل أن نذهب"],
    body: [
      "You and your grown-up can look at your appointment information together. Bring your questions and something familiar that helps you feel comfortable. Follow the instructions your own care team gives you.",
      "يمكنك مع من يرافقك مراجعة معلومات الموعد. خذ أسئلتك وشيئًا مألوفًا يساعدك على الراحة. اتبع التعليمات التي يعطيها فريق الرعاية لك.",
    ],
    question: [
      "What would you like to bring with you?",
      "ما الذي تحب أن تأخذه معك؟",
    ],
    room: "home",
  },
  {
    title: ["Hello, reception", "مرحبًا بالاستقبال"],
    body: [
      "At reception, your grown-up tells the team you have arrived. You may wait until it is your turn. You can ask where to sit or where to find a quieter space.",
      "يخبر مرافقك فريق الاستقبال بوصولكما. قد تنتظر قليلًا حتى يأتي دورك. يمكنك السؤال عن مكان للجلوس أو مكان أكثر هدوءًا.",
    ],
    question: [
      "You can say: “Could you tell me what happens next?”",
      "يمكنك القول: «هل تخبرني ماذا سيحدث بعد ذلك؟»",
    ],
    room: "reception",
  },
  {
    title: ["Meet the X-ray room", "نتعرّف على غرفة الأشعة"],
    body: [
      "An X-ray makes a picture of part of the inside of your body. A member of the imaging team explains what will happen. They may ask you to change clothes or remove items from the area being pictured. Ask your team who can stay with you.",
      "تلتقط الأشعة السينية صورة لجزء داخل جسمك. يشرح لك أحد أفراد فريق التصوير ما سيحدث. قد يطلب تغيير الملابس أو إزالة أشياء عن الجزء المراد تصويره. اسأل الفريق عمّن يمكنه البقاء معك.",
    ],
    question: [
      "What would you like the team to explain?",
      "ما الذي تريد أن يشرحه لك الفريق؟",
    ],
    room: "xray",
  },
  {
    title: ["Find your position", "نأخذ الوضع المناسب"],
    body: [
      "The team helps you find the position for your picture. You might stand, sit, or lie down. Let them know if something is uncomfortable. Wanees is showing a pretend example; your own team will guide you.",
      "يساعدك الفريق على اتخاذ الوضع المناسب للصورة. قد تقف أو تجلس أو تستلقي. أخبرهم إن شعرت بعدم الراحة. يعرض ونيس مثالًا توضيحيًا، وسيُرشدك فريقك إلى ما يناسبك.",
    ],
    question: [
      "You can say: “Can you help me get comfortable?”",
      "يمكنك القول: «هل تساعدني على الجلوس أو الاستلقاء براحة؟»",
    ],
    room: "xray",
  },
  {
    title: ["Time for the picture", "حان وقت الصورة"],
    body: [
      "The team may ask you to stay still briefly while they take the picture. Listen to their instructions. You can ask for help or a pause if you need one. Sometimes another picture is needed.",
      "قد يطلب منك الفريق البقاء دون حركة لفترة قصيرة لالتقاط الصورة. استمع لتعليماتهم. يمكنك طلب المساعدة أو الاستراحة عند الحاجة. أحيانًا يحتاج الفريق إلى صورة أخرى.",
    ],
    question: [
      "What helps you when you need a little support?",
      "ما الذي يساعدك عندما تحتاج إلى بعض الدعم؟",
    ],
    room: "xray",
  },
  {
    title: ["All finished for now", "انتهينا الآن"],
    body: [
      "The team tells you when the pictures are finished and explains the next step to your grown-up. You can ask when and how you will hear about the results. Take a moment to notice how you feel.",
      "يخبرك الفريق عند انتهاء التصوير ويشرح لمرافقك الخطوة التالية. يمكنكما السؤال عن موعد النتائج وكيفية الحصول عليها. خذ لحظة لتلاحظ شعورك.",
    ],
    question: [
      "What would you like to tell your grown-up?",
      "ما الذي تود أن تقوله لمرافقك؟",
    ],
    room: "exit",
  },
];
export const preferences: { question: Pair; choices: Pair[] }[] = [
  {
    question: ["Have you visited a hospital before?", "هل زرت مستشفى من قبل؟"],
    choices: [
      ["This is new to me", "هذه تجربة جديدة عليّ"],
      ["I have been before", "زرته من قبل"],
      ["I would rather skip this", "أفضل تخطّي السؤال"],
    ],
  },
  {
    question: [
      "How do you like things explained?",
      "كيف تحب أن تُشرح لك الأمور؟",
    ],
    choices: [
      ["One small step at a time", "خطوة صغيرة في كل مرة"],
      ["Show me first", "أرني أولًا"],
      ["Tell my grown-up with me", "اشرح لي ولمرافقي معًا"],
    ],
  },
  {
    question: [
      "What could you bring for comfort?",
      "ما الذي يمكنك إحضاره للشعور بالراحة؟",
    ],
    choices: [
      ["A favourite toy", "لعبتي المفضلة"],
      ["A book or quiet activity", "كتاب أو نشاط هادئ"],
      ["My own familiar item", "شيء مألوف من أغراضي"],
    ],
  },
  {
    question: ["What helps with sounds?", "ما الذي يساعدك مع الأصوات؟"],
    choices: [
      ["Tell me before a new sound", "أخبرني قبل أي صوت جديد"],
      ["A quieter place, if available", "مكان أهدأ إن كان متاحًا"],
      ["Ask me at the time", "اسألني في حينها"],
    ],
  },
  {
    question: ["How would you like to communicate?", "كيف تحب أن تتواصل؟"],
    choices: [
      ["Give me time to answer", "أعطني وقتًا للإجابة"],
      ["Let me point or use pictures", "دعني أشير أو أستخدم الصور"],
      ["My grown-up can help explain", "يمكن لمرافقي مساعدتي في الشرح"],
    ],
  },
  {
    question: [
      "What helps when you feel unsure?",
      "ما الذي يساعدك عند التردّد؟",
    ],
    choices: [
      ["Explain what is coming next", "اشرح لي الخطوة القادمة"],
      ["Ask before touching me", "اسألني قبل أن تلمسني"],
      ["Let me ask for a pause", "دعني أطلب استراحة"],
    ],
  },
];
export const checklist: Pair[] = [
  [
    "Appointment information and requested documents",
    "معلومات الموعد والمستندات المطلوبة",
  ],
  ["Questionnaires your team asked for", "الاستبيانات التي طلبها الفريق"],
  [
    "Medication information for your care team",
    "معلومات الأدوية لفريق الرعاية",
  ],
  ["A familiar comfort item", "شيء مألوف يساعد على الراحة"],
  ["A book or quiet activity", "كتاب أو نشاط هادئ"],
  ["Your questions for the team", "أسئلتك لفريق الرعاية"],
];
export const equipment: { id: string; name: Pair; use: Pair }[] = [
  {
    id: "xray",
    name: ["X-ray equipment", "جهاز الأشعة السينية"],
    use: [
      "Makes pictures of the inside of the body. This is an X-ray example, not an MRI or CT scanner.",
      "يلتقط صورًا لأجزاء داخل الجسم. هذا مثال للأشعة السينية، وليس للرنين المغناطيسي أو الأشعة المقطعية.",
    ],
  },
  {
    id: "stethoscope",
    name: ["Stethoscope", "سمّاعة الطبيب"],
    use: [
      "Helps a healthcare professional listen to sounds inside the body.",
      "تساعد المختص على الاستماع إلى الأصوات داخل الجسم.",
    ],
  },
  {
    id: "thermometer",
    name: ["Thermometer", "مقياس الحرارة"],
    use: [
      "Measures body temperature. Different thermometers are used in different ways.",
      "يقيس حرارة الجسم. تختلف طريقة الاستخدام باختلاف نوع المقياس.",
    ],
  },
];
export const resources: {
  id: string;
  title: Pair;
  category: Pair;
  body: Pair;
  audience: "child" | "parent";
}[] = [
  {
    id: "story",
    title: ["Wanees takes a picture", "ونيس يلتقط صورة"],
    category: ["Story", "قصة"],
    body: [
      "Wanees had a question: “What happens next?” The imaging team explained the room and helped him find a position. When he felt unsure, he asked for help. His grown-up listened. After the pictures, they asked the team about the next step. You can ask questions too.",
      "كان لدى ونيس سؤال: «ماذا سيحدث بعد ذلك؟» شرح الفريق الغرفة وساعده في اتخاذ الوضع المناسب. عندما تردّد، طلب المساعدة. استمع مرافقه إليه. بعد التصوير سألا الفريق عن الخطوة التالية. يمكنك أيضًا طرح أسئلتك.",
    ],
    audience: "child",
  },
  {
    id: "talk",
    title: ["Making room for questions", "مساحة للأسئلة"],
    category: ["For grown-ups", "للأهل"],
    body: [
      "Ask what your child already knows and what they would like explained. Listen without correcting their feelings. Keep explanations short and truthful, and let the care team answer procedure-specific questions. It is okay to say you do not know yet. This draft is a conversation aid, not clinical guidance.",
      "اسأل الطفل عمّا يعرفه وما يود فهمه. استمع دون تصحيح مشاعره. استخدم شرحًا قصيرًا وصادقًا ودع فريق الرعاية يجيب عن الأسئلة الخاصة بالإجراء. لا بأس بالقول إنك لا تعرف بعد. هذه مسودة للمساعدة في الحوار وليست إرشادات سريرية.",
    ],
    audience: "parent",
  },
  {
    id: "planner",
    title: ["My visit planner", "مخطط زيارتي"],
    category: ["Printable", "للطباعة"],
    body: [
      "My visit • My questions • What I would like to bring • What helps me feel comfortable",
      "زيارتي • أسئلتي • ما أود إحضاره • ما يساعدني على الراحة",
    ],
    audience: "child",
  },
  {
    id: "colour",
    title: ["A little colour, a little calm", "ألوان ولحظة هادئة"],
    category: ["Printable", "للطباعة"],
    body: [
      "An original Wanees colouring sheet. Print it and choose your own colours.",
      "ورقة تلوين أصلية لونيس. اطبعها واختر ألوانك المفضلة.",
    ],
    audience: "child",
  },
];
