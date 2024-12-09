import { Caption, Title } from "../../router";
import { NavLink } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { useState, useRef, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { authUtils } from "../../utils/authUtils";
import fileUtils from "../../utils/fileUtils";
import { useUser } from "../../router";
import { FaHome, FaBriefcase, FaEllipsisH } from "react-icons/fa";
import { FaMapMarkerAlt, FaCity, FaGlobe, FaTag } from "react-icons/fa";


export const Account = () => {
  const { avatarUrl, setAvatarUrl } = useUser();
  const fileInputRef = useRef(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const userId = authUtils.getCurrentUserId();
  const [editingField, setEditingField] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    country: "",
    addressType: "HOME",
  });

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event, callback) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await fileUtils.uploadImage(file, `avatars/${userId}`);
        // setAvatarUrl(imageUrl);  // (Toàn recommend) không nên làm như thế này

        await axiosClient.put(`/api/users/avatar/${userId}`, null, {
          params: { imageUrl: imageUrl }
        });

        if (callback) {
          callback();
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };

  const fetchAccountInfo = async () => {
    try {
      const response = await axiosClient.get(`/api/users/${userId}/accountInfo`);
      setAccountInfo(response.data);
      setAvatarUrl(response.data.avatarImageUrl);
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, [userId]);


  if (!accountInfo) {
    return <div>Loading...</div>;
  }

  const handleEditClick = (field) => {
    if (editingField && editingField !== field) {
      setProfileData({
        ...accountInfo,
      });
    }
    setEditingField(field);
    setProfileData({
      fullName: accountInfo.fullName,
      phoneNumber: accountInfo.phoneNumber,
      streetAddress: accountInfo.streetAddress,
      city: accountInfo.city,
      country: accountInfo.country,
    });
  };

  const handleSaveClick = async () => {
    try {
      await axiosClient.put(`/api/users/${userId}/profile`, profileData);
      await fetchAccountInfo();
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSaveAddress = async () => {
    // Kiểm tra xem streetAddress có được điền hay không
    if (!profileData.streetAddress.trim()) {
      alert("Street Address không được để trống!");
      return;
    }

    try {
      const response = await axiosClient.post(`/api/addresses/updateOrCreate/${userId}`, {
        userId: userId,
        streetAddress: profileData.streetAddress,
        city: profileData.city,
        country: profileData.country,
        addressType: profileData.addressType, // Gửi addressType
      });
      setAccountInfo((prevInfo) => ({
        ...prevInfo,
        streetAddress: response.data.streetAddress,
        city: response.data.city,
        country: response.data.country,
        addressType: response.data.addressType,
      }));
      setEditingField(null);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="description-tab shadow-s3 p-8 rounded-md">
        <Title level={4}>Account Information</Title>
        <hr className="my-5"></hr>
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
              title="Edit avatar"
            >
              <CiEdit size={20} className="text-indigo-500" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(event) => handleFileChange(event, fetchAccountInfo)}
            />
          </div>
        </div>

        <div className="flex justify-between gap-5">
          <div className="mt-4 capitalize w-full">
            <div className="flex justify-between border-b py-3">
              <div className="w-1/2">
                <Title>Fullname</Title>
              </div>
              {editingField === "fullName" ? (
                <div className="flex justify-between py-3 w-1/2">
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                  />
                  <button
                    className="font-medium text-green-500"
                    onClick={handleSaveClick}
                  >
                    <CiCircleCheck size={25} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between py-3 w-1/2">
                  <p>{accountInfo.fullName}</p>
                  <NavLink
                    to=""
                    type="button"
                    className="font-medium text-indigo-500"
                    onClick={() => handleEditClick("fullName")}
                  >
                    <CiEdit size={25} />
                  </NavLink>
                </div>
              )}
            </div>
            <div className="flex justify-between border-b py-3">
              <div className="w-1/2">
                <Title>Account type</Title>
              </div>
              <div className="flex justify-between py-3 w-1/2">
                <Caption>{accountInfo.role}</Caption>
              </div>
            </div>
            <div className="flex justify-between border-b py-3">
              <div className="w-1/2">
                <Title>Contact details</Title>
              </div>
              <div className="w-1/2">
                <div className="border-b">
                  <div className="flex justify-between py-3">
                    <Title>Email address </Title>
                    <div className="text-center flex items-center gap-3 mt-1">
                      <NavLink to="#" type="button" className="font-medium text-green">
                        <CiCircleCheck size={25} />
                      </NavLink>
                      <NavLink to="" type="button" className="font-medium text-indigo-500">
                      </NavLink>
                    </div>
                  </div>
                  <Caption> {accountInfo.email} </Caption>
                </div>

                <div className="flex justify-between py-3">
                  <Title>Phone Number </Title>
                </div>
                {editingField === "phoneNumber" ? (
                  <div className="flex justify-between py-3">
                    <input
                      type="text"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleChange}
                    />
                    <button
                      className="font-medium text-green-500"
                      onClick={handleSaveClick}
                    >
                      <CiCircleCheck size={25} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between py-3">
                    <p>{accountInfo.phoneNumber}</p>
                    <NavLink
                      to=""
                      type="button"
                      className="font-medium text-indigo-500"
                      onClick={() => handleEditClick("phoneNumber")}
                    >
                      <CiEdit size={25} />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between border-b py-3">
              <Title>Address</Title>
              <div className="w-1/2">
                {editingField === "address" ? (
                  <div className="flex flex-col">

                    {/* Address Type */}
                    <div className="flex flex-col gap-3 py-4">
                      <label htmlFor="addressType" className="font-medium text-gray-700 flex items-center gap-2">
                        Address Type
                      </label>
                      <div className="relative">
                        <select
                          id="addressType"
                          name="addressType"
                          value={profileData.addressType || "HOME"}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                        >
                          <option value="HOME">
                            Home
                          </option>
                          <option value="WORK">
                            Work
                          </option>
                          <option value="OTHERS">
                            Others
                          </option>
                        </select>
                        {/* Icon dynamically changes based on selection */}
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                          {profileData.addressType === "HOME" && <FaHome />}
                          {profileData.addressType === "WORK" && <FaBriefcase />}
                          {profileData.addressType === "OTHERS" && <FaEllipsisH />}
                        </div>
                      </div>
                    </div>



                    {/* Street Address */}
                    <div className="flex justify-between py-3">
                      <label htmlFor="streetAddress" className="font-medium">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={profileData.streetAddress}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-2/3"
                      />
                    </div>

                    {/* City */}
                    <div className="flex justify-between py-3">
                      <label htmlFor="city" className="font-medium">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-2/3"
                      />
                    </div>

                    {/* Country */}
                    <div className="flex justify-between py-3">
                      <label htmlFor="country" className="font-medium">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-2/3"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        className="font-medium text-green-500"
                        onClick={() => handleSaveAddress()}
                      >
                        <CiCircleCheck size={25} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between py-3">

                    {/* Address Info */}
                    <div className="space-y-2 py-4">
                      {/* Street Address */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{accountInfo?.streetAddress || "N/A"}</span>
                      </div>

                      {/* City */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaCity className="text-blue-500" />
                        <span>{accountInfo?.city || "N/A"}</span>
                      </div>

                      {/* Country */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaGlobe className="text-blue-500" />
                        <span>{accountInfo?.country || "N/A"}</span>
                      </div>

                      {/* Address Type */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaTag className="text-blue-500" />
                        <span>{accountInfo?.addressType || "N/A"}</span>
                      </div>
                    </div>

                    <NavLink
                      to=""
                      type="button"
                      className="font-medium text-indigo-500"
                      onClick={() => handleEditClick("address")}
                    >
                      <CiEdit size={25} />
                    </NavLink>
                  </div>
                )}
              </div>
            </div>;

          </div>
        </div>
      </div>
    </>
  );
};
