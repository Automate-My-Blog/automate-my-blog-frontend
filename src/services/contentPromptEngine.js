/**
 * Advanced Content Generation Prompt Engine
 * Comprehensive dynamic prompt system with multi-layered context
 */

/**
 * Enhanced Prompt Context Builder
 * Creates comprehensive prompts beyond basic goal/voice/template/length
 */
export class ContentPromptEngine {
  constructor() {
    this.defaultValues = {
      goal: 'consideration',
      voice: 'expert',
      template: 'comprehensive',
      length: 'standard'
    };
  }

  /**
   * Build comprehensive content generation prompt
   */
  buildComprehensivePrompt(topic, analysisData, strategy = {}, enhancementOptions = {}) {
    const context = this.buildMultiLayeredContext(analysisData, strategy, enhancementOptions);
    const contentStrategy = this.buildContentStrategy(strategy, enhancementOptions);
    const seoInstructions = this.buildSEOInstructions(analysisData, strategy, enhancementOptions);
    const structuralGuidance = this.buildStructuralGuidance(strategy, enhancementOptions);
    
    return {
      businessContext: context.businessContext,
      audienceContext: context.audienceContext,
      competitiveContext: context.competitiveContext,
      contentStrategy: contentStrategy,
      seoInstructions: seoInstructions,
      structuralGuidance: structuralGuidance,
      topic: topic,
      additionalInstructions: this.buildAdditionalInstructions(enhancementOptions)
    };
  }

  /**
   * Multi-layered content generation context
   * Goes beyond goal/voice/template/length to include comprehensive business intelligence
   */
  buildMultiLayeredContext(analysisData, strategy = {}, options = {}) {
    return {
      // Business Context Layer
      businessContext: {
        industryType: analysisData.businessType || 'Technology',
        businessName: analysisData.businessName || 'Your Business',
        brandPersonality: analysisData.brandVoice || 'Professional',
        businessObjectives: strategy.conversionPath || analysisData.websiteGoals || 'Generate leads and build authority',
        competitivePositioning: this.extractCompetitivePositioning(analysisData),
        businessModel: analysisData.businessModel || 'Service-based business',
        valueProposition: this.extractValueProposition(analysisData, strategy),
        brandTone: this.mapBrandVoiceToTone(analysisData.brandVoice)
      },

      // Audience Context Layer  
      audienceContext: {
        primarySegment: strategy.targetSegment || analysisData.decisionMakers || 'Business professionals',
        specificPainPoints: strategy.customerProblem || (analysisData.customerProblems && analysisData.customerProblems[0]) || 'Business challenges',
        customerLanguage: this.buildCustomerLanguage(analysisData, strategy),
        journeyStage: this.determineJourneyStage(strategy),
        searchBehavior: analysisData.searchBehavior || 'Seeking expert guidance and solutions',
        expertiseLevel: this.determineAudienceExpertise(analysisData, strategy),
        demographicContext: this.buildDemographicContext(analysisData)
      },

      // Competitive Context Layer
      competitiveContext: {
        marketPosition: this.extractMarketPosition(analysisData),
        contentDifferentiation: this.buildContentDifferentiation(analysisData, strategy),
        industryTrends: this.extractIndustryContext(analysisData),
        competitiveAdvantages: this.extractCompetitiveAdvantages(analysisData)
      }
    };
  }

  /**
   * Content Strategy Configuration
   * Enhanced beyond basic template selection
   */
  buildContentStrategy(strategy = {}, options = {}) {
    const goal = options.goal || strategy.goal || this.defaultValues.goal;
    const voice = options.voice || strategy.voice || this.defaultValues.voice;
    const template = options.template || strategy.template || this.defaultValues.template;
    const length = options.length || strategy.length || this.defaultValues.length;

    return {
      primaryGoal: this.mapGoalToStrategy(goal),
      voiceCharacteristics: this.buildVoiceCharacteristics(voice),
      contentStructure: this.buildContentStructure(template),
      lengthGuidance: this.buildLengthGuidance(length),
      engagementStrategy: this.buildEngagementStrategy(goal, voice),
      conversionElements: this.buildConversionElements(goal, strategy),
      contentDepth: this.determineContentDepth(template, length),
      interactivityLevel: this.determineInteractivityLevel(template, voice)
    };
  }

  /**
   * SEO Instructions with keyword integration
   */
  buildSEOInstructions(analysisData, strategy = {}, options = {}) {
    const primaryKeywords = strategy.seoKeywords || analysisData.keywords || [];
    const secondaryKeywords = this.buildSecondaryKeywords(analysisData, strategy);
    
    return {
      primaryKeywords: primaryKeywords.slice(0, 3),
      secondaryKeywords: secondaryKeywords.slice(0, 5),
      keywordDensity: this.calculateOptimalDensity(primaryKeywords),
      semanticKeywords: this.buildSemanticKeywords(analysisData),
      titleOptimization: this.buildTitleGuidance(primaryKeywords),
      metaGuidance: this.buildMetaGuidance(primaryKeywords, analysisData),
      internalLinkingOpportunities: this.identifyLinkingOpportunities(analysisData),
      featuredSnippetOptimization: this.buildSnippetGuidance(primaryKeywords),
      localSeoConsiderations: this.buildLocalSEOGuidance(analysisData)
    };
  }

  /**
   * Structural Content Guidance
   */
  buildStructuralGuidance(strategy = {}, options = {}) {
    return {
      introductionStyle: this.determineIntroStyle(strategy),
      sectionStructure: this.buildSectionStructure(strategy, options),
      conclusionStrategy: this.buildConclusionStrategy(strategy),
      ctaPlacement: this.determineCTAPlacement(strategy),
      visualElements: this.suggestVisualElements(strategy),
      readabilityTargets: this.setReadabilityTargets(options),
      headingHierarchy: this.buildHeadingStrategy(options),
      listFormatting: this.determineListStrategy(strategy)
    };
  }

  /**
   * Helper Methods for Context Building
   */
  
  extractCompetitivePositioning(analysisData) {
    if (analysisData.webSearchStatus?.businessResearchSuccess) {
      return `Market-researched positioning with competitive insights`;
    }
    return `Established ${analysisData.businessType} with focus on ${analysisData.contentFocus}`;
  }

  extractValueProposition(analysisData, strategy) {
    if (strategy && strategy.businessValue) {
      return strategy.businessValue;
    }
    return analysisData.connectionMessage || `Expert ${analysisData.businessType} solutions`;
  }

  mapBrandVoiceToTone(brandVoice) {
    const toneMap = {
      'Professional': 'Authoritative yet approachable, industry-expert tone',
      'Friendly': 'Conversational and warm, building personal connection',
      'Expert': 'Thought-leadership voice with deep expertise demonstration',
      'Casual': 'Relaxed and accessible, breaking down complex topics'
    };
    return toneMap[brandVoice] || toneMap.Professional;
  }

  buildCustomerLanguage(analysisData, strategy) {
    const language = [];
    if (strategy && strategy.customerLanguage) {
      language.push(...strategy.customerLanguage);
    }
    if (analysisData.customerLanguage) {
      language.push(...analysisData.customerLanguage);
    }
    return language.length > 0 ? language : ['professional terminology', 'industry-specific language'];
  }

  determineJourneyStage(strategy) {
    if (strategy && strategy.conversionPath?.includes('lead')) return 'consideration';
    if (strategy && strategy.conversionPath?.includes('sale')) return 'decision';
    if (strategy && strategy.conversionPath?.includes('awareness')) return 'awareness';
    return 'consideration';
  }

  determineAudienceExpertise(analysisData, strategy) {
    if (analysisData.decisionMakers?.includes('executive') || analysisData.decisionMakers?.includes('manager')) {
      return 'experienced professional';
    }
    if ((strategy && strategy.customerProblem?.includes('beginner')) || (strategy && strategy.customerProblem?.includes('new to'))) {
      return 'beginner to intermediate';
    }
    return 'intermediate to advanced';
  }

  buildDemographicContext(analysisData) {
    return {
      primaryRole: analysisData.decisionMakers || 'Business decision maker',
      industryFamiliarity: 'High familiarity with industry challenges',
      technicalLevel: 'Professional-level technical understanding',
      contentPreference: 'In-depth, actionable content with clear implementation guidance'
    };
  }

  buildSecondaryKeywords(analysisData, strategy) {
    const secondary = [];
    if (analysisData.keywords) {
      secondary.push(...analysisData.keywords.slice(3, 8));
    }
    if (strategy && strategy.relatedTerms) {
      secondary.push(...strategy.relatedTerms);
    }
    return secondary;
  }

  buildSemanticKeywords(analysisData) {
    const semantic = [];
    if (analysisData.businessType) {
      semantic.push(`${analysisData.businessType} solutions`, `${analysisData.businessType} strategy`);
    }
    if (analysisData.targetAudience) {
      semantic.push(`${analysisData.targetAudience} challenges`);
    }
    return semantic;
  }

  buildAdditionalInstructions(options = {}) {
    const instructions = [];
    
    if (options.includeCaseStudies) {
      instructions.push('Include relevant case studies or examples where appropriate');
    }
    
    if (options.emphasizeROI) {
      instructions.push('Emphasize ROI and business value throughout the content');
    }
    
    if (options.includeActionables) {
      instructions.push('Provide specific, actionable steps readers can implement immediately');
    }
    
    if (options.addStatistics) {
      instructions.push('Include relevant industry statistics to support key points');
    }
    
    if (options.competitiveComparison) {
      instructions.push('Include subtle competitive comparisons where relevant');
    }

    return instructions.join('. ');
  }

  /**
   * Content Strategy Mapping Methods
   */
  
  mapGoalToStrategy(goal) {
    const strategies = {
      awareness: 'Educational content that builds brand recognition and thought leadership',
      consideration: 'Solution-focused content that demonstrates expertise and builds trust',
      conversion: 'Compelling content that drives immediate action with clear value proposition', 
      retention: 'Value-added content that strengthens existing customer relationships'
    };
    return strategies[goal] || strategies.consideration;
  }

  buildVoiceCharacteristics(voice) {
    const characteristics = {
      expert: {
        tone: 'Authoritative and knowledgeable',
        approach: 'Data-driven insights with industry expertise',
        language: 'Professional terminology with clear explanations'
      },
      friendly: {
        tone: 'Approachable and personable', 
        approach: 'Conversational guidance with personal examples',
        language: 'Accessible language with relatable analogies'
      },
      insider: {
        tone: 'Exclusive and informed',
        approach: 'Behind-the-scenes insights and industry secrets',
        language: 'Insider terminology with expert-level depth'
      },
      storyteller: {
        tone: 'Engaging and narrative-driven',
        approach: 'Story-based content with compelling examples',
        language: 'Vivid descriptions with emotional connection'
      }
    };
    return characteristics[voice] || characteristics.expert;
  }

  buildContentStructure(template) {
    const structures = {
      'how-to': {
        format: 'Step-by-step instructional guide',
        sections: 'Introduction → Prerequisites → Steps → Conclusion → Next Actions',
        emphasis: 'Clear, actionable instructions with practical examples'
      },
      'problem-solution': {
        format: 'Problem identification and comprehensive solution framework',
        sections: 'Problem Definition → Impact Analysis → Solution Framework → Implementation → Results',
        emphasis: 'Clear problem-solution alignment with measurable outcomes'
      },
      'listicle': {
        format: 'Numbered list with detailed explanations',
        sections: 'Introduction → List Items (with subsections) → Summary → Action Items',
        emphasis: 'Scannable format with substantial detail for each point'
      },
      'case-study': {
        format: 'Detailed analysis of real-world implementation',
        sections: 'Background → Challenge → Solution → Implementation → Results → Lessons',
        emphasis: 'Specific details, metrics, and transferable insights'
      },
      'comprehensive': {
        format: 'In-depth guide covering all aspects of the topic',
        sections: 'Overview → Core Concepts → Advanced Strategies → Implementation → Optimization',
        emphasis: 'Thorough coverage with beginner-to-advanced progression'
      }
    };
    return structures[template] || structures.comprehensive;
  }

  buildLengthGuidance(length) {
    const guidance = {
      quick: {
        wordTarget: 500,
        focusArea: 'Single key concept with immediate actionability',
        depth: 'Surface-level with clear next steps'
      },
      standard: {
        wordTarget: 1000,
        focusArea: 'Comprehensive treatment of main topic with supporting details',
        depth: 'Moderate depth with practical examples and implementation guidance'
      },
      deep: {
        wordTarget: 2000,
        focusArea: 'Exhaustive coverage with multiple perspectives and advanced strategies',
        depth: 'Deep expertise with comprehensive examples, case studies, and advanced techniques'
      }
    };
    return guidance[length] || guidance.standard;
  }
}

/**
 * Strategic CTA Builder
 * Creates contextually relevant calls-to-action based on content strategy
 */
export class StrategicCTABuilder {
  constructor() {
    this.ctaTemplates = {
      awareness: {
        primary: 'Learn more about our {solution}',
        secondary: 'Subscribe for expert insights',
        tertiary: 'Download our {industry} guide'
      },
      consideration: {
        primary: 'Get a free {consultation/audit}',
        secondary: 'Compare your options',
        tertiary: 'See how we help {audience}'
      },
      conversion: {
        primary: 'Start your {solution} today',
        secondary: 'Schedule your {demo/call}',
        tertiary: 'Get custom pricing'
      },
      retention: {
        primary: 'Upgrade your {service}',
        secondary: 'Explore advanced features',
        tertiary: 'Join our community'
      }
    };
  }

  buildStrategicCTAs(analysisData, strategy, contentGoal) {
    const goal = contentGoal || strategy.goal || 'consideration';
    const templates = this.ctaTemplates[goal] || this.ctaTemplates.consideration;
    
    return {
      primary: this.customizeCTA(templates.primary, analysisData, strategy),
      secondary: this.customizeCTA(templates.secondary, analysisData, strategy),
      tertiary: this.customizeCTA(templates.tertiary, analysisData, strategy),
      placement: this.determineCTAPlacement(goal),
      style: this.determineCTAStyle(goal, strategy)
    };
  }

  customizeCTA(template, analysisData, strategy) {
    return template
      .replace('{solution}', analysisData.contentFocus || 'solutions')
      .replace('{industry}', analysisData.businessType || 'business')
      .replace('{audience}', analysisData.targetAudience || 'businesses')
      .replace('{consultation/audit}', analysisData.businessType.includes('Consulting') ? 'consultation' : 'audit')
      .replace('{demo/call}', analysisData.businessModel?.includes('Software') ? 'demo' : 'call')
      .replace('{service}', analysisData.contentFocus || 'service');
  }

  determineCTAPlacement(goal) {
    const placements = {
      awareness: ['end-of-content', 'sidebar'],
      consideration: ['mid-content', 'end-of-content'],
      conversion: ['early-content', 'mid-content', 'end-of-content'],
      retention: ['mid-content', 'end-of-content']
    };
    return placements[goal] || placements.consideration;
  }

  determineCTAStyle(goal, strategy) {
    const styles = {
      awareness: { urgency: 'low', tone: 'educational', format: 'soft-offer' },
      consideration: { urgency: 'medium', tone: 'solution-focused', format: 'value-offer' },
      conversion: { urgency: 'high', tone: 'action-oriented', format: 'direct-offer' },
      retention: { urgency: 'medium', tone: 'enhancement-focused', format: 'upgrade-offer' }
    };
    return styles[goal] || styles.consideration;
  }
}

export default ContentPromptEngine;