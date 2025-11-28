import { AssessmentType, AssessmentConfig, Option, Question, SeverityLevel } from './types';

// --- ADHD Data (Conners Parent Symptom Questionnaire - 48 Items) ---
const adhdQuestions: Question[] = [
  { id: 1, text: "撕东西（包括指甲、手指、头发、衣服等）", dimension: "其他行为" },
  { id: 2, text: "对成人冲撞,言行粗鲁冒失", dimension: "品行问题" },
  { id: 3, text: "与小朋友同学合不来", dimension: "其他行为" },
  { id: 4, text: "容易冲动", dimension: "冲动-多动" },
  { id: 5, text: "做事情时喜欢把持、操纵", dimension: "冲动-多动" },
  { id: 6, text: "吸吮和咀嚼（拇指、衣服、毯子等）", dimension: "其他行为" },
  { id: 7, text: "容易哭泣", dimension: "其他行为" },
  { id: 8, text: "容易被激怒", dimension: "品行问题" },
  { id: 9, text: "喜欢空想", dimension: "其他行为" },
  { id: 10, text: "学习有困难", dimension: "学习问题" },
  { id: 11, text: "总觉得“局促不安”", dimension: "冲动-多动" },
  { id: 12, text: "害怕（新情况、生人或者新地方）及怕去学校", dimension: "焦虑" },
  { id: 13, text: "不安静,常常十分活跃", dimension: "冲动-多动" },
  { id: 14, text: "好破坏", dimension: "品行问题" },
  { id: 15, text: "说谎或说些无中生有的事", dimension: "其他行为" },
  { id: 16, text: "害羞", dimension: "焦虑" },
  { id: 17, text: "比其他同龄儿童更容易闯祸", dimension: "其他行为" },
  { id: 18, text: "和同龄儿童比语言能力较差（如婴儿样讲话、口吃、语言难以理解等）", dimension: "其他行为" },
  { id: 19, text: "不承认错误或责怪别人", dimension: "品行问题" },
  { id: 20, text: "好争吵", dimension: "品行问题" },
  { id: 21, text: "好噘嘴,生闷气", dimension: "品行问题" },
  { id: 22, text: "有时自行拿父母的钱或他人的钱或东西", dimension: "品行问题" },
  { id: 23, text: "不服从老师与父母的要求或虽然做了但常常抱怨", dimension: "品行问题" },
  { id: 24, text: "比其他人更害怕孤独,害病或死亡", dimension: "焦虑" },
  { id: 25, text: "不能坚持做完一件事", dimension: "学习问题" },
  { id: 26, text: "容易感觉受了伤害", dimension: "其他行为" },
  { id: 27, text: "恃强、欺弱、霸", dimension: "品行问题" },
  { id: 28, text: "重复的做一件事", dimension: "其他行为" },
  { id: 29, text: "残酷", dimension: "其他行为" },
  { id: 30, text: "行为幼稚（对一些不必要帮助做的事也要别人做,好纠缠成人,需要成人反复地向他保证）", dimension: "其他行为" },
  { id: 31, text: "易分心,注意短暂", dimension: "学习问题" },
  { id: 32, text: "头痛", dimension: "心身问题" },
  { id: 33, text: "情绪变化很快,很激烈", dimension: "品行问题" },
  { id: 34, text: "不喜欢或不遵守规则或不喜欢受约束", dimension: "品行问题" },
  { id: 35, text: "好打架", dimension: "其他行为" },
  { id: 36, text: "与兄弟姐妹相处不好", dimension: "其他行为" },
  { id: 37, text: "碰到困难容易出挫折", dimension: "学习问题" },
  { id: 38, text: "打扰其它的儿童", dimension: "其他行为" },
  { id: 39, text: "总是很不高兴", dimension: "品行问题" },
  { id: 40, text: "饮食问题（食欲不佳,边吃饭边起身玩）", dimension: "其他行为" },
  { id: 41, text: "肚子痛", dimension: "心身问题" },
  { id: 42, text: "睡眠问题（不易入睡,起床太早或半夜起床）", dimension: "其他行为" },
  { id: 43, text: "常常觉得这里痛那里痛", dimension: "心身问题" },
  { id: 44, text: "常出现呕吐或恶心", dimension: "心身问题" },
  { id: 45, text: "家中总觉得受了骗", dimension: "其他行为" },
  { id: 46, text: "自吹自擂,好吹牛,说大话", dimension: "其他行为" },
  { id: 47, text: "常假想自己受到了威胁", dimension: "焦虑" },
  { id: 48, text: "排便问题（常常腹泻,排便时间不规则,便秘）", dimension: "心身问题" },
];

const adhdOptions: Option[] = [
  { label: "没有 (0分)", score: 0 },
  { label: "很轻 (1分)", score: 1 },
  { label: "较重 (2分)", score: 2 },
  { label: "严重 (3分)", score: 3 },
];

// Define Factor Groups for Calculation
export const ADHD_FACTORS = {
  "品行问题": [2, 8, 14, 19, 20, 21, 22, 23, 27, 33, 34, 39],
  "学习问题": [10, 25, 31, 37],
  "心身问题": [32, 41, 43, 44, 48],
  "冲动-多动": [4, 5, 11, 13],
  "焦虑": [12, 16, 24, 47],
  "多动指数": [4, 7, 11, 13, 14, 25, 31, 33, 37, 38]
};

// --- Sensory Data (Full 64 Questions) ---
const sensoryQuestions: Question[] = [
  // I. 前庭平衡和大脑双侧分化 (1-11)
  { id: 1, text: "儿童特别爱玩旋转圆凳、玩公园中旋转地球或飞转设施，不觉得晕", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 2, text: "儿童看来正常、健康，有正常智慧，但学习阅读或算术特难", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 3, text: "在眼看得见情况下，屡碰桌椅、被子或旁人，方向和距离感差", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 4, text: "手舞足蹈，吃饭、写字、打鼓时双手或双脚配合不良，常忘另一边", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 5, text: "表面上左撇子，左右手都用，或尚未固定偏好使用哪一只手", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 6, text: "大动作笨拙，容易跌倒，并不会用手支撑保护自己；拉他时显得笨重", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 7, text: "语音不清晰，组合句子或编组故事困难", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 8, text: "看书眼睛会累，却可以长时间看电视", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 9, text: "俯卧地板床上时，无法把头、颈、胸、手脚举高离地（如飞机状）", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 10, text: "喜欢听故事，不喜欢看书，听的容易记住，看的却容易忘记", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },
  { id: 11, text: "走路跑步常碰撞东西，不善于同伴投球和传球，排队和游戏有困难", dimension: "前庭平衡", section: "一、前庭平衡和大脑双侧分化" },

  // II. 脑神经生理抑制困难 (12-20)
  { id: 12, text: "注意力分散、不专心，小动作多，或上课左顾右盼", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 13, text: "偏食或挑食：不吃水果、软皮的食物，肉类、蛋类，只吃白饭、奶等", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 14, text: "害羞，见到陌生人赶紧躲避或紧张搓衣角、皱眉头、口吃说不出话", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 15, text: "看电视电影，很容易激动；高兴时又跳又叫，恐怖片不敢看", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 16, text: "严重怕黑，到暗处要有人陪，晚上拒绝出去，不喜欢到空屋子去", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 17, text: "换床睡不着，换枕头或被子睡不好，出外总是对睡眠空间担心", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 18, text: "别人为他用棉棒清洁鼻子和耳朵时，他往往觉得不舒服", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 19, text: "喜欢往亲人的身上挨靠或搂抱，像被宠坏或被溺爱的孩子", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },
  { id: 20, text: "睡觉时总爱触摸被角、衣物或玩具，否则会出现不安或睡不好", dimension: "神经抑制", section: "二、脑神经生理抑制困难" },

  // III. 触觉防御过多及反应不足 (21-34)
  { id: 21, text: "脾气不好，对亲人特别暴躁，常常为琐事无故发脾气，遇事会强词夺理", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 22, text: "到新的场合或人多的地方不久，就要求离开或自己跑掉", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 23, text: "轻微病后多次向人表示不喜欢去幼儿园；没原因或为小事对幼儿园产生恐惧", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 24, text: "常吮舔手指头或咬指甲，不喜欢别人帮剪指甲", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 25, text: "不喜欢脸被别人碰和帮他洗脸、洗头或理发为最痛苦的事", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 26, text: "成人帮他拉袖口和袜子，或协助穿衣服而碰他皮肤时会引起他的反感", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 27, text: "游戏中或玩玩具时，担心别人从后面逼近，为此而引起苦恼", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 28, text: "到处碰、触摸不停，但又避免触碰毛毯和编织玩具的表面", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 29, text: "常常喜欢穿宽松的长袖衣衫，不冷也不常喜欢穿毛线衫或夹克", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 30, text: "爱谈天或做无接触的交往，但不愿意跟朋友搭肩或做肌肤接触", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 31, text: "对某些布料很敏感，不喜欢那类布料所做的衣服", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 32, text: "对自己的事物很敏感，很容易动情，计划或结果改变时不能容忍", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 33, text: "对无所谓的瘀伤、小肿块、小刀伤等，总觉得很痛而诉怨不止", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },
  { id: 34, text: "顽固偏执不合作，一直坚持依自己的方式办事，对事没有灵活性", dimension: "触觉防御", section: "三、触觉防御过多及反应不足" },

  // IV. 发育期运动障碍 (35-45)
  { id: 35, text: "三四岁尚不会洗手，上厕所不会自行擦屁股", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 36, text: "三四岁尚不会使用筷子，或一直用汤勺吃饭、不会拿笔", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 37, text: "四五岁不会玩爬上、爬下或钻进去等的大玩具", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 38, text: "五六岁不会站起来用脚荡秋千，不会攀绳网或爬竹竿", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 39, text: "穿脱袜子、衣服、扣纽扣、系鞋带等动作，向来非常慢，或做不来", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 40, text: "入学后尚不会自己洗澡，单脚跳，跳绳等做不好也学不好", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 41, text: "入学后对拿笔写字、剪贴作业、着色等做不好或非常慢", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 42, text: "饭桌上经常弄得很脏，成人要求他收拾好书桌或玩具很困难", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 43, text: "做手工、做家务事很笨拙，使用工具抓握动作很不顺手", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 44, text: "动作懒散，行动迟缓不积极；做事非常没效率", dimension: "运动障碍", section: "四、发育期运动障碍" },
  { id: 45, text: "常常惹事，如弄翻碗盘，弄洒牛奶，从车上跌落等，需家长特别保护", dimension: "运动障碍", section: "四、发育期运动障碍" },

  // V. 视觉空间、形态 (46-50)
  { id: 46, text: "在年幼时玩积木总比别人差", dimension: "视觉空间", section: "五、视觉空间、形态" },
  { id: 47, text: "外出或远行时常达不到目的地，很容易迷失，不喜欢到陌生的地方", dimension: "视觉空间", section: "五、视觉空间、形态" },
  { id: 48, text: "蜡笔着色和铅笔写字都不好，比别人慢，常超出轮廓或方格之外", dimension: "视觉空间", section: "五、视觉空间、形态" },
  { id: 49, text: "拼图总比别人差；对模型或图样的异同辨别常有困难", dimension: "视觉空间", section: "五、视觉空间、形态" },
  { id: 50, text: "混淆背景中的特定图形，不易看出或认出", dimension: "视觉空间", section: "五、视觉空间、形态" },

  // VI. 本体觉 (重力不安症) (51-60)
  { id: 51, text: "内向、不喜欢出去玩，朋友少，沉默寡言，喜欢独处或帮家里做事", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 52, text: "上下阶梯或过马路多迟疑；登高会觉得头重脚轻不敢向别处看或走动", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 53, text: "被抱起举高时，很焦虑的要把脚着地，经可信赖人的帮助会安心配合", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 54, text: "避免从高处跳到低处，对高地或有跌落危险时，表现非常害怕", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 55, text: "不喜欢把头脚倒置：如避免翻筋斗、打滚，或参加室内打斗游戏活动", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 56, text: "对游乐设施不感兴趣，不喜欢移动性玩具", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 57, text: "对不寻常移动（如上下车，前座移到后座，走不平地面）动作缓慢", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 58, text: "上下楼梯很慢，紧紧的抓住栏杆；双手可抓紧的简单攀登，都尽量避免", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 59, text: "旋转时，很容易感到失去平衡。车行进中，转弯太快也会吓坏自己", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },
  { id: 60, text: "不喜欢在凸起的地面上走，总会抱怨或心中感到太高", dimension: "本体觉", section: "六、本体觉 (重力不安症)" },

  // VII. 情绪自我形象不良 (61-62)
  { id: 61, text: "成绩暴落、神态恍惚，读书很容易分心，常有情绪行为问题", dimension: "情绪与社会", section: "七、情绪自我形象不良" },
  { id: 62, text: "脾气暴躁，自制能力差，打架骂人等恶劣行为加剧", dimension: "情绪与社会", section: "七、情绪自我形象不良" },

  // VIII. 近期头痛或头晕，学习成绩下降 (63-64)
  { id: 63, text: "对师长的要求或学习、环境等压力，常承受不了，易产生挫折感", dimension: "抗压与挫折", section: "八、近期状况与抗压" },
  { id: 64, text: "对自己的形象感觉不良，认为自己很差劲，产生情绪和行为问题", dimension: "抗压与挫折", section: "八、近期状况与抗压" },
];

const sensoryOptions: Option[] = [
  { label: "没有 (1分)", score: 1 },
  { label: "很少 (2分)", score: 2 },
  { label: "偶尔 (3分)", score: 3 },
  { label: "常常 (4分)", score: 4 },
  { label: "总是 (5分)", score: 5 },
];

export const ASSESSMENTS: Record<AssessmentType, AssessmentConfig> = {
  [AssessmentType.ADHD]: {
    type: AssessmentType.ADHD,
    title: "多动障碍和注意力障碍测评 (Conners)",
    description: "本测试采用Conners父母问卷(48题版)，评估儿童的品行、学习、心身、多动及焦虑等状况。",
    questions: adhdQuestions,
    options: adhdOptions,
  },
  [AssessmentType.SENSORY]: {
    type: AssessmentType.SENSORY,
    title: "感觉统合能力测评",
    description: "本测试用于评估儿童在感觉统合方面的发育情况（共64题）。",
    questions: sensoryQuestions,
    options: sensoryOptions,
  },
};

// --- Raw Score to T-Score Mapping Tables ---
// Key: Raw Score, Value: T-Score
const SENSORY_T_SCORE_TABLE: Record<string, Record<number, number>> = {
  "前庭平衡": {
    11: 70, 12: 64, 13: 60, 14: 57, 15: 54, 16: 52, 17: 49, 18: 47, 19: 45, 20: 43, 
    21: 41, 22: 39, 23: 37, 24: 36, 25: 34, 26: 32, 27: 31, 28: 29, 29: 28, 30: 27, 
    31: 26, 32: 25, 33: 25, 34: 23, 35: 20, 36: 16, 37: 16, 38: 15, 39: 14, 40: 12, 
    41: 12, 42: 12, 43: 11, 44: 10
  },
  "神经抑制": {
    9: 73, 10: 69, 11: 67, 12: 64, 13: 62, 14: 60, 15: 58, 16: 55, 17: 53, 18: 51, 
    19: 49, 20: 48, 21: 46, 22: 44, 23: 42, 24: 40, 25: 39, 26: 37, 27: 36, 28: 34, 
    29: 32, 30: 30, 31: 28, 32: 26, 33: 25, 34: 23, 35: 22, 36: 20, 37: 16, 38: 12, 
    39: 11, 40: 8
  },
  "触觉防御": {
    14: 70, 15: 65, 16: 63, 17: 61, 18: 59, 19: 57, 20: 55, 21: 53, 22: 51, 23: 50, 
    24: 48, 25: 47, 26: 45, 27: 44, 28: 42, 29: 41, 30: 40, 31: 38, 32: 37, 33: 36, 
    34: 34, 35: 33, 36: 32, 37: 31, 38: 29, 39: 28, 40: 26, 41: 26, 42: 25, 43: 24, 
    44: 22, 45: 21, 46: 20, 47: 16
  },
  "运动障碍": {
    11: 65, 12: 59, 13: 57, 14: 55, 15: 53, 16: 51, 17: 47, 18: 47, 19: 45, 20: 44, 
    21: 42, 22: 40, 23: 39, 24: 38, 25: 36, 26: 35, 27: 34, 28: 33, 29: 32, 30: 31, 
    31: 29, 32: 28, 33: 28, 34: 26, 35: 25, 36: 24, 37: 23, 38: 22, 39: 21, 40: 20, 
    41: 16, 42: 16, 43: 16
  },
  "视觉空间": {
    5: 61, 6: 54, 7: 50, 8: 48, 9: 45, 10: 41, 11: 38, 12: 35, 13: 32, 14: 30, 
    15: 27, 16: 25, 17: 23, 18: 22, 19: 20, 20: 16
  },
  "本体觉": {
    10: 64, 11: 59, 12: 56, 13: 54, 14: 52, 15: 51, 16: 49, 17: 48, 18: 46, 19: 45, 
    20: 43, 21: 42, 22: 40, 23: 38, 24: 36, 25: 35, 26: 34, 27: 33, 28: 32, 29: 30, 
    31: 29, 32: 26, 33: 25, 34: 23, 36: 22, 40: 16
  },
  "情绪与社会": {
    2: 57, 3: 49, 4: 44, 5: 38, 6: 33, 7: 29, 8: 25, 9: 22, 10: 20
  },
  "抗压与挫折": {
    2: 57, 3: 48, 4: 43, 5: 38, 6: 33, 7: 28, 8: 25, 9: 20, 10: 16
  }
};

// --- Helper: Calculate Sensory T-Score ---
export const calculateSensoryTScore = (dimensionName: string, rawScore: number): number => {
    const table = SENSORY_T_SCORE_TABLE[dimensionName];
    if (!table) return 50; // Default if dimension not found (shouldn't happen)

    let tScore = table[rawScore];

    // Bounds handling (Low Raw = High T-Score)
    if (tScore === undefined) {
        const scores = Object.keys(table).map(Number).sort((a, b) => a - b);
        const minRaw = scores[0];
        const maxRaw = scores[scores.length - 1];

        // If Raw Score is lower than table min (Better performance), use Max T-Score or extrapolate (cap at 75/80)
        if (rawScore <= minRaw) {
            // Pick the T-score of the min raw score, or a high default
            const maxT = table[minRaw];
            return maxT > 70 ? maxT : 75; 
        } 
        // If Raw Score is higher than table max (Worse performance), use Min T-Score (cap at 10)
        else if (rawScore >= maxRaw) {
            const minT = table[maxRaw];
            return minT < 20 ? minT : 10;
        } 
        // Interpolate nearest (Simple Fallback)
        else {
            const closest = scores.reduce((prev, curr) => {
              return (Math.abs(curr - rawScore) < Math.abs(prev - rawScore) ? curr : prev);
            });
            return table[closest];
        }
    }
    return tScore;
};

// --- Analysis Logic ---

export const getSeverity = (type: AssessmentType, score: number, dimensionName?: string): SeverityLevel => {
  if (type === AssessmentType.ADHD) {
    // Conners Logic: Mean Score (0-3)
    if (score < 1.5) return SeverityLevel.NORMAL;
    if (score < 2.0) return SeverityLevel.MILD;
    if (score < 2.5) return SeverityLevel.MODERATE;
    return SeverityLevel.SEVERE;
  } else {
    // SENSORY Logic (Based on T-Score)
    // IMPORTANT: The 'score' passed here MUST be the T-Score, NOT the raw score.
    
    // T-Score Rules: >50 Normal, 40-50 Mild, 30-40 Moderate, <30 Severe
    // Ref: 50>T>40 Mild, 40>T>30 Moderate, T<30 Severe. T>50 Normal.
    if (score >= 50) return SeverityLevel.NORMAL;
    if (score >= 40) return SeverityLevel.MILD;
    if (score >= 30) return SeverityLevel.MODERATE;
    return SeverityLevel.SEVERE;
  }
};

export const getSymptomDescription = (type: AssessmentType, dimension: string): string => {
  if (type === AssessmentType.ADHD) {
    switch (dimension) {
      case "品行问题":
        return "表现为反抗权威、发脾气、撒谎、攻击性行为（如打架、破坏物品），难以遵守社会规则或集体纪律。";
      case "学习问题":
        return "在课堂上注意力涣散，无法完成作业，学习成绩不稳定，难以坚持完成需要脑力的任务，可能伴有挫败感。";
      case "心身问题":
        return "经常诉说身体不适（如头痛、腹痛），尤其在面对压力或困难任务时，可能伴有焦虑引起的生理反应。";
      case "冲动-多动":
        return "表现为坐立不安，难以安静等待，经常打断别人，做事不计后果，情绪容易激动，自控力较弱。";
      case "焦虑":
        return "表现为过分担心、害羞、敏感，害怕新环境或陌生人，容易产生不安全感，可能伴有强迫性行为。";
      case "多动指数":
        return "综合反映了儿童多动症的核心症状。得分较高通常提示需要进一步的专业临床评估。";
      default:
        return "该维度得分表明孩子在此方面可能存在一定的行为偏差，建议结合具体场景进行观察引导。";
    }
  } else {
    // SENSORY DESCRIPTIONS (Same as before)
    switch (dimension) {
      case "前庭平衡":
        return "前庭平衡失调：表现为好动不安，注意力不集中，喜欢旋转但不会晕，或者反之特别怕晕。走路易跌倒，方向感差，阅读时容易跳行漏字。";
      case "神经抑制":
        return "脑神经抑制困难：表现为自信心不足，害羞胆小，怕黑，黏人，对陌生环境适应力差。容易兴奋也容易情绪低落。";
      case "触觉防御":
        return "触觉防御过当：对触觉刺激过度敏感，不喜欢被人触摸，偏食挑食，讨厌特定质地的衣服，情绪不稳定，容易发脾气。";
      case "运动障碍":
        return "发育期运动障碍：大肌肉和小肌肉发展不良，动作笨拙，学习新动作慢（如系鞋带、拿筷子、跳绳）。生活自理能力弱。";
      case "视觉空间":
        return "视觉空间感知障碍：表现为视觉辨识能力差，拼图、积木等空间游戏困难。写字容易出格，部首颠倒，认字困难。";
      case "本体觉":
        return "本体觉（重力不安）：对高度和运动极度恐惧，不敢玩游乐设施，下楼梯紧张。动作僵硬，由于身体控制感差，反而可能变得孤僻。";
      case "情绪与社会":
        return "情绪与社会互动问题：学龄期表现出明显的情绪控制差，暴躁易怒，打架骂人，或精神恍惚，无法集中精力。";
      case "抗压与挫折":
        return "抗压与挫折感：自我评价过低，认为自己不如别人，遇到困难容易放弃或产生抵触情绪，需要更多的鼓励。";
      default:
        return "存在多项感觉统合失调表现，大脑无法有效处理感觉信息，导致情绪、专注力、动作协调等方面出现困难。";
    }
  }
};