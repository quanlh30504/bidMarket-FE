import { useNavigate } from 'react-router-dom';
import { useWarning } from '../../../router';
import { DeleteWarning } from './DeleteWarning';
import ProductService from '../../../services/productService';
import AuctionService from '../../../services/auctionService';

// FOR SELLER
export const ActionButton = ({ type, item }) => {
    const { showWarning } = useWarning();
    const navigate = useNavigate();
    //type: Reopen, Edit, Delete
    return (
      <>
        {/* RE-OPEN */}
        {type === AuctionButtonTypes.REOPEN && (
          <button className="mt-1 px-2 py-1 bg-white text-black border rounded-full inline-block w-[100px]"
          onClick={() => {
            showWarning(
              <div className="text-center text-xl mb-4">
                <p className="text-gray-700 ">Are you sure you want to reopen this auction?</p>
                <p className="text-green text-center">{item.auction}</p>
                <p className="text-gray-700">ID: <span className="font-medium">{item.hidden_id}</span></p>
              </div>,
              async () => {
                try {
                  await AuctionService.reOpenAuction(item.hidden_id);
                  window.alert('Auction reopened successfully');
                } catch (error) {
                  console.error('Error reopening auction:', error);
                }
              });
           }}
          >
            Reopen
          </button>
        )}
  
        {/* EDIT */}
        {type === AuctionButtonTypes.EDIT && (
          <button className="px-1"
          onClick={() => {
            if (item.product) {
              navigate(`/seller-hub/edit-product/${item.hidden_id}`);
            }
            if (item.auction) {
              navigate(`/seller-hub/edit-auction/${item.hidden_id}`);
            }
            console.log('no function');
          }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </button>
        )}
  
        {/* DELETE */}
        {type === AuctionButtonTypes.DELETE && (
          <button className="px-1"
          onClick={() => {
            if (item.product) {
              showWarning(
                <DeleteWarning item={item} type="product" />,
                async () => {
                  try {
                    await ProductService.deleteProduct(item.hidden_id);
                    window.alert('Product deleted successfully');
                  } catch (error) {
                    console.error('Error deleting product:', error);
                  }
                });
            }
            if (item.auction) {
              showWarning(
                <DeleteWarning item={item} type="auction" />,
                async () => {
                  try {
                    await AuctionService.deleteAuction(item.hidden_id);
                    window.alert('Auction deleted successfully');
                  } catch (error) {
                    console.error('Error deleting auction:', error);
                  }
                });
            }
          }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 12V17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 7H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </button>
        )}

        {/* CREATE AUCTION FROM PRODUCT */}
        {type === AuctionButtonTypes.CREATE_AUCTION && (
          <button className="px-1"
          title="Create new auction with this product"
          onClick={() => {
            navigate(`/seller-hub/create-auction/${item.hidden_id}`); //??
          }}
          >
            <svg
              version="1.1"
              id="Uploaded_to_svgrepo.com"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
              xmlSpace="preserve"
              fill="none"
              width="24"
              height="24"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <style type="text/css">{`.bentblocks_een{fill:#0B1719;}`}</style>
                <path
                  className="bentblocks_een"
                  d="M24,15v2h-7v7h-2v-7H8v-2h7V8h2v7H24z M24.485,24.485c-4.686,4.686-12.284,4.686-16.971,0 c-4.686-4.686-4.686-12.284,0-16.971c4.687-4.686,12.284-4.686,16.971,0C29.172,12.201,29.172,19.799,24.485,24.485z M23.071,8.929 c-3.842-3.842-10.167-3.975-14.142,0c-3.899,3.899-3.899,10.243,0,14.142c3.975,3.975,10.301,3.841,14.142,0 C26.97,19.172,26.97,12.828,23.071,8.929z"
                ></path>
              </g>
            </svg>
          </button>
        )}
      </>
    );
};


export const AuctionButtonTypes = {
    REOPEN: 'Reopen',
    EDIT: 'Edit',
    DELETE: 'Delete',
    CREATE_AUCTION: 'CreateAuction',
};



// FOR ADMIN
export const ActionButtonAdmin = ({ type, item }) => {
  const { showWarning } = useWarning();
  const navigate = useNavigate();
  //type: Reopen, Edit, Delete
  return (
    <>
      {/* CANCEL AUCTION */}
      {type === AuctionButtonTypesAdmin.CANCEL_AUCTION && (
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
          <svg width={24} height={24} fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path> </g></svg>
        </button>
      )}

      {/* REVIEW AUCTION */}
      {type === AuctionButtonTypesAdmin.REVIEW_AUCTION && (
        <button className="px-1"
        title='Review this auction'
        onClick={() => {
          navigate(`/admin/review-auction/${item.hidden_id}`);
        }}
        >
          <svg width={20} height={20} fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd"> <path fillRule="nonzero" d="M0 53v1813.33h1386.67v-320H1280v213.34H106.667V159.667H1280V373h106.67V53z"></path> <path d="M1226.67 1439.67c113.33 0 217.48-39.28 299.6-104.96l302.37 302.65c20.82 20.84 54.59 20.85 75.42.04 20.84-20.82 20.86-54.59.04-75.43l-302.41-302.68c65.7-82.12 104.98-186.29 104.98-299.623 0-265.097-214.91-480-480-480-265.1 0-480.003 214.903-480.003 480 0 265.093 214.903 480.003 480.003 480.003Zm0-106.67c206.18 0 373.33-167.15 373.33-373.333 0-206.187-167.15-373.334-373.33-373.334-206.19 0-373.337 167.147-373.337 373.334 0 206.183 167.147 373.333 373.337 373.333Z"></path> </g> </g></svg>
        </button>
      )}
    </>
  );
};


export const AuctionButtonTypesAdmin = {
  CANCEL_AUCTION: 'CancelAuction',
  REVIEW_AUCTION: 'ReviewAuction',
};