import React from "react";

// Chưa làm: Chọn định dạng tiền
export const AuctionSettings = ({ auctionSettings, setAuctionSettings }) => {
  const handleChange = (field, parseType = 'string') => (event) => {
    let value = event.target.value;

    switch (parseType) {
      case 'number':
        value = parseFloat(value) || 0; // Chuyển đổi thành số (nếu không hợp lệ sẽ thành 0)
        break;
      case 'datetime':
        value = new Date(value); // Chuyển đổi thành Date
        break;
      default:
        break; // giữ nguyên giá trị chuỗi
    }

    setAuctionSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  return (
    <div className="mb-10 border-t pt-4">
      <h2 className="text-lg font-bold mb-2">AUCTION SETTINGS</h2>
      <table className="table-fixed w-full">
        <tbody>
          <tr>
            <td className="px-4 py-2 font-semibold w-2/5 align-top">Title</td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={auctionSettings.title}
                onChange={handleChange("title")}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold w-2/5 align-top">
              Start Time
            </td>
            <td className="px-4 py-2">
              <input
                type="datetime-local"
                value={auctionSettings.startTime ? auctionSettings.startTime.toISOString().slice(0, 16) : ''}
                onChange={handleChange("startTime", 'datetime')}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold w-2/5 align-top">
              End Time
            </td>
            <td className="px-4 py-2">
              <input
                type="datetime-local"
                value={auctionSettings.endTime ? auctionSettings.endTime.toISOString().slice(0, 16) : ''}
                onChange={handleChange("endTime", 'datetime')}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold w-2/5 align-top">
              Start Price
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                value={auctionSettings.startPrice}
                onChange={handleChange("startPrice", 'number')}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold w-2/5 align-top">
              Minimum Bid Increment
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                value={auctionSettings.minimumBidIncrement}
                onChange={handleChange("minimumBidIncrement", 'number')}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
