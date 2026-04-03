const fs = require('fs').promises;
const path = require('path');

class KnowledgeBaseService {
  constructor() {
    this.knowledgeBasePath = path.join(__dirname, '../data/knowledgeBase');
  }

  // Load knowledge base from JSON files
  async loadKnowledgeBase(subject) {
    try {
      const filePath = path.join(this.knowledgeBasePath, `${subject}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`No knowledge base found for ${subject}`);
      return null;
    }
  }

  // Add new knowledge to the base
  async addKnowledge(subject, content) {
    try {
      const filePath = path.join(this.knowledgeBasePath, `${subject}.json`);
      await fs.mkdir(this.knowledgeBasePath, { recursive: true });
      
      let existingData = await this.loadKnowledgeBase(subject) || { topics: [], facts: [], examples: [] };
      
      // Merge new content
      if (content.topics) existingData.topics.push(...content.topics);
      if (content.facts) existingData.facts.push(...content.facts);
      if (content.examples) existingData.examples.push(...content.examples);
      
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
      return true;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      return false;
    }
  }

  // Get formatted knowledge for AI prompts
  getKnowledgeForPrompt(subject) {
    const knowledge = this.loadKnowledgeBase(subject);
    if (!knowledge) return '';
    
    return `
Knowledge Base for ${subject}:
Topics: ${knowledge.topics?.join(', ')}
Key Facts: ${knowledge.facts?.join(', ')}
Examples: ${knowledge.examples?.join(', ')}
`;
  }
}

module.exports = new KnowledgeBaseService();
