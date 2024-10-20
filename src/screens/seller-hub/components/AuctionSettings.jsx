import React from "react";

// Chưa làm : Chọn định dạng tiền
export const AuctionSettings = ({ auctionSettings, setAuctionSettings }) => {
  const handleChange = (field) => (event) => {
    setAuctionSettings((prevSettings) => ({
      ...prevSettings,
      [field]: event.target.value,
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
                value={auctionSettings.startTime}
                onChange={handleChange("startTime")}
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
                value={auctionSettings.endTime}
                onChange={handleChange("endTime")}
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
                type="text"
                value={auctionSettings.startPrice}
                onChange={handleChange("startPrice")}
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
                type="text"
                value={auctionSettings.minimumBidIncrement}
                onChange={handleChange("minimumBidIncrement")}
                className="border rounded w-full px-2 py-1"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
