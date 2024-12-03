import { Caption, Title } from "../../router";
import { NavLink } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { useState, useRef, useEffect } from 'react';
import axiosClient from "../../services/axiosClient";
import { authUtils } from '../../utils/authUtils';




export const Account = () => {
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");
  const fileInputRef = useRef(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const userId = authUtils.getCurrentUserId();
  const [editingField, setEditingField] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    role: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    country: ''
  });

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      
      setAvatarUrl(tempUrl);

      try {
        const response = await axiosClient.put(`/api/users/avatar/${userId}`, null, {
          params: { imageUrl: tempUrl }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error updating avatar:', error);
      }
    }
  };
 
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axiosClient.get(`/api/users/${userId}/accountInfo`);
        setAccountInfo(response.data);
        // setAvatarUrl(response.data.avatarImageUrl);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching account info:', error);
      }
    };

    fetchAccountInfo();
  }, [userId]);

  if (!accountInfo) {
    return <div>Loading...</div>;
  }

  const handleEditClick = (field) => {
    setEditingField(field);
    setProfileData({
      fullName: accountInfo.fullName,
      role: accountInfo.role,
      email: accountInfo.email,
      phone: accountInfo.phone,
      streetAddress: accountInfo.address,
      city: accountInfo.city,
      country: accountInfo.country
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axiosClient.put(`/api/users/${userId}/profile`, profileData);
      setAccountInfo(response.data);
      console.log(response.data);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value
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
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-between gap-5">
          <div className="mt-4 capitalize w-full">
            <div className="flex justify-between border-b py-3">
              <div className="w-1/2">
                <Title>Fullname</Title>
              </div>

              {editingField === 'fullName' ? (
          <div className="flex justify-between py-3 w-1/2">
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleChange}
            />
            <button className="font-medium text-green-500" onClick={handleSaveClick}>
              <CiCircleCheck size={25} />
            </button>
          </div>
        ) : (
          <div className="flex justify-between py-3 w-1/2">
            <p>{accountInfo.fullName}</p>
            <NavLink to="" type="button" className="font-medium text-indigo-500" onClick={() => handleEditClick('fullName')}>
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
                        <CiEdit size={25} />
                      </NavLink>
                    </div>
                  </div>
                  <Caption> {accountInfo.email} </Caption>
                </div>

                <div className="">
                  <div className="flex justify-between py-3">
                    <Title>Phone number </Title>
                    <div className="text-center flex items-center gap-3 mt-1">
                      <NavLink to="#" type="button" className="font-medium text-green">
                        <CiCircleCheck size={25} />
                      </NavLink>
                      <NavLink to="" type="button" className="font-medium text-indigo-500">
                        <CiEdit size={25} />
                      </NavLink>
                    </div>
                  </div>
                  <Caption> {accountInfo.phoneNumber} </Caption>
                </div>
              </div>
            </div>
            <div className="flex justify-between border-b py-3">
              <Title>Personal Info</Title>
              <div className="w-1/2">
                <div className="">
                  <div className="flex justify-between py-3">
                    <Title>Address </Title>
                    <div className="text-center flex items-center gap-3 mt-1">
                      <NavLink to="" type="button" className="font-medium text-indigo-500">
                        <CiEdit size={25} />
                      </NavLink>
                    </div>
                  </div>
                  <Caption> {`${accountInfo?.streetAddress || ""}, ${accountInfo?.city || ""}, ${
                    accountInfo?.country || ""
                  }`}{" "}
                  </Caption>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};