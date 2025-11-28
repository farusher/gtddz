
import React, { useState, useMemo } from 'react';
import { 
  PageState, 
  AssessmentType, 
  AssessmentConfig, 
  ScoreResult, 
  SeverityLevel,
  Question
} from './types';
import { ASSESSMENTS, getSeverity, ADHD_FACTORS, calculateSensoryTScore } from './constants';
import { checkCredentials, markAccountAsUsed } from './credentials';
import { Button } from './components/Button';
import { Result } from './components/Result';
import { Activity, Brain, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, ClipboardList, User, Zap, Eye, X } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [page, setPage] = useState<PageState>(PageState.HOME);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  
  // Login State
  const [cardNo, setCardNo] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Info State
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  // Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Result State
  const [result, setResult] = useState<ScoreResult | null>(null);

  // Computed
  const currentConfig: AssessmentConfig | null = selectedType ? ASSESSMENTS[selectedType] : null;
  const progress = activeQuestions.length > 0 ? Math.round(((currentQIndex + 1) / activeQuestions.length) * 100) : 0;

  // Handlers
  const handleStart = (type: AssessmentType) => {
    setSelectedType(type);
    setPage(PageState.LOGIN);
    // Reset login form
    setCardNo('');
    setPassword('');
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const { isValid, userType, isAdmin, error } = checkCredentials(cardNo, password);

    if (isValid && userType) {
      // Check if the account type matches the selected assessment (Admin bypasses this)
      if (!isAdmin && selectedType && userType !== selectedType) {
        setLoginError(`此账号是${userType === AssessmentType.SENSORY ? '感统' : '多动症'}测评专用，请使用${selectedType === AssessmentType.SENSORY ? 'GT' : 'DD'}开头的账号。`);
        return;
      }

      // Mark account as used (starts the 24h timer)
      markAccountAsUsed(cardNo);

      // Login Success
      setChildName('');
      setChildAge('');
      setPage(PageState.INFO);
    } else {
      setLoginError(error || '登录失败');
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childName.trim() && childAge.trim()) {
      setPage(PageState.INSTRUCTION);
    }
  };

  const handleStartQuiz = () => {
    if (!currentConfig) return;

    let questions = [...currentConfig.questions];

    // Filter questions based on Age for Sensory Assessment
    if (selectedType === AssessmentType.SENSORY) {
      const age = parseFloat(childAge);
      if (!isNaN(age) && age < 6) {
        // Exclude questions 61-64 for children under 6
        questions = questions.filter(q => q.id < 61);
      }
    }

    setActiveQuestions(questions);
    setAnswers({});
    setCurrentQIndex(0);
    setPage(PageState.QUIZ);
  };

  const handleAnswer = (score: number) => {
    if (activeQuestions.length === 0) return;
    const qId = activeQuestions[currentQIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const handleNext = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  // --- DEV: Auto Fill Function ---
  const handleDevAutoFill = () => {
    if (!currentConfig || activeQuestions.length === 0) return;
    
    const newAnswers = { ...answers };
    const options = currentConfig.options;

    // Fill all questions EXCEPT the last one
    for (let i = 0; i < activeQuestions.length - 1; i++) {
      const q = activeQuestions[i];
      // Pick a random option score
      const randomOption = options[Math.floor(Math.random() * options.length)];
      newAnswers[q.id] = randomOption.score;
    }

    setAnswers(newAnswers);
    // Jump to the last question
    setCurrentQIndex(activeQuestions.length - 1);
  };

  const handleSubmit = () => {
    if (!currentConfig || activeQuestions.length === 0) return;

    const dimensionScores: Record<string, number> = {};
    const dimensionRawScores: Record<string, number> = {};
    const dimensionLevels: Record<string, SeverityLevel> = {};
    let totalScore = 0;

    if (currentConfig.type === AssessmentType.ADHD) {
       // --- ADHD SCORING LOGIC (CONNERS Factors) ---
       
       // Helper to calculate factor stats
       const calcFactor = (questionIds: number[]) => {
          let sum = 0;
          let count = 0;
          questionIds.forEach(id => {
            if (answers[id] !== undefined) {
              sum += answers[id];
              count++;
            }
          });
          return count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
       };

       // 1. Calculate Standard Factors
       Object.entries(ADHD_FACTORS).forEach(([factorName, ids]) => {
          const meanScore = calcFactor(ids);
          dimensionScores[factorName] = meanScore;
          dimensionLevels[factorName] = getSeverity(AssessmentType.ADHD, meanScore, factorName);
       });

       // 2. Set "Total Score" as the Hyperactivity Index
       const hyperIndex = dimensionScores["多动指数"];
       totalScore = hyperIndex;
       
    } else {
       // --- SENSORY SCORING LOGIC (With T-Score Conversion) ---
       
       // 1. Calculate Raw Scores first
       activeQuestions.forEach(q => {
         const score = answers[q.id] || 0;
         if (!dimensionRawScores[q.dimension]) {
           dimensionRawScores[q.dimension] = 0;
         }
         dimensionRawScores[q.dimension] += score;
       });

       // 2. Convert to T-Scores and Determine Levels
       let tScoreSum = 0;
       let tScoreCount = 0;

       Object.keys(dimensionRawScores).forEach(dim => {
         // Convert Raw -> T-Score
         const raw = dimensionRawScores[dim];
         const tScore = calculateSensoryTScore(dim, raw);
         
         dimensionScores[dim] = tScore; // Store T-Score as the main score for display
         dimensionLevels[dim] = getSeverity(AssessmentType.SENSORY, tScore, dim);

         tScoreSum += tScore;
         tScoreCount++;
       });

       // Total Score for Sensory = Average T-Score (to keep it on similar scale)
       totalScore = tScoreCount > 0 ? Math.round(tScoreSum / tScoreCount) : 0;
    }

    // Overall Severity
    // For Sensory, we can use the Average T-Score to estimate general severity
    const totalLevel = getSeverity(currentConfig.type, totalScore, currentConfig.type === AssessmentType.ADHD ? "多动指数" : undefined);

    setResult({
      dimensionScores, // T-Scores (Sensory) or Mean Scores (ADHD)
      dimensionRawScores: currentConfig.type === AssessmentType.SENSORY ? dimensionRawScores : undefined,
      totalScore,
      dimensionLevels,
      totalLevel
    });

    setPage(PageState.RESULT);
  };

  const handleRetry = () => {
    setPage(PageState.HOME);
    setSelectedType(null);
    setResult(null);
    setAnswers({});
    setCardNo('');
    setPassword('');
    setChildName('');
    setChildAge('');
  };

  // --- Views ---

  // 1. Home View
  if (page === PageState.HOME) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto px-4 flex items-center gap-2">
            <Activity className="text-blue-600" size={28} />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">儿童健康评定系统</h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">关注儿童成长，守护未来希望</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              本测试仅为参考，不替代专业医疗诊断。通过科学的量表，帮助家长初步了解孩子的感统发展与注意力状况。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Sensory Card */}
            <div 
              onClick={() => handleStart(AssessmentType.SENSORY)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 group"
            >
              <div className="h-48 overflow-hidden relative bg-blue-100 flex items-center justify-center">
                 {/* SVG Placeholder for Sensory - Base64 encoded for absolute stability */}
                 <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                   <defs>
                     <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" style={{stopColor:'#E0F2FE', stopOpacity:1}} />
                       <stop offset="100%" style={{stopColor:'#BAE6FD', stopOpacity:1}} />
                     </linearGradient>
                   </defs>
                   <rect width="600" height="400" fill="url(#grad1)" />
                   <g transform="translate(150, 100) scale(1.5)">
                     {/* Abstract Blocks */}
                     <rect x="50" y="80" width="40" height="40" rx="4" fill="#F87171" />
                     <rect x="95" y="80" width="40" height="40" rx="4" fill="#FBBF24" />
                     <rect x="72" y="35" width="40" height="40" rx="4" fill="#60A5FA" />
                     <circle cx="155" cy="100" r="22" fill="#34D399" />
                   </g>
                 </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white text-2xl font-bold">感觉统合能力测评</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">评估前庭觉、触觉、本体觉等感觉统合能力，发现运动协调与感知发展问题。</p>
                <div className="flex items-center text-blue-600 font-medium">
                  开始测评 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* ADHD Card */}
            <div 
              onClick={() => handleStart(AssessmentType.ADHD)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 group"
            >
              <div className="h-48 overflow-hidden relative bg-indigo-100 flex items-center justify-center">
                {/* SVG Placeholder for ADHD */}
                 <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                   <defs>
                     <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" style={{stopColor:'#E0E7FF', stopOpacity:1}} />
                       <stop offset="100%" style={{stopColor:'#C7D2FE', stopOpacity:1}} />
                     </linearGradient>
                   </defs>
                   <rect width="600" height="400" fill="url(#grad2)" />
                   <g transform="translate(200, 120) scale(1.5)">
                      {/* Abstract Book/Brain */}
                      <path d="M10 20 Q 30 5 50 20 T 90 20 L 90 60 Q 70 45 50 60 T 10 60 Z" fill="white" stroke="#6366F1" strokeWidth="2" />
                      <circle cx="50" cy="15" r="4" fill="#F472B6" />
                      <circle cx="70" cy="10" r="3" fill="#F472B6" />
                      <path d="M85 10 L 95 0 M 90 15 L 105 10" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
                   </g>
                 </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white text-2xl font-bold">多动障碍和注意力障碍测评</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">基于Conners父母问卷(48题)，评估儿童注意力、多动、品行及焦虑等行为表现。</p>
                <div className="flex items-center text-blue-600 font-medium">
                  开始测评 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white py-6 mt-12 border-t">
          <div className="container mx-auto text-center text-gray-500 text-sm">
             &copy; {new Date().getFullYear()} 儿童健康评定系统 | 仅供参考
          </div>
        </footer>
      </div>
    );
  }

  // 2. Login View
  if (page === PageState.LOGIN && currentConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 relative">
          
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{currentConfig.title}</h2>
            <p className="text-gray-500 mt-2">请输入机构提供的测试卡号和密码</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡号</label>
              <input
                type="text"
                value={cardNo}
                onChange={(e) => setCardNo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                placeholder={selectedType === AssessmentType.SENSORY ? "例如: GT0001" : "例如: DD0001"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                placeholder="6位数字密码"
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <div className="flex gap-4">
               <Button type="button" variant="secondary" className="w-1/3" onClick={() => setPage(PageState.HOME)}>返回</Button>
               <Button type="submit" className="w-2/3">登录</Button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // 3. Info Input View
  if (page === PageState.INFO && currentConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">基本信息</h2>
            <p className="text-gray-500 mt-2">请完善受测儿童信息以生成适配题目</p>
          </div>

          <form onSubmit={handleInfoSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">儿童姓名</label>
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年龄 (周岁)</label>
              <input
                type="number"
                required
                min="1"
                max="18"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                placeholder="请输入年龄"
              />
              {selectedType === AssessmentType.SENSORY && (
                <p className="text-xs text-blue-500 mt-2">
                  * 感统测评将根据年龄自动调整题目数量 (6岁以下免做学龄期题目)
                </p>
              )}
            </div>
            
            <div className="flex gap-4 pt-2">
               <Button type="button" variant="secondary" className="w-1/3" onClick={() => setPage(PageState.LOGIN)}>上一步</Button>
               <Button type="submit" className="w-2/3">下一步</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 4. Instruction View
  if (page === PageState.INSTRUCTION && currentConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-500" /> 测试须知
          </h2>
          
          <div className="space-y-4 text-gray-600 mb-8 leading-relaxed bg-blue-50 p-6 rounded-xl">
            <p>1. 请家长根据孩子<strong>最近一个月的实际情况</strong>如实作答。</p>
            <p>2. 测试时长约 <strong>5-10 分钟</strong>。</p>
            <p>3. 答题后将生成即时测评结果，包括雷达图分析和专业建议。</p>
            <p>4. 测评过程中<strong>不允许跳过题目</strong>，但可返回修改。</p>
            {selectedType === AssessmentType.SENSORY && parseFloat(childAge) < 6 && (
              <p className="text-blue-600 font-medium text-sm border-t border-blue-200 pt-2 mt-2">
                 * 已识别儿童年龄小于6岁，系统已自动免除学龄期相关题目(61-64题)。
              </p>
            )}
          </div>

          <Button onClick={handleStartQuiz} className="w-full py-3 text-lg">
            开始答题
          </Button>
        </div>
      </div>
    );
  }

  // 5. Quiz View
  if (page === PageState.QUIZ && currentConfig && activeQuestions.length > 0) {
    const question = activeQuestions[currentQIndex];
    const isFirst = currentQIndex === 0;
    const isLast = currentQIndex === activeQuestions.length - 1;
    const hasAnswered = answers[question.id] !== undefined;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 md:pt-16 pb-8 px-4">
        {/* Progress Header */}
        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{currentConfig.title}</span>
            <span>第 {currentQIndex + 1} 题 / 共 {activeQuestions.length} 题</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
             ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 md:p-10 flex flex-col min-h-[400px] relative">
           
           {/* DEV: Auto Fill Button */}
           <button 
             onClick={handleDevAutoFill}
             className="absolute top-6 right-6 text-gray-300 hover:text-blue-500 transition-colors p-2"
             title="快速填充 (测试用) - 随机生成答案直到最后一题"
           >
             <Zap size={20} />
           </button>

           <div className="mb-2 flex flex-col items-start gap-1">
             {question.section && (
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  {question.section}
                </span>
             )}
             <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium mb-4">
               {question.dimension}
             </span>
           </div>
           
           <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-8 flex-grow">
             {currentQIndex + 1}. {question.text}
           </h3>

           <div className="space-y-3">
             {currentConfig.options.map((opt) => (
               <div 
                 key={opt.label}
                 onClick={() => handleAnswer(opt.score)}
                 className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                   answers[question.id] === opt.score 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                 }`}
               >
                 <span className="font-medium">{opt.label}</span>
                 {answers[question.id] === opt.score && <CheckCircle size={20} className="text-blue-500"/>}
               </div>
             ))}
           </div>

           {/* Navigation */}
           <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
             <Button 
               variant="outline" 
               onClick={handlePrev} 
               disabled={isFirst}
               className="w-32"
             >
               上一题
             </Button>

             {isLast ? (
               <Button 
                onClick={handleSubmit} 
                disabled={!hasAnswered}
                className="w-32 bg-green-600 hover:bg-green-700"
               >
                 提交
               </Button>
             ) : (
               <Button 
                onClick={handleNext} 
                disabled={!hasAnswered}
                className="w-32"
               >
                 下一题
               </Button>
             )}
           </div>
        </div>
      </div>
    );
  }

  // 6. Result View
  if (page === PageState.RESULT && currentConfig && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <header className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">测评报告</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </header>
        
        <Result 
          type={currentConfig.type} 
          result={result} 
          onRetry={handleRetry} 
          childInfo={{ name: childName, age: childAge }}
        />
      </div>
    );
  }

  return null;
}

export default App;
