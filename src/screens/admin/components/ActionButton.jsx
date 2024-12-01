import { useNavigate } from 'react-router-dom';
import { useWarning } from '../../../router';
import AuctionService from '../../../services/auctionService';

export const ActionButton = ({ type, item }) => {
    const { showWarning } = useWarning();
    const navigate = useNavigate();
    //type: Reopen, Edit, Delete
    return (
      <>
        {/* CANCEL AUCTION */}
        {type === AuctionButtonTypes.CANCEL_AUCTION && (
          <button className="px-1"
          title='Cancel this auction'
          onClick={() => {
            showWarning(
              <div className="text-center text-xl mb-4">
                <p className="text-gray-700">Are you sure you want to cancel this auction?</p>
                <p className="text-green text-center">{item.auction}</p>
                <p className="text-gray-700">ID: <span className="font-medium">{item.hidden_id}</span></p>
              </div>,
              async () => {
                try {
                  await AuctionService.cancelAuction(item.hidden_id);
                  window.alert('Auction canceled successfully');
                } catch (error) {
                  console.error('Error canceling auction:', error);
                }
              });
          }}
          >
            <svg width={24} height={24} fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel</title> <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path> </g></svg>
          </button>
        )}

        {/* REVIEW AUCTION */}
        {type === AuctionButtonTypes.REVIEW_AUCTION && (
          <button className="px-1"
          title='Review this auction'
          onClick={() => {
            navigate(`/admin/review-auction/${item.hidden_id}`);
          }}
          >
            <svg width={20} height={20} fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill-rule="evenodd"> <path fill-rule="nonzero" d="M0 53v1813.33h1386.67v-320H1280v213.34H106.667V159.667H1280V373h106.67V53z"></path> <path d="M1226.67 1439.67c113.33 0 217.48-39.28 299.6-104.96l302.37 302.65c20.82 20.84 54.59 20.85 75.42.04 20.84-20.82 20.86-54.59.04-75.43l-302.41-302.68c65.7-82.12 104.98-186.29 104.98-299.623 0-265.097-214.91-480-480-480-265.1 0-480.003 214.903-480.003 480 0 265.093 214.903 480.003 480.003 480.003Zm0-106.67c206.18 0 373.33-167.15 373.33-373.333 0-206.187-167.15-373.334-373.33-373.334-206.19 0-373.337 167.147-373.337 373.334 0 206.183 167.147 373.333 373.337 373.333Z"></path> </g> </g></svg>
          </button>
        )}
      </>
    );
};


export const AuctionButtonTypes = {
    CANCEL_AUCTION: 'CancelAuction',
    REVIEW_AUCTION: 'ReviewAuction',
};