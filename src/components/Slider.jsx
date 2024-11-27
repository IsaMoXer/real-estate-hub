import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

function Slider({listing}) {
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  function copyLink(){
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(()=>{
      setShareLinkCopied(false);
    }, 2000);
  }

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
          {listing && listing.imgUrls && listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div onClick={copyLink} className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center">
          <FaShare className="text-lg text-slate-700" />
        </div>
        {shareLinkCopied && <p className="fixed top-[23%] right-[5%] text-sm font-semibold border-2 border-gray-400 rounded-md bg-white px-2 text-slate-600 z-10">Link Copied</p>}
    </div>
  )
}

export default Slider
