import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'fa-shield-alt',
      title: 'Secure Voting',
      description: 'Your vote is encrypted and stored on the blockchain, ensuring complete security and transparency.'
    },
    {
      icon: 'fa-user-check',
      title: 'Voter Verification',
      description: 'Advanced verification system to ensure only eligible voters can participate in elections.'
    },
    {
      icon: 'fa-chart-bar',
      title: 'Real-time Results',
      description: 'View election results in real-time as votes are cast and verified on the blockchain.'
    },
    {
      icon: 'fa-clock',
      title: '24/7 Accessibility',
      description: 'Vote from anywhere, anytime. Our system is available round the clock during election periods.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain-based voting system comes packed with powerful features to ensure a secure and transparent voting experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className={`fas ${feature.icon} text-blue-600 text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 