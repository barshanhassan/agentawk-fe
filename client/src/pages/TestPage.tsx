import React from 'react';
import PreviewV2 from '../components/PreviewV2';

const TestPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div id='containerDiv' className='h-full max-h-[62vh] w-full max-w-[80vh] bg-red-500 '>
        <PreviewV2 mode="chat"/>
      </div>
    </div>
  );
};

export default TestPage;
