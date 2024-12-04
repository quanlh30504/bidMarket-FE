import { User2 } from "../../components/hero/Hero";
import { Title } from "../../router";
import axiosClient from "../../services/axiosClient";
import { commonClassNameOfInput } from "../../components/common/Design"; 
import WebSocketService from "../../services/WebSocketService";
import { useState, useEffect } from "react";
import { authUtils } from "../../utils/authUtils";
import { PrimaryButton } from "../../components/common/Design";
import { formatTime } from "../../utils/DateFormatter"; 
import { ProfileCard } from "../../components/common/Design";
import { FaEllipsisH } from "react-icons/fa";
import { Pagination } from "../../router";
import { Caption } from "../../components/common/Design";
import { FaStar } from "react-icons/fa";

export const Comments = ({ auctionId, userId, setShowLoginModal, comments, setComments }) => {
    const [newComment, setNewComment] = useState('');
    const [showOptions, setShowOptions] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
  
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10; // Số lượng item mỗi trang
    const pagesPerGroup = 5; // Số lượng trang mỗi nhóm
  
  
    const getAllComments = async (page) => {
      axiosClient
        .get(`/api/comments/auction/${auctionId}`, {
          params: {
            page: page - 1, // API nhận page từ 0
            size: itemsPerPage,
            sortField: "createdAt",
            direction: "DESC",
          },
        })
        .then((response) => {
          setComments(response.data.content);
          setTotalItems(response.data.totalElements)
        })
        .catch((err) => console.error('Error fetching comments:', err));
    }
  
    useEffect(() => {
  
      getAllComments(1);
    }, [auctionId]);
  
    const handleNewComment = () => {
      if (!authUtils.isAuthenticated()) {
        setShowLoginModal(true);
        return;
      }
      if (!newComment.trim()) return;
  
      axiosClient
        .post('/api/comments', { userId: userId, auctionId: auctionId, content: newComment })
        .then(() => {
          setNewComment('');
        })
        .catch((err) => console.error('Error posting comment:', err));
    };
  
    const handleDeleteComment = (commentId) => {
      axiosClient
        .delete(`/api/comments/${commentId}`)
        .then(() => {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        })
        .catch((err) => console.error('Error deleting comment:', err));
    };
  
    const handleEdit = (commentId, currentContent) => {
      setShowOptions(false)
      setEditingCommentId(commentId);
      setEditedContent(currentContent); // Điền nội dung hiện tại vào textarea
    };
  
    const handleCancelEdit = () => {
      setEditingCommentId(null);
      setEditedContent('');
    };
  
    const handleSaveEdit = (commentId) => {
      if (!editedContent.trim()) return;
  
      axiosClient
        .put(`/api/comments/${commentId}`, { content: editedContent })
        .then(() => {
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId ? { ...c, content: editedContent } : c
            )
          );
          setEditingCommentId(null); // Kết thúc chỉnh sửa
          setEditedContent('');
        })
        .catch((err) => console.error('Error updating comment:', err));
    };
  
    const handleToggleOptions = (commentId) => {
      setShowOptions(showOptions === commentId ? null : commentId); // Toggle visibility
    };
  
    return (
      <div className="reviews-tab shadow-s3 p-8 rounded-md">
        <div className="flex items-center gap-5">
          <Title level={4}>Comments ({totalItems})</Title>
        </div>
        <hr className="my-5" />
        <div className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl">
          <div>
            <Title level={6} className="font-semibold text-left mb-5">Your comment</Title>
            <textarea name="description" className={`${commonClassNameOfInput}`} cols="30" rows="5" value={newComment}
              onChange={(e) => setNewComment(e.target.value)}></textarea>
            <PrimaryButton
              type="button"
              className="rounded-none my-5 flex items-center justify-center"
              onClick={handleNewComment}
            >
              SEND
            </PrimaryButton>
          </div>
        </div>
  
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="shadow-s3 border p-8 mb-5 gap-5 flex-col rounded-xl"
          >
            <div className="flex items-center">
              <ProfileCard>
                <img src={User2} alt={User2} />
              </ProfileCard>
              <Title level={6} className="font-normal p-3">{comment.userEmail}</Title>
  
              {comment.userId === userId && (
                <div className="relative ml-auto">
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => handleToggleOptions(comment.id)} // Toggle options when clicked
                  >
                    <FaEllipsisH />
                  </button>
  
                  {showOptions === comment.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                      <button
                        onClick={() => handleEdit(comment.id, comment.content)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 ml-12 ps-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={i < comment.rating ? 'text-yellow-300' : 'text-gray-300'}
                  />
                ))}
              </div>
              <div className="text-gray-500">{comment.updatedAt && comment.createdAt !== comment.updatedAt ? `Updated at: ${formatTime(comment.updatedAt)}` : formatTime(comment.createdAt)}</div>
            </div>
            <div className="ml-12 ps-3">
              {editingCommentId === comment.id ? (
                // Hiển thị textarea khi chỉnh sửa
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full p-2 border rounded"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      className="bg-green text-white px-4 py-2 rounded"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (<Caption className="leading-7">{comment.content}</Caption>)}
  
            </div>
  
          </div>
        ))}
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          pagesPerGroup={pagesPerGroup}
          onPageChange={getAllComments}
          className="mt-4"
          buttonClassName="bg-blue-500 text-white hover:bg-blue-700"
        />
      </div>
    );
  };
  