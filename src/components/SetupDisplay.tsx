import React from 'react';

interface Props {
  equipmentLevel: number;
}

export const SetupDisplay: React.FC<Props> = ({ equipmentLevel }) => {
  const gifUrl = equipmentLevel === 3 
    ? 'https://i.ibb.co/qM8mYp1P/Sprite-0003.gif' 
    : 'default-gif-url'; // Replace with the default GIF URL

  return (
    <div className="setup-display">
      <img src={gifUrl} alt="Setup Display" className="w-full h-auto" />
    </div>
  );
}; 