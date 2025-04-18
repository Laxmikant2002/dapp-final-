import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteVerification from '../pages/VoteVerification';
import { verifyVoteByTxHash, verifyVoteByAddress } from '../utils/blockchain';

jest.mock('../utils/blockchain', () => ({
  verifyVoteByTxHash: jest.fn(),
  verifyVoteByAddress: jest.fn(),
}));

describe('VoteVerification Component', () => {
  beforeEach(() => {
    verifyVoteByTxHash.mockResolvedValue({
      candidateName: 'Candidate A',
      candidateParty: 'Party X',
      pollId: 1,
      timestamp: 1672531200,
    });

    verifyVoteByAddress.mockResolvedValue({
      candidateName: 'Candidate B',
      candidateParty: 'Party Y',
      pollId: 2,
      timestamp: 1672531200,
    });
  });

  it('renders the VoteVerification component and verifies a vote by transaction hash', async () => {
    render(<VoteVerification />);

    const input = screen.getByPlaceholderText('0x...');
    fireEvent.change(input, { target: { value: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' } });

    const verifyButton = screen.getByText('Verify Vote');
    fireEvent.click(verifyButton);

    expect(await screen.findByText('Vote Verified')).toBeInTheDocument();
    expect(await screen.findByText('Candidate A')).toBeInTheDocument();
  });

  it('verifies a vote by wallet address', async () => {
    render(<VoteVerification />);

    const input = screen.getByPlaceholderText('0x...');
    fireEvent.change(input, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } });

    const verifyButton = screen.getByText('Verify Vote');
    fireEvent.click(verifyButton);

    expect(await screen.findByText('Vote Verified')).toBeInTheDocument();
    expect(await screen.findByText('Candidate B')).toBeInTheDocument();
  });
});