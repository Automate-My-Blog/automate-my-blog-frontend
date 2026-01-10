import autoBlogAPI from './api';
import { ContentPromptEngine, StrategicCTABuilder } from './contentPromptEngine';

/**
 * Enhanced Content Generation API
 * Implements comprehensive OpenAI content enhancement system
 */
export class EnhancedContentAPI {
  constructor() {
    this.promptEngine = new ContentPromptEngine();
    this.ctaBuilder = new StrategicCTABuilder();
  }

  /**
   * Generate enhanced content with comprehensive context
   * Implements the approved OpenAI enhancement plan
   */
  async generateEnhancedContent(selectedTopic, analysisData, strategy = null, enhancementOptions = {}) {
    try {
      // Build comprehensive prompt using new engine
      const comprehensivePrompt = this.promptEngine.buildComprehensivePrompt(
        selectedTopic, 
        analysisData, 
        strategy, 
        enhancementOptions
      );

      // Build strategic CTAs
      const strategicCTAs = this.ctaBuilder.buildStrategicCTAs(
        analysisData, 
        strategy, 
        enhancementOptions.goal
      );

      // Create enhanced payload for backend
      const enhancedPayload = {
        topic: selectedTopic,
        businessInfo: analysisData,
        comprehensiveContext: comprehensivePrompt,
        strategicCTAs: strategicCTAs,
        enhancementOptions: enhancementOptions,
        requestEnhancedResponse: true // Flag for backend to return enhanced structure
      };

      // Call enhanced generation endpoint
      const response = await this.callEnhancedGenerationAPI(enhancedPayload);

      if (response && response.content) {
        return {
          success: true,
          content: response.content,
          enhancedMetadata: {
            seoAnalysis: response.seoAnalysis || this.generateFallbackSEOAnalysis(response.content, comprehensivePrompt.seoInstructions),
            contentQuality: response.contentQuality || this.analyzeContentQuality(response.content),
            strategicElements: response.strategicElements || this.identifyStrategicElements(response.content, strategicCTAs),
            improvementSuggestions: response.improvementSuggestions || [],
            keywordOptimization: response.keywordOptimization || this.analyzeKeywordUsage(response.content, comprehensivePrompt.seoInstructions)
          },
          generationContext: comprehensivePrompt,
          strategicCTAs: strategicCTAs,
          selectedTopic: selectedTopic
        };
      } else {
        return {
          success: false,
          error: 'Enhanced content generation failed: No content received'
        };
      }
    } catch (error) {
      console.error('Enhanced content generation error:', error);
      return {
        success: false,
        error: error.message,
        fallbackAvailable: true
      };
    }
  }

  /**
   * Call enhanced generation API with fallback to standard API
   */
  async callEnhancedGenerationAPI(enhancedPayload) {
    try {
      // First try enhanced endpoint (when backend is ready)
      try {
        const enhancedResponse = await autoBlogAPI.makeRequest('/api/generate-enhanced-content', {
          method: 'POST',
          body: JSON.stringify(enhancedPayload)
        });
        return enhancedResponse.blogPost;
      } catch (enhancedError) {
        console.log('Enhanced endpoint not available, falling back to standard with enhanced instructions');
        
        // Fallback to standard endpoint with enhanced instructions
        const fallbackInstructions = this.buildFallbackInstructions(enhancedPayload.comprehensiveContext, enhancedPayload.strategicCTAs);
        
        const standardResponse = await autoBlogAPI.generateContent(
          enhancedPayload.topic,
          enhancedPayload.businessInfo,
          fallbackInstructions
        );
        
        return standardResponse;
      }
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  /**
   * Build enhanced instructions for fallback to standard API
   */
  buildFallbackInstructions(comprehensivePrompt, strategicCTAs) {
    const instructions = [];

    // Business context
    instructions.push(`Business Context: ${comprehensivePrompt.businessContext.industryType} company focused on ${comprehensivePrompt.businessContext.businessObjectives}. Brand voice: ${comprehensivePrompt.businessContext.brandTone}.`);

    // Audience context  
    instructions.push(`Target Audience: ${comprehensivePrompt.audienceContext.primarySegment} facing ${comprehensivePrompt.audienceContext.specificPainPoints}. Expertise level: ${comprehensivePrompt.audienceContext.expertiseLevel}.`);

    // Content strategy
    instructions.push(`Content Strategy: ${comprehensivePrompt.contentStrategy.primaryGoal}. Structure: ${comprehensivePrompt.contentStrategy.contentStructure.format}. Voice: ${comprehensivePrompt.contentStrategy.voiceCharacteristics.tone}.`);

    // SEO requirements
    if (comprehensivePrompt.seoInstructions.primaryKeywords.length > 0) {
      instructions.push(`SEO Focus: Target keywords: ${comprehensivePrompt.seoInstructions.primaryKeywords.join(', ')}. Include these naturally throughout the content.`);
    }

    // CTAs
    instructions.push(`Strategic CTAs: Include "${strategicCTAs.primary}" as primary CTA. Place CTAs ${strategicCTAs.placement.join(' and ')}.`);

    // Length and structure
    instructions.push(`Length: Target ${comprehensivePrompt.contentStrategy.lengthGuidance.wordTarget} words. Focus: ${comprehensivePrompt.contentStrategy.lengthGuidance.focusArea}.`);

    return instructions.join(' ');
  }

  /**
   * Analyze content for SEO elements (fallback analysis)
   */
  generateFallbackSEOAnalysis(content, seoInstructions) {
    const analysis = {
      keywordUsage: {},
      titleOptimization: 'Not analyzed',
      readabilityScore: 'Not analyzed',
      recommendations: []
    };

    // Check keyword usage
    if (seoInstructions.primaryKeywords) {
      seoInstructions.primaryKeywords.forEach(keyword => {
        const count = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        analysis.keywordUsage[keyword] = {
          count: count,
          density: (count / content.split(' ').length * 100).toFixed(2),
          status: count > 0 ? 'present' : 'missing'
        };
      });
    }

    // Basic recommendations
    if (content.length < 500) {
      analysis.recommendations.push('Content is shorter than recommended for SEO impact');
    }

    if (!content.includes('##') && !content.includes('#')) {
      analysis.recommendations.push('Consider adding headings for better structure');
    }

    return analysis;
  }

  /**
   * Analyze content quality metrics
   */
  analyzeContentQuality(content) {
    const wordCount = content.split(' ').length;
    const sentenceCount = content.split('.').length;
    const paragraphCount = content.split('\n\n').length;

    return {
      wordCount: wordCount,
      sentenceCount: sentenceCount,
      paragraphCount: paragraphCount,
      avgSentenceLength: Math.round(wordCount / sentenceCount),
      readingTime: Math.ceil(wordCount / 200),
      qualityScore: this.calculateQualityScore(wordCount, sentenceCount, paragraphCount),
      improvements: this.suggestQualityImprovements(wordCount, sentenceCount, content)
    };
  }

  /**
   * Calculate basic content quality score
   */
  calculateQualityScore(wordCount, sentenceCount, paragraphCount) {
    let score = 0;

    // Word count scoring
    if (wordCount >= 800) score += 25;
    else if (wordCount >= 500) score += 15;
    else score += 5;

    // Paragraph structure scoring
    if (paragraphCount >= 5) score += 25;
    else if (paragraphCount >= 3) score += 15;
    else score += 5;

    // Sentence variety scoring (basic check)
    const avgSentenceLength = wordCount / sentenceCount;
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) score += 25;
    else if (avgSentenceLength >= 10 && avgSentenceLength <= 30) score += 15;
    else score += 5;

    // Basic content structure check
    score += 25; // Assume good structure for now

    return Math.min(score, 100);
  }

  /**
   * Suggest quality improvements
   */
  suggestQualityImprovements(wordCount, sentenceCount, content) {
    const suggestions = [];

    if (wordCount < 800) {
      suggestions.push('Consider expanding content to 800+ words for better SEO performance');
    }

    if (sentenceCount / content.split('\n\n').length < 3) {
      suggestions.push('Add more supporting details to each paragraph');
    }

    if (!content.includes('**') && !content.includes('*')) {
      suggestions.push('Add emphasis with bold or italic formatting for key points');
    }

    if ((content.match(/\?/g) || []).length === 0) {
      suggestions.push('Consider adding engaging questions to involve readers');
    }

    return suggestions;
  }

  /**
   * Identify strategic elements in content
   */
  identifyStrategicElements(content, strategicCTAs) {
    const elements = {
      ctaPresence: false,
      valuePropositions: [],
      keyPoints: [],
      actionableItems: []
    };

    // Check for CTA presence
    elements.ctaPresence = content.toLowerCase().includes(strategicCTAs.primary.toLowerCase()) ||
                          content.toLowerCase().includes('contact') ||
                          content.toLowerCase().includes('learn more');

    // Extract headings as key points
    const headings = content.match(/#{1,3}\s+(.+)/g) || [];
    elements.keyPoints = headings.map(h => h.replace(/#{1,3}\s+/, ''));

    // Look for actionable items (basic detection)
    if (content.includes('step') || content.includes('action') || content.includes('implement')) {
      elements.actionableItems.push('Content includes actionable guidance');
    }

    return elements;
  }

  /**
   * Analyze keyword usage in content
   */
  analyzeKeywordUsage(content, seoInstructions) {
    const analysis = {
      primaryKeywords: {},
      secondaryKeywords: {},
      overallOptimization: 'basic'
    };

    if (seoInstructions.primaryKeywords) {
      seoInstructions.primaryKeywords.forEach(keyword => {
        const count = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        analysis.primaryKeywords[keyword] = {
          count: count,
          positions: this.findKeywordPositions(content, keyword),
          optimization: count > 0 ? 'present' : 'missing'
        };
      });
    }

    if (seoInstructions.secondaryKeywords) {
      seoInstructions.secondaryKeywords.forEach(keyword => {
        const count = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        analysis.secondaryKeywords[keyword] = {
          count: count,
          optimization: count > 0 ? 'present' : 'missing'
        };
      });
    }

    return analysis;
  }

  /**
   * Find keyword positions in content for analysis
   */
  findKeywordPositions(content, keyword) {
    const positions = [];
    const words = content.toLowerCase().split(' ');
    words.forEach((word, index) => {
      if (word.includes(keyword.toLowerCase())) {
        positions.push(index);
      }
    });
    return positions;
  }

  /**
   * Generate content with AI feedback loop (for future implementation)
   */
  async generateWithFeedbackLoop(topic, analysisData, strategy, previousVersions = []) {
    // This will be implemented in a future phase
    // For now, return standard generation
    return this.generateEnhancedContent(topic, analysisData, strategy);
  }

  /**
   * Analyze content changes and provide explanations (for future implementation)
   */
  async analyzeContentChanges(previousContent, newContent, userFeedback = '') {
    try {
      const changes = await autoBlogAPI.analyzeChanges(previousContent, newContent, userFeedback);
      return {
        success: true,
        changes: changes,
        explanations: this.buildChangeExplanations(changes),
        suggestions: this.buildImprovementSuggestions(changes)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build change explanations for user understanding
   */
  buildChangeExplanations(changes) {
    // This will provide detailed explanations of why changes were made
    return {
      structuralChanges: 'Explanations of structural improvements',
      contentChanges: 'Explanations of content enhancements',
      seoChanges: 'Explanations of SEO optimizations'
    };
  }

  /**
   * Build improvement suggestions based on analysis
   */
  buildImprovementSuggestions(changes) {
    return [
      'Suggested improvements based on content analysis',
      'SEO optimization recommendations',
      'Engagement enhancement suggestions'
    ];
  }
}

// Export singleton instance
export const enhancedContentAPI = new EnhancedContentAPI();
export default enhancedContentAPI;