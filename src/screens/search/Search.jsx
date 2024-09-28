import { Container} from "../../router";
import { productlists } from "../../utils/data";
import { ProductCard } from "../../components/cards/ProductCard";

export const SearchList = () => {
  return (
    <>
        <div className="mt-32">
       <section className="product-home">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {/* Cột filter bên trái */}
            <div className="md:col-span-1">
              <div className="p-4 shadow-md bg-white rounded-lg">
                {/* Nội dung bộ lọc */}
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div>
                  {/* Thêm các input hoặc checkbox tùy chỉnh cho bộ lọc */}
                  <label className="block mb-2">
                    <input type="checkbox" className="mr-2" />
                    Filter 1
                  </label>
                  <label className="block mb-2">
                    <input type="checkbox" className="mr-2" />
                    Filter 2
                  </label>
                  <label className="block mb-2">
                    <input type="checkbox" className="mr-2" />
                    Filter 3
                  </label>
                </div>
              </div>
            </div>

            {/* Cột chứa danh sách sản phẩm */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {productlists?.slice(0, 12)?.map((item, index) => (
                  <ProductCard item={item} key={index + 1} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </>
  );
};
