import { useState } from 'react';

export const useWorkflowState = () => {
  // All workflow state consolidated into a single hook for sharing
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scanningMessage, setScanningMessage] = useState('');
  const [editingStep, setEditingStep] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCMS, setSelectedCMS] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [strategyCompleted, setStrategyCompleted] = useState(false);
  const [blogGenerating, setBlogGenerating] = useState(false);
  
  // Post state and content strategy management
  const [postState, setPostState] = useState('draft'); // 'draft', 'exported', 'locked'
  const [contentStrategy, setContentStrategy] = useState({
    goal: 'awareness', // 'awareness', 'consideration', 'conversion', 'retention'
    voice: 'expert', // 'expert', 'friendly', 'insider', 'storyteller'
    template: 'problem-solution', // 'how-to', 'problem-solution', 'listicle', 'case-study', 'comprehensive'
    length: 'standard' // 'quick', 'standard', 'deep'
  });
  const [customFeedback, setCustomFeedback] = useState('');
  const [showStrategyGate, setShowStrategyGate] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);
  
  // Change tracking for regeneration
  const [previousContent, setPreviousContent] = useState('');
  const [showChanges, setShowChanges] = useState(false);
  
  // Customer strategy selection
  const [selectedCustomerStrategy, setSelectedCustomerStrategy] = useState(null);
  const [strategySelectionCompleted, setStrategySelectionCompleted] = useState(false);
  
  // Web search research insights
  const [webSearchInsights, setWebSearchInsights] = useState({
    brandResearch: null,
    keywordResearch: null,
    researchQuality: 'basic' // 'basic', 'enhanced', 'premium'
  });
  
  // Demo mode for testing (bypass payment gates)
  const [demoMode, setDemoMode] = useState(
    process.env.REACT_APP_DEMO_MODE === 'true' || 
    window.location.search.includes('demo=true') ||
    localStorage.getItem('automyblog_demo_mode') === 'true'
  );
  
  // Step results storage
  const [stepResults, setStepResults] = useState({
    websiteAnalysis: {
      businessType: 'Child Wellness & Parenting',
      businessName: '',
      // Backward compatibility fields
      targetAudience: 'Parents of children aged 2-12',
      contentFocus: 'Emotional wellness, child development, mindful parenting',
      brandVoice: 'Warm, expert, supportive',
      description: '',
      keywords: [],
      // New customer psychology fields
      decisionMakers: 'Parents of children aged 2-12',
      endUsers: 'Children experiencing anxiety or emotional challenges',
      customerProblems: [],
      searchBehavior: '',
      customerLanguage: [],
      contentIdeas: [],
      connectionMessage: '',
      businessModel: '',
      websiteGoals: '',
      blogStrategy: '',
      scenarios: [],
      brandColors: {
        primary: '#6B8CAE',
        secondary: '#F4E5D3',
        accent: '#8FBC8F'
      }
    },
    trendingTopics: [],
    selectedContent: null,
    finalContent: ''
  });

  // Return all state and setters for sharing between components
  return {
    // Step and navigation state
    currentStep,
    setCurrentStep,
    selectedTopic,
    setSelectedTopic,
    editingStep,
    setEditingStep,
    previewMode,
    setPreviewMode,
    selectedCMS,
    setSelectedCMS,
    expandedSteps,
    setExpandedSteps,
    analysisCompleted,
    setAnalysisCompleted,
    strategyCompleted,
    setStrategyCompleted,
    
    // Content and generation state
    generatedContent,
    setGeneratedContent,
    isLoading,
    setIsLoading,
    websiteUrl,
    setWebsiteUrl,
    scanningMessage,
    setScanningMessage,
    blogGenerating,
    setBlogGenerating,
    
    // Post and strategy state
    postState,
    setPostState,
    contentStrategy,
    setContentStrategy,
    customFeedback,
    setCustomFeedback,
    showStrategyGate,
    setShowStrategyGate,
    showExportWarning,
    setShowExportWarning,
    
    // Change tracking
    previousContent,
    setPreviousContent,
    showChanges,
    setShowChanges,
    
    // Customer strategy
    selectedCustomerStrategy,
    setSelectedCustomerStrategy,
    strategySelectionCompleted,
    setStrategySelectionCompleted,
    
    // Research and demo mode
    webSearchInsights,
    setWebSearchInsights,
    demoMode,
    setDemoMode,
    
    // Step results
    stepResults,
    setStepResults
  };
};

export default useWorkflowState;