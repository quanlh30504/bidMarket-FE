
// import { useRef } from "react";
// import { Title } from "../../router";

// export const RelatedAuctions = ({ relatedAuctions }) => {
//     const relatedListRef = useRef(null);
  
//     return (
//       <div className="mt-8">
//         <Title level={3} className="mb-2">Related Auctions</Title>
//         <div className="relative">
//           <button
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
//             onClick={() => {
//               relatedListRef.current.scrollBy({
//                 left: -100,
//                 behavior: "smooth",
//               });
//             }}
//           >
//             &lt;
//           </button>
  
//           <div
//             ref={relatedListRef}
//             className="flex overflow-x-auto gap-4 p-2"
//             style={{ scrollBehavior: "smooth" }}
//           >
//             {relatedAuctions && relatedAuctions.length > 0 ? (
//               relatedAuctions.map((auctionDetail, index) => {
        
//                 const statusStyles = {
//                   PENDING: "text-gray-700 bg-yellow-400",
//                   READY: "text-blue-700 bg-blue-200",
//                   OPEN: "text-white bg-green",
//                   CLOSED: "text-gray-700 bg-gray-200",
//                   CANCELED: "text-red-700 bg-red-200",
//                   COMPLETED: "text-blue-500 bg-slate-200",
//                   EXTENDED: "text-orange-700 bg-orange-200",
//                 };
  
//                 const statusClass =
//                   statusStyles[auctionDetail?.status] || "text-black bg-white";
  
//                 return (
//                   <div
//                     key={index}
//                     className="min-w-[200px] bg-white p-3 rounded-lg shadow-md flex-shrink-0"
//                   >
//                     <div className="relative">
//                       <img
//                         src={
//                           auctionDetail?.productDto?.productImages?.find((img) => img.isPrimary)?.imageUrl ||
//                           auctionDetail?.productDto?.productImages?.[0]?.imageUrl
//                         }
//                         alt={auctionDetail?.productDto?.name || "Auction Image"}
//                         className="w-full h-40 object-cover rounded-md"
//                       />
          
//                       <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth="1.5"
//                           stroke="currentColor"
//                           className="w-5 h-5 text-gray-600"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
//                           />
//                         </svg>
//                       </button>
//                     </div>
  
                    
//                     <h5 className="text-sm font-medium mt-2 line-clamp-2">
//                       {auctionDetail?.title || "Unnamed Auction"}
//                     </h5>
  
                    
//                     <p
//                       className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${statusClass}`}
//                     >
//                       {auctionDetail?.status || "Pre-owned"}
//                     </p>
  
                    
//                     <p className="text-lg font-bold text-gray-800">
//                       US {auctionDetail?.currentPrice?.toLocaleString()}$
//                     </p>
  
                    
//                     <p className="text-xs text-gray-500">{auctionDetail?.bidCount || 0} bids</p>
  
                    
//                     <p className="text-sm text-red-500 font-semibold">
//                       {auctionDetail?.endTime
//                         ? new Date(auctionDetail?.endTime).toLocaleString()
//                         : "1d 19h"}
//                     </p>
  
                    
//                     <button
//                       className="w-full bg-green text-white py-2 mt-2 text-sm rounded-lg hover:bg-green-dark transition"
//                       onClick={() => {
//                         window.location.href = `/details/${auctionDetail?.id}`;
//                       }}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className="text-gray-500">No related auctions available.</p>
//             )}
  
//           </div>
  
//           <button
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
//             onClick={() => {
//               relatedListRef.current.scrollBy({
//                 left: 200,
//                 behavior: "smooth",
//               });
//             }}
//           >
//             &gt;
//           </button>
//         </div>
//       </div>
//     );
//   };
import { useRef, useState, useEffect } from "react";
import { Title } from "../../router";

export const RelatedAuctions = ({ relatedAuctions }) => {
  const relatedListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  useEffect(() => {
    const updateDots = () => {
      if (relatedListRef.current) {
        const container = relatedListRef.current;
        const visibleWidth = container.offsetWidth;
        const scrollWidth = container.scrollWidth;
        setTotalDots(Math.ceil(scrollWidth / visibleWidth));
      }
    };
    updateDots();
    window.addEventListener("resize", updateDots);
    return () => window.removeEventListener("resize", updateDots);
  }, [relatedAuctions]);

  const handleScroll = (direction) => {
    if (relatedListRef.current) {
      const container = relatedListRef.current;
      const visibleWidth = container.offsetWidth;
      const newIndex = Math.max(
        0,
        Math.min(totalDots - 1, currentIndex + direction)
      );
      setCurrentIndex(newIndex);
      container.scrollTo({
        left: newIndex * visibleWidth,
        behavior: "smooth",
      });
    }
  };

  const handleDotClick = (index) => {
    if (relatedListRef.current) {
      const container = relatedListRef.current;
      const visibleWidth = container.offsetWidth;
      setCurrentIndex(index);
      container.scrollTo({
        left: index * visibleWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8">
      <Title level={3} className="mb-2">
        Related Auctions
      </Title>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
          onClick={() => handleScroll(-1)}
        >
          &lt;
        </button>

        <div
          ref={relatedListRef}
          className="flex overflow-x-hidden gap-4 p-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {relatedAuctions && relatedAuctions.length > 0 ? (
            relatedAuctions.map((auctionDetail, index) => {
              const statusStyles = {
                PENDING: "text-gray-700 bg-yellow-400",
                READY: "text-blue-700 bg-blue-200",
                OPEN: "text-white bg-green",
                CLOSED: "text-gray-700 bg-gray-200",
                CANCELED: "text-red-700 bg-red-200",
                COMPLETED: "text-blue-500 bg-slate-200",
                EXTENDED: "text-orange-700 bg-orange-200",
              };

              const statusClass =
                statusStyles[auctionDetail?.status] || "text-black bg-white";

              return (
                <div
                  key={index}
                  className="min-w-[200px] bg-white p-3 rounded-lg shadow-md flex-shrink-0"
                >
                  <div className="relative">
                    <img
                      src={
                        auctionDetail?.productDto?.productImages?.find(
                          (img) => img.isPrimary
                        )?.imageUrl ||
                        auctionDetail?.productDto?.productImages?.[0]?.imageUrl
                      }
                      alt={auctionDetail?.productDto?.name || "Auction Image"}
                      className="w-full h-40 object-cover rounded-md"
                    />

                    <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                      </svg>
                    </button>
                  </div>

                  <h5 className="text-sm font-medium mt-2 line-clamp-2">
                    {auctionDetail?.title || "Unnamed Auction"}
                  </h5>

                  <p
                    className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${statusClass}`}
                  >
                    {auctionDetail?.status || "Pre-owned"}
                  </p>

                  <p className="text-lg font-bold text-gray-800">
                    US {auctionDetail?.currentPrice?.toLocaleString()}$
                  </p>

                  <p className="text-xs text-gray-500">
                    {auctionDetail?.bidCount || 0} bids
                  </p>

                  <p className="text-sm text-red-500 font-semibold">
                    {auctionDetail?.endTime
                      ? new Date(auctionDetail?.endTime).toLocaleString()
                      : "1d 19h"}
                  </p>

                  <button
                    className="w-full bg-green text-white py-2 mt-2 text-sm rounded-lg hover:bg-green-dark transition"
                    onClick={() => {
                      window.location.href = `/details/${auctionDetail?.id}`;
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No related auctions available.</p>
          )}
        </div>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
          onClick={() => handleScroll(1)}
        >
          &gt;
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalDots }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentIndex
                ? "bg-blue-500"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
