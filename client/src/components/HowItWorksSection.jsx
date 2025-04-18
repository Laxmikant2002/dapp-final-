import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Wallet',
      description: 'Start by connecting your Ethereum wallet to our platform. This is your digital identity for voting.'
    },
    {
      number: '02',
      title: 'Verify Your Identity',
      description: 'Complete the verification process to ensure you are an eligible voter for the election.'
    },
    {
      number: '03',
      title: 'Cast Your Vote',
      description: 'Select your preferred candidate and submit your vote. Your choice is encrypted and recorded on the blockchain.'
    },
    {
      number: '04',
      title: 'View Results',
      description: 'After the election period ends, view the results in real-time as they are verified on the blockchain.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our voting process is simple, secure, and transparent. Here's how you can participate in the election.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative"
            >
              <div className="bg-blue-50 rounded-lg p-6 h-full">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <i className="fas fa-arrow-right text-blue-600 text-xl"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 