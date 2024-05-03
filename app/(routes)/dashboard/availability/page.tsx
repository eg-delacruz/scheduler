import DaysList from '@utils/DaysList';
import React from 'react';

function Availability() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Availability</h2>
      <hr className='my-7' />
      <div>
        <h2>Availability Days</h2>
        <div>
          {DaysList.map((item, index) => (
            <div key={index}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Availability;
