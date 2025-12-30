import { useWorkflowMode } from '../contexts/WorkflowModeContext';
import { useMemo } from 'react';

/**
 * Hook for individual tabs to determine their mode and behavior
 * Simplifies the complex workflow logic for individual components
 */
export const useTabMode = (tabKey) => {
  const {
    mode,
    isWorkflowMode,
    isFocusMode,
    isTabInWorkflowMode,
    enterWorkflowMode,
    exitWorkflowMode,
    navigateToNextStep,
    navigateToPreviousStep,
    navigateToTab,
    addProgressiveHeader,
    getCurrentStep,
    getNextStep,
    getPreviousStep,
    workflowData,
    progressiveHeaders,
    WORKFLOW_STEPS
  } = useWorkflowMode();

  // Determine if this tab is currently in workflow mode
  const isCurrentTabInWorkflow = isTabInWorkflowMode(tabKey);
  
  // Get workflow step info for this tab
  const workflowStep = useMemo(() => {
    return WORKFLOW_STEPS.find(step => step.tab === tabKey);
  }, [tabKey]);
  
  // Get data for this tab's workflow step
  const tabWorkflowData = useMemo(() => {
    if (!workflowStep) return null;
    return workflowData[workflowStep.key];
  }, [workflowStep, workflowData]);
  
  // Get progressive header for this tab
  const tabProgressiveHeader = useMemo(() => {
    if (!workflowStep) return null;
    return progressiveHeaders.find(header => header.key === workflowStep.key);
  }, [workflowStep, progressiveHeaders]);
  
  // Mode-specific behavior helpers
  const tabModeConfig = useMemo(() => {
    if (isCurrentTabInWorkflow) {
      // This tab is in workflow mode
      return {
        mode: 'workflow',
        showProgressiveHeaders: true,
        showModeToggle: true,
        showWorkflowNavigation: true,
        showContextualGuidance: true,
        simplifyUI: true,
        showNextButton: !!getNextStep(),
        showPreviousButton: !!getPreviousStep(),
        nextButtonText: getNextStep()?.title || 'Continue',
        previousButtonText: getPreviousStep()?.title || 'Back'
      };
    } else if (isFocusMode) {
      // This tab is in focus mode
      return {
        mode: 'focus',
        showProgressiveHeaders: false,
        showModeToggle: tabWorkflowData ? true : false, // Only show if can enter workflow
        showWorkflowNavigation: false,
        showContextualGuidance: false,
        simplifyUI: false,
        showFullFeatures: true,
        canEnterWorkflow: !!workflowStep
      };
    } else {
      // Default focus mode
      return {
        mode: 'focus',
        showProgressiveHeaders: false,
        showModeToggle: false,
        showWorkflowNavigation: false,
        showContextualGuidance: false,
        simplifyUI: false,
        showFullFeatures: true,
        canEnterWorkflow: !!workflowStep
      };
    }
  }, [isCurrentTabInWorkflow, isFocusMode, workflowStep, tabWorkflowData, getNextStep, getPreviousStep]);
  
  // Action handlers specific to this tab
  const tabActions = useMemo(() => ({
    // Mode transitions
    enterWorkflowMode: () => {
      if (workflowStep) {
        const stepIndex = WORKFLOW_STEPS.findIndex(s => s.key === workflowStep.key);
        enterWorkflowMode(stepIndex);
      }
    },
    
    exitToFocusMode: () => {
      exitWorkflowMode();
    },
    
    // Workflow navigation
    continueToNextStep: (data) => {
      if (workflowStep && data) {
        addProgressiveHeader(workflowStep.key, data);
      }
      navigateToNextStep();
    },
    
    goToPreviousStep: () => {
      navigateToPreviousStep();
    },
    
    // Direct tab navigation (exits workflow)
    navigateToTab: (targetTab) => {
      navigateToTab(targetTab);
    },
    
    // Save step data without advancing
    saveStepData: (data) => {
      if (workflowStep) {
        addProgressiveHeader(workflowStep.key, data);
      }
    }
  }), [workflowStep, enterWorkflowMode, exitWorkflowMode, navigateToNextStep, navigateToPreviousStep, navigateToTab, addProgressiveHeader]);
  
  return {
    // Mode information
    ...tabModeConfig,
    tabKey,
    workflowStep,
    
    // Data
    tabWorkflowData,
    tabProgressiveHeader,
    
    // Actions
    ...tabActions,
    
    // Raw workflow context (for advanced use)
    workflowContext: {
      mode,
      isWorkflowMode,
      isFocusMode,
      getCurrentStep,
      getNextStep,
      getPreviousStep
    }
  };
};

export default useTabMode;