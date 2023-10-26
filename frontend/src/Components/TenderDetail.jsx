import React from 'react';
import TenderDetails from './TenderDetails';

const tenderData = {
  imageUrl: 'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
  name: 'Sample Tender Name',
  company: 'Sample Company Inc',
  category: 'Sample Category',
  cost: 10000,
  status: 'Open',
};

const TenderDetail = () => {
  return (
    <div className="  bg-gray-200">
      <TenderDetails tender={tenderData} />
    </div>
  );
};

export default TenderDetail;
