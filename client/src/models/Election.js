/**
 * Election Model
 * Represents the data structure for an election
 */

export class Election {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'upcoming';
    this.startTime = data.startTime || 0;
    this.endTime = data.endTime || 0;
    this.candidates = data.candidates || [];
    this.totalVotes = data.totalVotes || 0;
  }

  /**
   * Check if the election is active
   * @returns {boolean}
   */
  isActive() {
    const now = Math.floor(Date.now() / 1000);
    return this.status === 'active' || (now >= this.startTime && now <= this.endTime);
  }

  /**
   * Check if the election has ended
   * @returns {boolean}
   */
  hasEnded() {
    const now = Math.floor(Date.now() / 1000);
    return this.status === 'ended' || now > this.endTime;
  }

  /**
   * Get time remaining in the election
   * @returns {string}
   */
  getTimeRemaining() {
    if (this.hasEnded()) {
      return 'Election has ended';
    }

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = this.endTime - now;
    
    if (timeLeft <= 0) {
      return 'Election has ended';
    }

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
} 