import PropTypes from "prop-types";
import { Title } from "../common/Design";

export const CategoryCard = ({ item }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/search?categoryType=${encodeURIComponent(item.value)}&status=OPEN`
  };
  return (
    <>
      <div className="w-52 h-56 flex items-center flex-col gap-2 py-8 rounded-lg bg-green_1000 shadow-s1" onClick={handleSearch}>
        <div className="w-full h-32 flex justify-center items-center">
          <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
        </div>
        <Title className="uppercase text-center">{item.title}</Title>
      </div>
    </>
  );
};

CategoryCard.propTypes = {
  item: PropTypes.any,
};
