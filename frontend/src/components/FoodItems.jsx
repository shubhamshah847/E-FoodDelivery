import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverURI } from "../App";
import {setAddToCart} from '../redux/userSlice.js'
import { FiPlus, FiMinus } from "react-icons/fi";

// ================= FOOD CARD =================
function FoodCard({ item }) {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(0);

  const finalPrice =
    item.discount > 0
      ? Math.round(item.price - (item.price * item.discount) / 100)
      : item.price;



  const decreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev <= 1) {
        return 0;
      }

      return prev - 1;
    });
  };

  return (
    <div className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[240px]">

      {/* IMAGE */}
      <div className="relative h-40 overflow-hidden rounded-xl bg-gray-100 sm:h-44">

        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}
        {item.discount > 0 && (
          <div className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
            {item.discount}%
          </div>
        )}

        {/* VEG / NON-VEG */}
        <div className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
          <div className="flex items-center gap-1">

            <span
              className={`h-2 w-2 rounded-full ${
                item.foodType === "veg"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            ></span>

            <span
              className={`text-[9px] font-bold ${
                item.foodType === "veg"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {item.foodType === "veg" ? "VEG" : "NON-VEG"}
            </span>

          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-1 pb-1 pt-3">

        {/* NAME */}
        <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
          {item.name}
        </h3>

        {/* PRICE */}
        <div className="mt-2 flex items-center gap-2">

          <span className="text-base font-bold text-gray-900 sm:text-lg">
            ₹{finalPrice}
          </span>

          {item.discount > 0 && (
            <span className="text-[11px] font-medium text-gray-400 line-through">
              ₹{item.price}
            </span>
          )}

        </div>

        <p className="mt-0.5 text-[9px] text-gray-400">
          Inclusive of all taxes
        </p>

        {/* CART BUTTON */}
        <div className="mt-3 flex justify-end">

          {quantity === 0 ? (

            /* ADD BUTTON */
            <button
              type="button"
              onClick={()=>dispatch(setAddToCart(item))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:scale-105 hover:bg-orange-600 active:scale-90"
            >
              <FiPlus size={20} />
            </button>

          ) : (

            /* QUANTITY CONTROLS */
            <div className="flex items-center gap-2 rounded-full border border-orange-500 bg-white px-1 py-1">
             <p> Add to Cart  </p>
              <button
                type="button"
                onClick={decreaseQuantity}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-200 active:scale-90"
              >
                <FiMinus size={15} />
              </button>

              <span className="min-w-[20px] text-center text-sm font-bold text-gray-800">
                {quantity}
              </span>

              <button
                type="button"
             //   onClick={increaseQuantity}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 active:scale-90"
              >
                <FiPlus size={15} />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


// ================= CATEGORY CAROUSEL =================
function CategoryRow({ categoryName, items }) {

  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  // FILTER ITEMS
  const filteredItems = items.filter((item) => {

    if (activeFilter === "veg") {
      return item.foodType === "veg";
    }

    if (activeFilter === "non-veg") {
      return item.foodType !== "veg";
    }

    return true;
  });


  // CHECK SCROLL
  const checkScroll = () => {

    if (scrollRef.current) {

      const {
        scrollLeft,
        clientWidth,
        scrollWidth,
      } = scrollRef.current;

      setCanScrollLeft(scrollLeft > 2);

      setCanScrollRight(
        scrollLeft + clientWidth < scrollWidth - 2
      );
    }
  };


  // HANDLE SCROLL
  const handleScroll = (direction) => {

    if (scrollRef.current) {

      const { clientWidth } = scrollRef.current;

      const scrollAmount = clientWidth * 0.7;

      scrollRef.current.scrollBy({
        left:
          direction === "left"
            ? -scrollAmount
            : scrollAmount,

        behavior: "smooth",
      });
    }
  };


  useEffect(() => {

    checkScroll();

    window.addEventListener(
      "resize",
      checkScroll
    );

    return () => {
      window.removeEventListener(
        "resize",
        checkScroll
      );
    };

  }, [filteredItems]);


  if (filteredItems.length === 0) {
    return null;
  }


  return (
    <div className="mb-10 w-full">

      {/* CATEGORY HEADER */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-xl font-bold capitalize text-gray-900 sm:text-2xl">
            {categoryName}
          </h2>

          <p className="text-xs text-gray-500 sm:text-sm">
            Top rated {categoryName} items near you
          </p>

        </div>


        {/* FILTERS */}
        <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1 self-start sm:self-auto">

          {/* ALL */}
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All ({items.length})
          </button>


          {/* VEG */}
          <button
            onClick={() => setActiveFilter("veg")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeFilter === "veg"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-green-600"></span>
            Veg
          </button>


          {/* NON VEG */}
          <button
            onClick={() => setActiveFilter("non-veg")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeFilter === "non-veg"
                ? "bg-white text-red-700 shadow-sm"
                : "text-gray-500 hover:text-red-700"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            Non-Veg
          </button>

        </div>

      </div>


      {/* CAROUSEL */}
      <div className="group/wrapper relative">

        {/* LEFT ARROW */}
        <button
          onClick={() => handleScroll("left")}
          aria-label="Scroll Left"
          className={`absolute -left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 ${
            canScrollLeft
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>


        {/* ITEMS */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex w-full gap-4 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >

          {filteredItems.map((item) => (
            <FoodCard
              key={item._id}
              item={item}
            />
          ))}

        </div>


        {/* RIGHT ARROW */}
        <button
          onClick={() => handleScroll("right")}
          aria-label="Scroll Right"
          className={`absolute -right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 ${
            canScrollRight
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

      </div>

    </div>
  );
}


// ================= MAIN FOOD ITEMS =================
function FoodItems() {

  const [groupedItems, setGroupedItems] = useState({});
  const [loading, setLoading] = useState(true);


  // GET ALL ITEMS
  const getItems = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        serverURI + "/api/get-all-items",
        {
          withCredentials: true,
        }
      );

      const fetchedItems =
        response.data.items || [];


      // GROUP BY CATEGORY
      const grouped = fetchedItems.reduce(
        (acc, item) => {

          const cat =
            item.category ||
            "Uncategorized";

          if (!acc[cat]) {
            acc[cat] = [];
          }

          acc[cat].push(item);

          return acc;

        },
        {}
      );


      setGroupedItems(grouped);

    } catch (error) {

      console.log(
        "Get items error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    getItems();
  }, []);


  // LOADING
  if (loading) {

    return (
      <div className="space-y-8">

        {[1, 2].map((section) => (

          <div
            key={section}
            className="space-y-4"
          >

            <div className="h-6 w-40 rounded bg-gray-200 animate-pulse"></div>

            <div className="flex gap-4 overflow-hidden py-2">

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className="w-[200px] shrink-0 animate-pulse rounded-2xl border border-gray-100 bg-white p-2 sm:w-[240px]"
                >

                  <div className="h-40 rounded-xl bg-gray-200 sm:h-44"></div>

                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200"></div>

                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>

                  <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>
    );
  }


  const categories =
    Object.keys(groupedItems);


  // NO ITEMS
  if (categories.length === 0) {

    return (
      <div className="flex min-h-[300px] items-center justify-center">

        <div className="text-center">

          <div className="text-5xl">
            🍽️
          </div>

          <h2 className="mt-3 text-lg font-bold text-gray-800">
            No food items available
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Food items will appear here when shops add them.
          </p>

        </div>

      </div>
    );
  }


  // MAIN
  return (
    <div className="w-full">

      {categories.map((category) => (

        <CategoryRow
          key={category}
          categoryName={category}
          items={groupedItems[category]}
        />

      ))}

    </div>
  );
}


export default FoodItems;