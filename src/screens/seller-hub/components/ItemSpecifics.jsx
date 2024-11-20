import React from 'react';

// base
// chưa thấy thuộc tính specifics trong product dto
// chưa hoàn thiện, chờ BE
export const ItemSpecifics = ({ productDetails, setProductDetails }) => {

  const specifics = {
    Condition: 'Used: An item that has been used previously. The item may have some signs of cosmetic wear, but is fully operational and functions as intended. This item may be a floor model or store return that has been used. See the seller\'s listing for full details and description of any imperfections. See all condition definitions',
    Series: 'Series 4',
    Network: 'GPS',
    CaseSize: '40mm',
    Features: 'Accelerometer, Barometer, gyro, heart rate...',
    StorageCapacity: '16GB',
  };

  return (
    <div className="mb-10 border-t pt-4">
      <h2 className="text-lg font-semibold mb-2">ITEM SPECIFICS</h2>
      <table className="table-fixed w-full">
        <tbody>
          {Object.keys(specifics).map((key) => (
            <tr key={key}>
              <td className="px-4 py-2 font-semibold w-2/5 align-top">{key}</td>
              <td className="px-4 py-2">{specifics[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
