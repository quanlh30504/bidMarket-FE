import { Caption, Title } from "../../router";
import { NavLink } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { useState, useRef, useEffect } from 'react';
import axiosClient from "../../services/axiosClient";
import { useParams, useNavigate } from 'react-router-dom';
import { authUtils } from '../../utils/authUtils';




export const Account = () => {
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/128/6997/6997662.png");
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const { userId } = authUtils.getCurrentUserId();

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await axiosClient.get(`/api/users/${userId}/accountInfo`);
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  }
  
)
  

  return (
    <>
      <div className="description-tab shadow-s3 p-8 rounded-md">
        <Title level={4}>Account</Title>
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
              <div className="flex justify-between py-3 w-1/2">
                <Caption>User</Caption>
                <NavLink to="" type="button" className="font-medium text-indigo-500">
                  <CiEdit size={25} />
                </NavLink>
              </div>
            </div>
            <div className="flex justify-between border-b py-3">
              <div className="w-1/2">
                <Title>Account type</Title>
              </div>
              <div className="flex justify-between py-3 w-1/2">
                <Caption>Individual</Caption>
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
                  <Caption> example@gmail.com </Caption>
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
                  <Caption> 0123456789 </Caption>
                </div>
              </div>
            </div>
            <div className="flex justify-between border-b py-3">
              <Title>Personal Info</Title>
              <div className="w-1/2">
                <div className="">
                  <div className="flex justify-between py-3">
                    <Title>Owner name </Title>
                    <div className="text-center flex items-center gap-3 mt-1">
                      <NavLink to="" type="button" className="font-medium text-indigo-500">
                        <CiEdit size={25} />
                      </NavLink>
                    </div>
                  </div>
                  <Caption> Name </Caption>
                </div>

                <div className="">
                  <div className="flex justify-between py-3">
                    <Title> Address </Title>
                  </div>
                  <Caption> Hanoi, Vietnam </Caption>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};