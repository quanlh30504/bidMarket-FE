import React, { useState, useMemo, useEffect } from 'react';

export const ItemSpecifics = ({ productDetails, setProductDetails, disabled = false }) => {
  const specifics = useMemo(() => productDetails?.specifics || {}, [productDetails.specifics]);
  const [isEditing, setIsEditing] = useState(true);

  React.useEffect(() => {
    if (!specifics.Description) {
      setProductDetails({
        ...productDetails,
        specifics: { ...specifics, Description: '' },
      });
    }
  }, []);

  const handleAddSpecific = () => {
    if (disabled || Object.keys(specifics).length >= 15) return;
    setProductDetails({
      ...productDetails,
      specifics: {
        ...specifics,
        '': '', // Thêm specific mới với key và value rỗng
      },
    });
  };

  const handleRemoveSpecific = (key) => {
    if (disabled || key === 'Description') return; // Không thể xóa Description
    const updatedSpecifics = { ...specifics };
    delete updatedSpecifics[key];
    setProductDetails({ ...productDetails, specifics: updatedSpecifics });
  };

  const handleChangeSpecific = (oldKey, newKey, value) => {
    if (disabled) return;
    const updatedSpecifics = { ...specifics };
    delete updatedSpecifics[oldKey];
    updatedSpecifics[newKey] = value;
    setProductDetails({ ...productDetails, specifics: updatedSpecifics });
  };

  return (
    <div className="mb-10 border-t pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">ITEM SPECIFICS</h2>
        {!disabled && (
          <button className="flex items-center gap-1" onClick={() => setIsEditing(!isEditing)}>
            <svg
              className="relative bottom-[2px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                fill="#0F0F0F"
              ></path>
            </svg>
            <p className="font-bold">{isEditing ? 'Save' : 'Edit'}</p>
          </button>
        )}
      </div>

      {isEditing && !disabled ? (
        <div className="mt-4">
          <table className="table-fixed w-full">
            <tbody>
              {Object.keys(specifics).map((key, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 w-2/5 align-top">
                    <input
                      type="text"
                      className="border px-2 py-1 w-full"
                      placeholder="Enter attribute name"
                      value={key}
                      disabled={key === 'Description'} // Không thể sửa tên Description
                      onChange={(e) => handleChangeSpecific(key, e.target.value, specifics[key])}
                    />
                  </td>
                  <td className="px-4 py-2 w-2/5 align-top">
                    <input
                      type="text"
                      className="border px-2 py-1 w-full"
                      placeholder="Enter attribute value"
                      value={specifics[key]}
                      required={key === 'Description'} // Bắt buộc nhập Description
                      onChange={(e) => handleChangeSpecific(key, key, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 align-top">
                    {key !== 'Description' && (
                      <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleRemoveSpecific(key)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Object.keys(specifics).length < 15 && (
            <div className="mt-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddSpecific}
              >
                Add Specific
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
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
      )}
    </div>
  );
};
