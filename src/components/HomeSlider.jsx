import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { useNavigate } from "react-router";
import { formatPrice } from "../utils/helpers";

function HomeSlider({listings}) {
  const navigate = useNavigate();

  return (
    <div>
      <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000 }}
        >
          {listings && listings.map(({data, id}) => (
            <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.listingType}/${id}`)}>
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
              <p className="bg-sky-700 text-slate-50 absolute left-1 top-3 font-medium max-w-[90%] p-2 rounded-br-3xl shadow-lg opacity-90">{data.listingTitle}</p>
              <p className="bg-red-500 text-slate-50 absolute left-1 bottom-1 font-semibold max-w-[90%] p-2 rounded-tr-3xl shadow-lg opacity-90">${data.offer ? formatPrice(data.discountedPrice) : formatPrice(data.regularPrice)}{data.listingType === "rent" && "/ month"}</p>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  )
}

export default HomeSlider
