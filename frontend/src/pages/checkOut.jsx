import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaMoneyBillWave } from "react-icons/fa";

import {
  IoSearch,
  IoLocationOutline,
} from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import "leaflet/dist/leaflet.css";

import {
  setAddress,
  setLocation,
} from "../redux/mapSlice";
import { serverURI } from "../App";
import OrderSucess from "../components/orderSuccessfully";
import Payment from "../components/payment/Payment";
import { setCart } from "../redux/userSlice";


function ReCenterMap({ location }) {
  const map = useMap();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (
      !location ||
      location.lat === undefined ||
      location.long === undefined
    ) {
      return;
    }

    map.setView(
      [location.lat, location.long],
      16,
      {
        animate: true,
      }
    );

    const mapLocation = async () => {
      try {
        const { lat, long } = location;

        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${import.meta.env.VITE_LOCATION_API}`
        );

        const city =
          response?.data?.results?.[0]?.address_line2 || "";

        dispatch(setAddress(city));

      } catch (err) {
        console.log(
          "Unable to get location:",
          err.message
        );
      }
    };

    mapLocation();

  }, [location, map, dispatch]);

  return null;
}


function CheckOut() {


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showMessage,setShowMessage]=useState(false)
  const [showError,setShowError]= useState(false)
  const [order , setOrder] = useState(null)
  const [showPayment, setshowPayment] = useState(false)
  const [showOrderSuccess,setshowOrderSuccess] = useState(false)
  const { shopData } = useSelector(state => state.user);
  const [closeOrderSuccess,setCloseOrderSuccess] = useState(false)
  const {cart} = useSelector((state) => state.user);

  const totalAmount = cart.reduce(
    (total, item) =>
      total + Number(item.price) * (item.quantity || 1),
    0
  );
  const delivery = totalAmount > 1000 ? 50 : 10

  // Discount calculation from environment variable
  const discountPercent = Number(import.meta.env.VITE_DISCOUNT_PERCENT) || 0;
  const grossTotal = totalAmount + delivery;
  const discountAmount = discountPercent > 0 ? (grossTotal * discountPercent) / 100 : 0;
  const finalTotal = Math.max(0, grossTotal - discountAmount);

  const { location, address } = useSelector(
    (state) => state.map
  );
  
  const [paymentMethod, setPaymentMethod] =
    useState("cod");
  const handleDragEnd = (e) => {

    const marker = e.target;
    const position = marker.getLatLng();

    const lat = position.lat;
    const long = position.lng;

    dispatch(
      setLocation({
        lat,
        long,
      })
    );
  };
  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lat =
          position.coords.latitude;

        const long =
          position.coords.longitude;

        dispatch(
          setLocation({
            lat,
            long,
          })
        );
      },

      (error) => {
        console.log(error);

        alert(
          "Unable to get your current location. Please allow location access."
        );
      }
    );
  };


  if (
    !location ||
    location.lat === undefined ||
    location.long === undefined
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading location...
        </p>
      </div>
    );
  }

 const createOrderRequest = async (selectedPaymentMethod) => {
  if (!cart || cart.length === 0) {
    console.log("Cart is empty");
    return;
  }

  const shopOrder = [];

  for (const item of cart) {
    let existingShop = shopOrder.find(
      shopData => shopData.shop === item.shop
    );

    if (!existingShop) {
      existingShop = {
        shop: item.shop,
        items: []
      };

      shopOrder.push(existingShop);
    }

    existingShop.items.push({
      item: item._id,
      quantity: item.quantity
    });
  }

  const finalAddress = (address || "").trim() || "Delivery location not provided";

  const orderPlace = await axios.post(
    serverURI + "/user/order",
    {
      payment: selectedPaymentMethod,
      deliveryAddress: finalAddress,
      shopOrder: shopOrder
    },
    {
      withCredentials: true
    }
  );

  const createdOrder = orderPlace.data.order;
  dispatch(setCart([]));
  setOrder(createdOrder);
  setShowError(false);
  setShowMessage(true);
  return createdOrder;
};

 const handleOrder = async () => {
  if (!cart || cart.length === 0) {
    console.log("Cart is empty");
    return;
  }

  try {
    setLoading(true);

    if (paymentMethod === "online") {
      setshowPayment(true);
      return;
    }

    const createdOrder = await createOrderRequest(paymentMethod);
    if (createdOrder) {
      setshowOrderSuccess(true);
    }

  } catch (err) {
    console.log("ORDER ERROR:", err);
    setShowError(true)

  } finally {
    setShowMessage(false)
    setLoading(false);
  }
};

 const handleOnlinePaymentSuccess = async () => {
  try {
    const createdOrder = await createOrderRequest("online");
    if (createdOrder) {
      setshowOrderSuccess(true);
    }
  } catch (err) {
    console.log("ONLINE PAYMENT ORDER ERROR:", err);
    setShowError(true)
  } finally {
    setLoading(false);
    setShowMessage(false);
  }
};
if (showOrderSuccess && order) {
  return (
    <OrderSucess
      order={order}
      onClose={() => {
        setshowOrderSuccess(false);
      }}
    />
  );
}
if (showPayment) {
  const paymentSummary = {
    subtotal: totalAmount,
    deliveryFee: delivery,
    taxes: Math.max(0, finalTotal - totalAmount - delivery),
    totalAmount: finalTotal
  };

  return <Payment 
    onClose={()=>setshowPayment(false)}
    onPaymentSuccess={handleOnlinePaymentSuccess}
    checkoutSummary={paymentSummary}
  />
}


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">

      {/* Back Button */}
      <button
        onClick={() => navigate("/cart")}
        className="mb-6 flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
      >
        <IoMdArrowRoundBack className="text-red-500" size={24} />

        <span className="font-medium">
          Back
        </span>
      </button>


      {/* Checkout Card */}
      <section className="mx-auto w-full max-w-2xl">

        <div className="rounded-2xl bg-white p-6 shadow-lg">

          {/* Checkout Heading */}
          <h2 className="mb-6 text-2xl font-bold text-red-600">
            Checkout
          </h2>


          {/* ================= DELIVERY LOCATION ================= */}

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Delivery Location
          </h2>


          {/* Search Location */}
          <div className="relative mb-4">

            <IoSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={22}
            />

            <input
              type="text"
              value={address || ""}
              onChange={(e) =>
                dispatch(setAddress(e.target.value))
              }
              placeholder="Search for your delivery location"
              className="h-12 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Current Location */}
          <button
            onClick={handleCurrentLocation}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 font-semibold text-white transition hover:bg-blue-600"
          >
            <IoLocationOutline size={22} />

            Use Current Location
          </button>


          {/* Map */}
          <div className="mt-4 h-64 w-full overflow-hidden rounded-xl">

            <MapContainer
              className="h-full w-full"
              center={[
                location.lat,
                location.long,
              ]}
              zoom={16}
              scrollWheelZoom={true}
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                draggable={true}
                position={[
                  location.lat,
                  location.long,
                ]}
                eventHandlers={{
                  dragend: handleDragEnd,
                }}
              >

                <Popup>
                  Delivery Location
                </Popup>

              </Marker>


              <ReCenterMap
                location={location}
              />

            </MapContainer>

          </div>


          {/* Confirm Location */}
          <button
            className="mt-4 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Confirm Location
          </button>


          {/* Divider */}
          <div className="my-7 border-t border-gray-200"></div>


          {/* ================= PAYMENT METHOD ================= */}

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Payment Method
          </h2>


          <div className="space-y-3">

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition
              ${paymentMethod === "cod"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
                }`}
            >

              <div className="flex items-center gap-3">

                <FaMoneyBillWave
                  className="text-green-600"
                  size={22}
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>

              </div>


              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() =>
                  setPaymentMethod("cod")
                }
                className="h-5 w-5 accent-blue-500"
              />

            </div>


            {/* Online Payment */}
            <div
              onClick={() => setPaymentMethod("online")}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition
              ${paymentMethod === "online"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
                }`}
            >

              <div className="flex items-center gap-3">

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                  ₹
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Online Payment
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay securely online
                  </p>
                </div>

              </div>


              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() =>
                  setPaymentMethod("online")
                }
                className="h-5 w-5 accent-blue-500"
              />

            </div>

          </div>


          {/* Divider */}
          <div className="my-7 border-t border-gray-200"></div>


          {/* ================= ORDER SUMMARY ================= */}

          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            {/* Cart Items List */}
            <div className="mb-6 max-h-48 overflow-y-auto space-y-3 pr-2">
              {cart.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="text-gray-400">x{item.quantity || 1}</span>
                  </div>
                  <span className="text-gray-600 font-medium">
                    ₹{Number(item.price) * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>


              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{delivery}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({discountPercent}% OFF)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}


              <div className="border-t pt-4">

                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>

                  <div className="flex items-center gap-2">
                    {discountPercent > 0 && (
                      <span className="text-sm font-normal text-gray-400 line-through">
                        ₹{grossTotal}
                      </span>
                    )}
                    <span>
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

{showError && (
  <div className="mb-5 flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white">
      !
    </div>

    <div>
      <h2 className="font-bold text-red-700">
       Order failed!!
      </h2>

      <p className="mt-1 text-sm text-red-600">
        Try again
      </p>
    </div>
  </div>
)}
          {/* ================= PLACE ORDER ================= */}
       
          <button
            onClick={handleOrder
                     
            }
            disabled={loading}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-red-500 text-lg font-bold text-white shadow-md transition hover:bg-red-600 hover:shadow-lg active:scale-[0.98]"
          >
            {loading
              ? "Creating..."
              : paymentMethod === "cod"
                ? `Place Order • ₹${finalTotal.toFixed(2)}`
                : `Pay ₹${finalTotal.toFixed(2)} & Place Order`}
          </button>
          {showMessage && (
  <div className="mb-6 flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
    
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
      ✓
    </div>

  </div>
)}

        </div>

      </section>

    </div>
  );

 }

export default CheckOut;