/**
 * Candidate Model
 * Represents the data structure for a candidate in an election
 */

export class Candidate {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.party = data.party || '';
    this.voteCount = data.voteCount || 0;
    this.imageUrl = data.imageUrl || '';
    this.description = data.description || '';
  }

  /**
   * Calculate the percentage of votes this candidate has received
   * @param {number} totalVotes - Total number of votes in the election
   * @returns {number} - Percentage of votes (0-100)
   */
  getVotePercentage(totalVotes) {
    if (totalVotes === 0) return 0;
    return (this.voteCount / totalVotes) * 100;
  }

  /**
   * Format the vote count with commas for thousands
   * @returns {string}
   */
  getFormattedVoteCount() {
    return this.voteCount.toLocaleString();
  }
} 