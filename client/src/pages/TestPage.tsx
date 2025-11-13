import React from 'react';
import PreviewV2 from '../components/PreviewV2';

const TestPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div id='containerDiv' className='max-h-[80vh] h-full max-w-[80vw] w-full bg-red-500 '>
        <PreviewV2 />
      </div>
    </div>
  );
};

export default TestPage;
