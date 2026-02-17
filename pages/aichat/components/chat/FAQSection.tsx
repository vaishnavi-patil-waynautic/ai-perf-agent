import React, { useEffect, useState } from 'react';
import { Collapse, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadFAQs } from '../../store/slices/chat.thunk';
import { sendMessage } from '../../store/slices/chat.thunk';

const FAQSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const faqs = useAppSelector((state) => state.chat.faqs);
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const [faqOpen, setFaqOpen] = useState(false);

  useEffect(() => {
    dispatch(loadFAQs());
  }, [dispatch]);

  const handleFAQClick = (question: string) => {
    dispatch(sendMessage({ text: question, modelId: selectedModel }));
    setFaqOpen(false);
  };

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="bg-blue-50 border-b border-gray-200">
      {/* Collapsible FAQ Header */}
      <div
        className="px-4 py-2 text-sm font-semibold text-blue-600 cursor-pointer flex items-center justify-between hover:bg-blue-100 transition"
        onClick={() => setFaqOpen(!faqOpen)}
      >
        <span>Frequently Asked Questions ({faqs.length})</span>
        <ExpandMoreIcon
          fontSize="small"
          className={`transform transition-transform ${
            faqOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Collapsible Content */}
      <Collapse in={faqOpen}>
        <div className="px-4 pb-3 max-h-64 overflow-y-auto custom-scrollbar">
          {Object.keys(groupedFAQs).length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No FAQs available
            </div>
          ) : (
            Object.entries(groupedFAQs).map(([category, questions]) => (
              <div key={category} className="mb-3">
                <Chip
                  label={category}
                  size="small"
                  className="mb-2 bg-blue-200 text-blue-800 font-semibold"
                />
                <div className="space-y-2">
                  {questions.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-2.5 bg-white border border-blue-100 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition shadow-sm"
                      onClick={() => handleFAQClick(faq.question)}
                    >
                      {faq.question}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default FAQSection;