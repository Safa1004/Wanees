import type { Pair } from "./content";
export type StoryPage = {
  text: Pair;
  prompt: Pair;
  choices: [Pair, Pair];
  replies: [Pair, Pair];
};
export type Story = {
  id: string;
  title: Pair;
  subtitle: Pair;
  character: string;
  scene: string;
  color: string;
  pages: StoryPage[];
};
export const storybooks: Story[] = [
  {
    id: "pocket",
    title: ["Wanees and the pocket of courage", "ونيس وجيب الشجاعة"],
    subtitle: [
      "A little comfort can come along.",
      "شيء صغير يرافقنا ويمنحنا الراحة.",
    ],
    character: "wanees",
    scene: "stars",
    color: "sand",
    pages: [
      {
        text: [
          "Wanees was getting ready for a new place. His yellow boots were by the door, but his tummy felt fluttery. “I can be curious and worried at the same time,” he told his grown-up.",
          "كان ونيس يستعد للذهاب إلى مكان جديد. كان حذاؤه الأصفر قرب الباب، لكنه شعر برفرفة في بطنه. قال لمرافقه: «يمكن أن أشعر بالفضول والقلق معًا».",
        ],
        prompt: ["What could Wanees bring?", "ماذا يمكن أن يأخذ ونيس معه؟"],
        choices: [
          ["A little toy", "لعبة صغيرة"],
          ["A favourite book", "كتاب مفضّل"],
        ],
        replies: [
          ["A familiar toy could keep him company.", "قد تؤنسه لعبة مألوفة."],
          [
            "They could read a page together while waiting.",
            "يمكنهما قراءة صفحة معًا أثناء الانتظار.",
          ],
        ],
      },
      {
        text: [
          "At the entrance, Wanees held his grown-up’s hand. There were doors, chairs and people he had not met. He did not have to learn everything at once. First, they would find where to go.",
          "عند المدخل، أمسك ونيس بيد مرافقه. رأى أبوابًا وكراسي وأشخاصًا لم يقابلهم من قبل. لم يكن عليه أن يعرف كل شيء دفعة واحدة. أولًا، سيعرفان إلى أين يذهبان.",
        ],
        prompt: ["How could they find their way?", "كيف يمكنهما معرفة الطريق؟"],
        choices: [
          ["Ask at reception", "يسألان في الاستقبال"],
          ["Look at the signs together", "ينظران إلى اللوحات معًا"],
        ],
        replies: [
          [
            "“Could you show us where to go?” is a useful question.",
            "«هل يمكن أن ترينا أين نذهب؟» سؤال مفيد.",
          ],
          [
            "His grown-up could help read the signs.",
            "يمكن لمرافقه مساعدته في قراءة اللوحات.",
          ],
        ],
      },
      {
        text: [
          "While they waited, Wanees found a tiny star on the cover of his book. “Let’s imagine a whole sky,” he said. His grown-up imagined a moon. Wanees added a cloud shaped like a sheep.",
          "أثناء الانتظار، وجد ونيس نجمة صغيرة على غلاف كتابه. قال: «لنتخيّل سماء كاملة». تخيّل مرافقه قمرًا، وأضاف ونيس غيمة تشبه الخروف.",
        ],
        prompt: ["What would you add to their sky?", "ماذا تضيف إلى سمائهما؟"],
        choices: [
          ["A smiling moon", "قمرًا مبتسمًا"],
          ["A floating boat", "قاربًا يطفو"],
        ],
        replies: [
          [
            "Their moon had a warm, sleepy smile.",
            "كان لقمرهما وجه مبتسم ونعسان.",
          ],
          [
            "In an imaginary sky, a boat can sail through clouds!",
            "في سماء الخيال، يمكن لقارب أن يبحر بين الغيوم!",
          ],
        ],
      },
      {
        text: [
          "When it was time to meet the team, Wanees still had questions. That was all right. His little pocket held a comfort, and his grown-up was ready to listen. Courage did not mean having no worries. Today, it meant taking one small step together.",
          "عندما حان وقت مقابلة الفريق، بقيت لدى ونيس أسئلة. وهذا أمر عادي. كان في جيبه شيء يؤنسه، وكان مرافقه مستعدًا للاستماع. لم تكن الشجاعة تعني اختفاء القلق. اليوم، كانت تعني خطوة صغيرة معًا.",
        ],
        prompt: [
          "What would you like to tell Wanees?",
          "ماذا تود أن تقول لونيس؟",
        ],
        choices: [
          ["You can ask for help", "يمكنك طلب المساعدة"],
          ["One step is enough", "خطوة واحدة تكفي"],
        ],
        replies: [
          [
            "Wanees smiled. Asking for help is always welcome here.",
            "ابتسم ونيس. طلب المساعدة مرحّب به دائمًا هنا.",
          ],
          [
            "There is no race. A small step counts too.",
            "لا يوجد سباق. للخطوة الصغيرة قيمة أيضًا.",
          ],
        ],
      },
    ],
  },
  {
    id: "shell",
    title: ["Maryam and the listening shell", "مريم والصدفة التي تسمع"],
    subtitle: [
      "An afternoon of noticing little things.",
      "ظهيرة نلاحظ فيها الأشياء الصغيرة.",
    ],
    character: "maryam",
    scene: "coast",
    color: "sea",
    pages: [
      {
        text: [
          "Maryam sat with her aunt near the sea. The breeze lifted the edge of her sleeve. Beside her was a shell with a peach-coloured stripe. “Today we can just notice things,” her aunt said.",
          "جلست مريم مع خالتها قرب البحر. حرّكت النسمة طرف كمّها. وبجانبها صدفة عليها خط بلون الخوخ. قالت خالتها: «يمكننا اليوم أن نكتفي بملاحظة الأشياء».",
        ],
        prompt: [
          "What might Maryam notice first?",
          "ماذا قد تلاحظ مريم أولًا؟",
        ],
        choices: [
          ["The blue sea", "البحر الأزرق"],
          ["The soft sand", "الرمل الناعم"],
        ],
        replies: [
          [
            "The sea had so many shades of blue.",
            "كان للبحر درجات كثيرة من الأزرق.",
          ],
          [
            "Little patterns stretched across the sand.",
            "امتدت نقوش صغيرة فوق الرمل.",
          ],
        ],
      },
      {
        text: [
          "A small crab hurried sideways, then disappeared. Maryam laughed. A cloud drifted overhead. It looked a little like Amer’s kumma, or perhaps a giant fluffy pillow.",
          "أسرع سرطان صغير جانبًا ثم اختفى. ضحكت مريم. مرّت غيمة فوقها، بدت مثل كمّة عامر، أو ربما وسادة كبيرة منفوشة.",
        ],
        prompt: [
          "What does your imaginary cloud look like?",
          "كيف تبدو غيمتك الخيالية؟",
        ],
        choices: [
          ["A sleepy sheep", "خروف نعسان"],
          ["A great big turtle", "سلحفاة كبيرة جدًا"],
        ],
        replies: [
          [
            "A cloud-Wanees floated gently past.",
            "مرّ ونيس المصنوع من الغيم بهدوء.",
          ],
          [
            "The cloud turtle took its time crossing the sky.",
            "أخذت سلحفاة الغيم وقتها وهي تعبر السماء.",
          ],
        ],
      },
      {
        text: [
          "Maryam picked up the shell and listened. She heard a soft hush, and farther away, the waves. Then she put it down. There was no special sound she had to find. Quiet could be different for everyone.",
          "التقطت مريم الصدفة وأنصتت. سمعت حفيفًا خفيفًا، وفي البعيد صوت الموج. ثم وضعتها. لم يكن عليها العثور على صوت محدد. فقد يختلف الهدوء من شخص لآخر.",
        ],
        prompt: [
          "What would you like to imagine hearing?",
          "أي صوت تود أن تتخيّله؟",
        ],
        choices: [
          ["Gentle waves", "أمواجًا لطيفة"],
          ["A bird far away", "طائرًا بعيدًا"],
        ],
        replies: [
          [
            "In and out, the little waves came and went.",
            "جاءت الأمواج الصغيرة وذهبت.",
          ],
          [
            "A tiny bird called from somewhere in the distance.",
            "غرّد طائر صغير من مكان بعيد.",
          ],
        ],
      },
      {
        text: [
          "Before they left, Maryam placed the shell back on the sand. “I can take the memory with me,” she said. On the way home she imagined the peach stripe, the cloud turtle and the wide blue sea.",
          "قبل أن تغادرا، أعادت مريم الصدفة إلى الرمل. قالت: «يمكنني أن آخذ الذكرى معي». وفي الطريق إلى البيت، تخيّلت الخط الخوخي وسلحفاة الغيم والبحر الأزرق الواسع.",
        ],
        prompt: ["Which memory would you keep?", "أي ذكرى تختار؟"],
        choices: [
          ["The little shell", "الصدفة الصغيرة"],
          ["The funny cloud", "الغيمة المضحكة"],
        ],
        replies: [
          [
            "A little memory can travel anywhere with you.",
            "يمكن لذكرى صغيرة أن ترافقك إلى أي مكان.",
          ],
          [
            "Your imagination can bring that cloud back anytime.",
            "يمكن لخيالك أن يعيد تلك الغيمة في أي وقت.",
          ],
        ],
      },
    ],
  },
  {
    id: "question",
    title: ["Amer’s very good question", "سؤال عامر الجميل"],
    subtitle: [
      "You do not have to know all the answers.",
      "ليس عليك أن تعرف كل الإجابات.",
    ],
    character: "amer",
    scene: "garden",
    color: "clay",
    pages: [
      {
        text: [
          "Amer loved finding out how things worked. But in a room full of unfamiliar equipment, his questions hid like tiny crabs. His father sat beside him. “We can ask together,” he said.",
          "أحب عامر اكتشاف طريقة عمل الأشياء. لكن في غرفة مليئة بأدوات غير مألوفة، اختبأت أسئلته مثل سرطانات صغيرة. جلس والده بجانبه وقال: «يمكننا أن نسأل معًا».",
        ],
        prompt: [
          "Which question could Amer start with?",
          "بأي سؤال يمكن أن يبدأ عامر؟",
        ],
        choices: [
          ["What is that called?", "ما اسم هذه الأداة؟"],
          ["What happens next?", "ماذا سيحدث بعد ذلك؟"],
        ],
        replies: [
          [
            "Learning a name can make something feel more familiar.",
            "معرفة الاسم قد تجعل الشيء مألوفًا أكثر.",
          ],
          [
            "The team can explain the next step.",
            "يمكن للفريق شرح الخطوة التالية.",
          ],
        ],
      },
      {
        text: [
          "The clinician showed Amer a stethoscope. She explained that it helps the team listen to sounds inside the body. Amer looked at the curved tubing. “It looks like a friendly loop!” he said.",
          "أرت المختصة عامر سمّاعة الطبيب. شرحت أنها تساعد الفريق على الاستماع إلى أصوات داخل الجسم. نظر عامر إلى الأنبوب المنحني وقال: «إنه يشبه حلقة لطيفة!»",
        ],
        prompt: ["What would you like to ask about?", "عمّ تود أن تسأل؟"],
        choices: [
          ["The ear tips", "قطع الأذن"],
          ["The round chest piece", "قطعة الصدر المستديرة"],
        ],
        replies: [
          [
            "The ear tips are the parts the clinician listens through.",
            "قطع الأذن هي الأجزاء التي يستمع المختص من خلالها.",
          ],
          [
            "The clinician can show where and how the chest piece is used.",
            "يمكن للمختص شرح مكان وطريقة استخدام قطعة الصدر.",
          ],
        ],
      },
      {
        text: [
          "Amer had another question, but it felt too big to say. He whispered it to his father instead. His father listened, then helped him ask. A quiet question mattered just as much as a loud one.",
          "كان لدى عامر سؤال آخر، لكنه وجد صعوبة في قوله. همس به لوالده. استمع والده، ثم ساعده على طرحه. للسؤال الهادئ نفس أهمية السؤال المرتفع.",
        ],
        prompt: ["How could you share a question?", "كيف يمكنك مشاركة سؤال؟"],
        choices: [
          ["Tell my grown-up", "أخبر مرافقي"],
          ["Draw or write it", "أرسمه أو أكتبه"],
        ],
        replies: [
          [
            "You can ask someone you trust to help you speak.",
            "يمكنك طلب المساعدة في الكلام من شخص تثق به.",
          ],
          [
            "A drawing or a few words can begin a conversation.",
            "يمكن لرسم أو بضع كلمات أن تبدأ حوارًا.",
          ],
        ],
      },
      {
        text: [
          "On the way out, Amer counted the questions he had asked. Then he stopped counting. It did not matter how many. “I do not need to know everything,” he said. “I can keep asking.” His father nodded. That was a very good discovery.",
          "عند الخروج، عدّ عامر الأسئلة التي طرحها. ثم توقف عن العدّ. لم يكن العدد مهمًا. قال: «لا أحتاج أن أعرف كل شيء. يمكنني أن أواصل السؤال». أومأ والده. كان هذا اكتشافًا جميلًا.",
        ],
        prompt: ["Choose a thought to take with you.", "اختر فكرة تأخذها معك."],
        choices: [
          ["My questions matter", "أسئلتي مهمة"],
          ["I can ask again", "يمكنني أن أسأل مرة أخرى"],
        ],
        replies: [
          ["Every question deserves to be heard.", "يستحق كل سؤال أن يُسمع."],
          [
            "It is okay to ask for another explanation.",
            "لا بأس بطلب شرح آخر.",
          ],
        ],
      },
    ],
  },
  {
    id: "lantern",
    title: ["The lantern of little kindnesses", "فانوس اللطف الصغير"],
    subtitle: [
      "Three friends make room for one another.",
      "ثلاثة أصدقاء يفسحون مكانًا لبعضهم.",
    ],
    character: "wanees",
    scene: "stars",
    color: "sand",
    pages: [
      {
        text: [
          "One evening, Wanees, Amer and Maryam made a paper lantern with a grown-up. It had stars cut into its sides and a little battery light inside. “Let’s give each star a kind idea,” Maryam said.",
          "في إحدى الأمسيات، صنع ونيس وعامر ومريم فانوسًا ورقيًا مع شخص بالغ. كانت على جوانبه نجوم، وفي داخله ضوء صغير يعمل بالبطارية. قالت مريم: «لنعطِ كل نجمة فكرة لطيفة».",
        ],
        prompt: [
          "What could the first star mean?",
          "ماذا يمكن أن تعني النجمة الأولى؟",
        ],
        choices: [
          ["Listening to a friend", "الاستماع إلى صديق"],
          ["Making room beside me", "إفساح مكان بجانبي"],
        ],
        replies: [
          [
            "Listening gives a friend space to be themselves.",
            "الاستماع يمنح الصديق مساحة ليكون على طبيعته.",
          ],
          [
            "“There is a place for you here,” the star seemed to say.",
            "كأن النجمة تقول: «لك مكان هنا».",
          ],
        ],
      },
      {
        text: [
          "Amer wanted to tell a joke, but Wanees wanted a quiet minute. “We can do both, one at a time,” Amer said. They watched the little light together before the joke began.",
          "أراد عامر أن يقول نكتة، لكن ونيس أراد دقيقة هادئة. قال عامر: «يمكننا فعل الأمرين، واحدًا بعد الآخر». شاهدا الضوء الصغير معًا قبل أن تبدأ النكتة.",
        ],
        prompt: [
          "What could their quiet minute look like?",
          "كيف قد تكون دقيقتهما الهادئة؟",
        ],
        choices: [
          ["Watching the stars", "يشاهدان النجوم"],
          ["Sitting together", "يجلسان معًا"],
        ],
        replies: [
          [
            "The paper stars made soft shapes on the table.",
            "صنعت النجوم الورقية أشكالًا لطيفة على الطاولة.",
          ],
          [
            "Friends do not always have to fill the quiet with words.",
            "ليس على الأصدقاء أن يملؤوا الهدوء بالكلمات دائمًا.",
          ],
        ],
      },
      {
        text: [
          "Maryam’s paper star bent at one corner. “Oh,” she said. Wanees looked at it. “Now it looks like it is waving!” Maryam smiled. They kept the little waving star just as it was.",
          "انثنى طرف نجمة مريم الورقية. قالت: «آه». نظر ونيس إليها وقال: «تبدو الآن كأنها تلوّح!» ابتسمت مريم. احتفظوا بالنجمة الصغيرة التي تلوّح كما هي.",
        ],
        prompt: ["What would you name that star?", "بماذا تسمّي تلك النجمة؟"],
        choices: [
          ["The hello star", "نجمة مرحبًا"],
          ["The dancing star", "النجمة الراقصة"],
        ],
        replies: [
          [
            "Hello, little star. You belong here too.",
            "مرحبًا أيتها النجمة الصغيرة. لك مكان هنا أيضًا.",
          ],
          [
            "A little bend gave it a brand-new dance.",
            "منحتها الثنية الصغيرة رقصة جديدة.",
          ],
        ],
      },
      {
        text: [
          "At bedtime, the grown-up switched the lantern off. The light was gone, but the ideas stayed: listen, make room, take turns. Tomorrow, the three friends could carry those little kindnesses without any lantern at all.",
          "عند النوم، أطفأ الشخص البالغ الفانوس. اختفى الضوء، لكن الأفكار بقيت: نستمع، ونفسح مكانًا، ونتناوب. غدًا، يمكن للأصدقاء الثلاثة حمل هذا اللطف الصغير دون أي فانوس.",
        ],
        prompt: [
          "Which kindness would you choose tomorrow?",
          "أي لطف تختار للغد؟",
        ],
        choices: [
          ["Taking turns", "التناوب"],
          ["Asking how a friend feels", "سؤال صديق عن شعوره"],
        ],
        replies: [
          [
            "There is room for everyone to have a turn.",
            "هناك مساحة ليأخذ كل شخص دوره.",
          ],
          [
            "A small question can show someone you care.",
            "قد يُظهر سؤال صغير لشخص أنك تهتم به.",
          ],
        ],
      },
    ],
  },
];
