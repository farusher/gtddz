import React, { useRef, useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { AssessmentType, SeverityLevel, ScoreResult } from '../types';
import { getSymptomDescription } from '../constants';
import { Button } from './Button';
import { Download, RotateCcw, User, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResultProps {
  type: AssessmentType;
  result: ScoreResult;
  onRetry: () => void;
  childInfo?: { name: string; age: string };
}

export const Result: React.FC<ResultProps> = ({ type, result, onRetry, childInfo }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const data = Object.keys(result.dimensionScores).map(key => ({
    subject: key,
    A: result.dimensionScores[key],
    // ADHD Mean Score Max is 3. Sensory T-Score Max is around 80.
    fullMark: type === AssessmentType.ADHD ? 3 : 80, 
  }));

  const isAbnormal = result.totalLevel !== SeverityLevel.NORMAL;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      // Small delay to ensure any re-renders are complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff' // Force white background for the image
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `${childInfo?.name || 'child'}_${type === AssessmentType.ADHD ? 'ADHD' : 'Sensory'}_Assessment_Report.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('生成PDF报告失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      
      {/* Report Content Area */}
      <div ref={reportRef} className="space-y-8 p-4 md:p-8 bg-white md:bg-gray-50 rounded-xl">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border-t-4 border-blue-500">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100">
             <div>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">测评结果分析</h2>
               <p className="text-gray-500 mt-1">{type === AssessmentType.ADHD ? '多动障碍和注意力障碍测评' : '感觉统合能力测评'}</p>
             </div>
             
             {childInfo && (
               <div className="mt-4 md:mt-0 bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-3 text-blue-800 border border-blue-100">
                 <User size={20} />
                 <div className="text-sm">
                   <span className="block font-bold">{childInfo.name}</span>
                   <span>{childInfo.age} 岁</span>
                 </div>
               </div>
             )}
          </div>

          <div className="text-center mb-4">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-gray-500">综合评定等级:</span>
              <span className={`text-xl font-bold px-3 py-1 rounded-full ${
                result.totalLevel === SeverityLevel.NORMAL ? 'bg-green-100 text-green-700' :
                result.totalLevel === SeverityLevel.MILD ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {result.totalLevel}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {type === AssessmentType.SENSORY ? '平均T分' : '总分'} : {result.totalScore}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">维度雷达图</h3>
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar
                    name="本次得分"
                    dataKey="A"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Scores Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">维度详细得分</h3>
            <div className="space-y-4">
              {Object.entries(result.dimensionScores).map(([key, score]) => (
                <div key={key} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <div className="font-medium text-gray-800">{key}</div>
                    <div className={`text-xs ${
                      result.dimensionLevels[key] === SeverityLevel.NORMAL 
                        ? 'text-green-600' 
                        : 'text-red-500 font-medium'
                    }`}>
                      {result.dimensionLevels[key]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-700">
                      {type === AssessmentType.SENSORY ? `T分: ${score}` : `${score}分`}
                    </div>
                    {type === AssessmentType.SENSORY && result.dimensionRawScores?.[key] !== undefined && (
                      <div className="text-xs text-gray-400">
                        原始分: {result.dimensionRawScores[key]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Abnormal Symptoms Description */}
        {isAbnormal && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-400">
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
               异常症状解析
            </h3>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <div className="bg-red-50 p-4 rounded-lg">
                 <strong className="block text-red-700 mb-1">整体评价</strong>
                 {result.totalLevel} - {getSymptomDescription(type, "ALL")}
              </div>
              
              {Object.entries(result.dimensionLevels).map(([dim, level]) => {
                if (level === SeverityLevel.NORMAL) return null;
                return (
                  <div key={dim} className="ml-2">
                     <strong className="text-gray-900">{dim}异常：</strong>
                     {getSymptomDescription(type, dim)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggestions & Footer */}
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-800">
          <h4 className="font-bold mb-2 flex items-center gap-2">
             专家建议
          </h4>
          <p className="mb-2">
            本测试结果仅为参考，建议寻求专业儿科医生或感统训练师的进一步评估。
          </p>
          {isAbnormal && (
            <p>
              针对评定中显示的{Object.keys(result.dimensionLevels).filter(k => result.dimensionLevels[k] !== SeverityLevel.NORMAL).join("、")}异常维度，建议尽早进行针对性的专业训练干预。
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons (Not Printed) */}
      <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 no-print px-4">
        <Button variant="outline" onClick={onRetry} className="flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          重新测试
        </Button>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isGenerating ? '正在生成...' : '下载PDF报告'}
        </Button>
      </div>
    </div>
  );
};