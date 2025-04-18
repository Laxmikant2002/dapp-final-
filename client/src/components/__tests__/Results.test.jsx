import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContractContext } from '../context/ContractContext';
import Results from '../pages/Results';

const mockGetElectionResults = jest.fn();

const mockContextValue = {
  getElectionResults: mockGetElectionResults,
};

describe('Results Component', () => {
  beforeEach(() => {
    mockGetElectionResults.mockResolvedValue([
      { name: 'Candidate A', votes: 100, percentage: 50 },
      { name: 'Candidate B', votes: 100, percentage: 50 },
    ]);
  });

  it('renders the Results component and displays election results', async () => {
    render(
      <ContractContext.Provider value={mockContextValue}>
        <Results />
      </ContractContext.Provider>
    );

    expect(screen.getByText('Vote Distribution')).toBeInTheDocument();
    expect(await screen.findByText('Candidate A')).toBeInTheDocument();
    expect(await screen.findByText('Candidate B')).toBeInTheDocument();
  });
});