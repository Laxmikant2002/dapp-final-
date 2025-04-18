import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContractContext } from '../context/ContractContext';
import Elections from '../pages/Elections';

const mockGetElections = jest.fn();
const mockCastVote = jest.fn();

const mockContextValue = {
  getElections: mockGetElections,
  castVote: mockCastVote,
};

describe('Elections Component', () => {
  beforeEach(() => {
    mockGetElections.mockResolvedValue([
      {
        id: 1,
        title: 'Presidential Election',
        description: 'Vote for the next president',
        candidates: [],
        isActive: true,
      },
    ]);
  });

  it('renders the Elections component and displays active elections', async () => {
    render(
      <ContractContext.Provider value={mockContextValue}>
        <Elections />
      </ContractContext.Provider>
    );

    expect(screen.getByText('Active Elections')).toBeInTheDocument();
    expect(await screen.findByText('Presidential Election')).toBeInTheDocument();
  });

  it('handles voting action', async () => {
    render(
      <ContractContext.Provider value={mockContextValue}>
        <Elections />
      </ContractContext.Provider>
    );

    const voteButton = await screen.findByText('Vote Now');
    fireEvent.click(voteButton);

    expect(mockCastVote).toHaveBeenCalled();
  });
});