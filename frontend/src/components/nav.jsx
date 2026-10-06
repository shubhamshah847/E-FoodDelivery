import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {
  FiShoppingCart,
  FiPackage,
  FiSearch,
  FiMapPin,
  FiLogOut,
  FiChevronDown,
  FiX,
  FiPlus,

} from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";


import { useDispatch, useSelector } from "react-redux";
import { setuserData, setShopData } from "../redux/userSlice";
import { serverURI } from "../App";
import FoodItems from "./FoodItems";
import { Navigate, useNavigate } from "react-router-dom";
import GetMyOrders from "./getUserOrders";
import GetOwnerOrder from "./getOnwnerOrders";

function Nav() {

  // ================= REDUX =================
  const { userData, city: userCity, shopData } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.user)

  // ================= USER =================

  const user = userData?.user;

  const isOwner = user?.isOwner === true;

  const username = user?.name || "User";

  const userLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";


  // ================= NAV STATES =================

  const [profileOpen, setProfileOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);


  // ================= CREATE SHOP STATES =================

  const [showCreateShop, setshowCreateShop] =
    useState(false);
  const [showAddItems, setshowAddItems] = useState(false)
  // const [shopData, setShopData] = useState(null);
  const [shop, setShop] = useState("");

  const [file, setFile] = useState(null);

  const [citya, setCitya] = useState("");

  const [state, setState] = useState("");

  const [address, setAddress] = useState("");

  const [Message, setMessage] = useState("");

  const [Loginloading, setLoginloading] =
    useState(false);

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemFoodType, setItemFoodType] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [itemDiscount, setitemDiscount] = useState("")
  const [itemQuantity, setItemQuantity] = useState(null)

  const [dragging, setDragging] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  useEffect(() => {
    if (isOwner && shopData) {
      getMyItems();
    }
  }, [isOwner, shopData]);
  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await axios.get(
        serverURI + "/auth/logout",
        {
          withCredentials: true,
        }
      );
      dispatch(setuserData(null));

      setProfileOpen(false);

    } catch (error) {

      console.log(
        "Logout error:",
        error
      );

    }

  };
  const handleImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    setItemImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    handleImage(file);
  };
  // ================= CREATE SHOP =================
  const handleCreateShop = async (e) => {

    e.preventDefault();

    console.log("Create shop clicked");

    console.log("Shop Name:", shop);
    console.log("Image:", file);
    console.log("City:", citya);
    console.log("State:", state);
    console.log("Address:", address);

    /*
        Your create-shop API logic can be added here.

        The form values are:

        shop     -> shop
        image    -> file
        city     -> citya
        state    -> state
        address  -> address
        owner    -> user._id
    */

    if (!shop || !file || !citya || !state || !address) {

      setMessage(
        "Please fill all the fields."
      );

      return;
    }

    try {

      setLoginloading(true);

      setMessage("");

      // ==============================
      // CREATE SHOP API
      // ==============================

      const formData = new FormData();

      formData.append("name", shop);

      formData.append("image", file);

      formData.append("city", citya);

      formData.append("state", state);

      formData.append("address", address);

      formData.append("owner", user?._id);



      const response = await axios.post(
        serverURI + "/api/shop/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(response)
      try {
        dispatch(setShopData(response?.data))
      } catch (err) {
        console.log("err dispactch :", err)
      }

      setshowCreateShop(false);
      console.log(response.data);

    } catch (error) {
      console.log(
        "Create shop error: ",
        error
      );
      dispatch(setShopData(""))

      setMessage(
        error.response?.data?.message ||
        "Shop creation failed."
      );

    } finally {
      setLoginloading(false);
    }
  };
  const handleAddItems = async () => {

    if (
      !itemName ||
      !itemPrice ||
      !itemCategory ||
      !itemFoodType ||
      !itemImage
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setItemLoading(true);

      const formData = new FormData();

      formData.append("name", itemName);
      formData.append("price", itemPrice);
      formData.append("category", itemCategory);
      formData.append("foodType", itemFoodType);
      formData.append("image", itemImage);
      formData.append("discount", itemDiscount);

      const response = await axios.post(
        serverURI + "/api/item/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Item created:", response.data);

      // clear form
      setItemName("");
      setItemPrice("");
      setItemCategory("");
      setItemFoodType("");
      setItemImage(null);

      setshowAddItems(false);

    } catch (error) {

      console.log("Add item error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to add food item"
      );

    } finally {
      setItemLoading(false);
    }
  };
  const handleEditItems = async () => {

    try {

      setEditingItem(true)

      const formData = new FormData();

      formData.append("name", itemName);
      formData.append("price", itemPrice);
      formData.append("category", itemCategory);
      formData.append("foodType", itemFoodType);
      formData.append("image", itemImage);
      formData.append("discount", itemDiscount);

      const response = await axios.post(
        serverURI + "/api/item/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Item created:", response.data);

      // clear form
      setItemName("");
      setItemPrice("");
      setItemCategory("");
      setItemFoodType("");
      setItemImage(null);

      setEditingItem(false)

    } catch (error) {

      console.log("Add item error:", error);
      setEditingItem(false)
      alert(
        error.response?.data?.message ||
        "Failed to add food item"
      );

    } finally {
      setEditingItem(false)
    }
  };
  const getMyItems = async () => {
    try {
      setItemsLoading(true);

      const response = await axios.get(
        serverURI + "/api/get-my-items",
        {
          withCredentials: true
        }
      );

      console.log("ITEM RESPONSE:", response.data);

      setItems(response.data.items || []);

    } catch (error) {
      console.log("GET ITEMS ERROR:", error);
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  return (
    <>

      {/* ================= NAVBAR ================= */}

      <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 flex items-center justify-between">
        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-5">

          {/* LOGO */}

          <div>

            {isOwner ? (

              <div>

                <h1 className="text-2xl font-bold text-orange-500">
                  Yumzo
                </h1>

                <p className="text-[10px] font-bold text-gray-500">
                  PARTNER
                </p>

              </div>

            ) : (

              <h1 className="text-2xl font-bold text-orange-500">
                Yumzo
              </h1>

            )}

          </div>


          {/* ================= CREATE SHOP POPUP ================= */}

          {showCreateShop && (

            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 relative">

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setshowCreateShop(false)
                  }
                  className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <FiX size={20} />
                </button>


                {/* HEADING */}

                <div className="mb-6">

                  <h2 className="text-2xl font-bold text-gray-800">
                    Create Your Shop
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Add your restaurant details
                  </p>

                </div>


                {/* FORM */}

                <form
                  onSubmit={handleCreateShop}
                  className="space-y-4"
                >

                  {/* SHOP NAME */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter shop name"
                      value={shop}
                      onChange={(e) =>
                        setShop(e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                  </div>


                  {/* SHOP IMAGE */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Image
                    </label>

                    <input
                      type="file"
                      name="image"
                      onChange={(e) =>
                        setFile(
                          e.target.files[0]
                        )
                      }
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                    />

                  </div>


                  {/* CITY */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>

                    <input
                      type="text"
                      value={citya}
                      onChange={(e) =>
                        setCitya(e.target.value)
                      }
                      name="city"
                      placeholder="Enter city"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                  </div>


                  {/* STATE */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>

                    <input
                      type="text"
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value)
                      }
                      name="state"
                      placeholder="Enter state"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>

                    <textarea
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      name="address"
                      placeholder="Enter complete shop address"
                      rows="3"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                  </div>


                  {/* MESSAGE */}

                  {Message && (

                    <p className="text-sm text-orange-600">
                      {Message}
                    </p>

                  )}


                  {/* BUTTONS */}

                  <div className="flex gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() =>
                        setshowCreateShop(false)
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      disabled={Loginloading}
                      className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50"
                    >

                      {Loginloading
                        ? "Creating..."
                        : "Create Shop"}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

          {showAddItems && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">

              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Add Food Item .
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a new item to your shop menu
                    </p>
                  </div>

                  <button
                    onClick={() => setshowAddItems(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    ✕
                  </button>

                </div>


                <div className="space-y-5">

                  {/* Name + Price + Discount */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Food Name */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Food Name
                      </label>

                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Enter food name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>


                    {/* Price */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="₹ Enter price"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>


                    {/* Discount */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Discount
                      </label>

                      <div className="relative">
                        <input
                          type="number"

                          value={itemDiscount}
                          onChange={(e) => setitemDiscount(e.target.value)}
                          placeholder="Enter discount"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                        <div> <label>Quantity</label>
                          <div className="relative">

                            <input
                              type="text"
                              value={itemQuantity}
                              onChange={(e) => setItemQuantity(e.target.value)}
                              placeholder="Quantity"
                              className="w-full rounded-xl border border-gray-200 px-4 py- outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                          </div>
                        </div>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                          %
                        </span>
                      </div>
                    </div>

                  </div>


                  {/* Category */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category
                    </label>

                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="">
                        Select category
                      </option>

                      <option>Pizza</option>
                      <option>Burger</option>
                      <option>Biryani</option>
                      <option>North Indian</option>
                      <option>South Indian</option>
                      <option>Chinese</option>
                      <option>Momos</option>
                      <option>Rolls</option>
                      <option>Sandwich</option>
                      <option>Pasta</option>
                      <option>Noodles</option>
                      <option>Dosa</option>
                      <option>Idli</option>
                      <option>Thali</option>
                      <option>Desserts</option>
                      <option>Ice Cream</option>
                      <option>Cakes</option>
                      <option>Bakery</option>
                      <option>Fast Food</option>
                      <option>Street Food</option>
                      <option>Healthy Food</option>
                      <option>Salads</option>
                      <option>Breakfast</option>
                      <option>Beverages</option>
                      <option>Juices</option>
                      <option>Coffee</option>
                      <option>Tea</option>
                      <option>Shakes</option>
                      <option>Chicken</option>
                      <option>Mutton</option>
                      <option>Seafood</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                    </select>

                  </div>


                  {/* Food Type */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Food Type
                    </label>

                    <div className="grid grid-cols-2 gap-3">

                      {/* Veg */}
                      <button
                        type="button"
                        onClick={() => setItemFoodType("veg")}
                        className={`rounded-xl border px-4 py-3 font-semibold transition ${itemFoodType === "veg"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        🟢 Veg
                      </button>


                      {/* Non Veg */}
                      <button
                        type="button"
                        onClick={() => setItemFoodType("non-veg")}
                        className={`rounded-xl border px-4 py-3 font-semibold transition ${itemFoodType === "non-veg"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        🔴 Non-Veg
                      </button>

                    </div>

                  </div>


                  {/* Food Image */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Food Image
                    </label>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300 bg-gray-50 hover:border-orange-300"
                        }`}
                    >

                      <input
                        id="food-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImage(e.target.files[0]);
                          }
                        }}
                      />


                      <label
                        htmlFor="food-image"
                        className="cursor-pointer"
                      >

                        {itemImage ? (

                          <div>

                            <img
                              src={URL.createObjectURL(itemImage)}
                              alt="Food preview"
                              className="mx-auto h-40 w-40 rounded-xl object-cover shadow-sm"
                            />

                            <p className="mt-3 text-sm font-medium text-gray-700">
                              {itemImage.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Click to change image
                            </p>

                          </div>

                        ) : (

                          <div>

                            <div className="text-4xl">
                              📸
                            </div>

                            <p className="mt-3 font-semibold text-gray-700">
                              Drag & drop your image here
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                              or click to browse
                            </p>

                          </div>

                        )}

                      </label>

                    </div>

                  </div>


                  {/* Buttons */}
                  <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={() => setshowAddItems(false)}
                      className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>


                    {/* Add Item */}
                    <button
                      type="button"
                      disabled={itemLoading}
                      onClick={handleAddItems}
                      className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {itemLoading
                        ? "Adding..."
                        : "+ Add Food Item"
                      }
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}
          {editingItem && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">

              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Update Your Item
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a new item to your shop menu
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingItem(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    ✕
                  </button>

                </div>


                <div className="space-y-5">

                  {/* Name + Price + Discount */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Food Name */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Food Name
                      </label>

                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Enter food name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>


                    {/* Price */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder="₹ Enter price"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>


                    {/* Discount */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Discount
                      </label>

                      <div className="relative">
                        <input
                          type="number"

                          value={itemDiscount}
                          onChange={(e) => setitemDiscount(e.target.value)}
                          placeholder="Enter discount"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                          %
                        </span>
                      </div>
                    </div>

                  </div>


                  {/* Category */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category
                    </label>

                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="">
                        Select category
                      </option>

                      <option>Pizza</option>
                      <option>Burger</option>
                      <option>Biryani</option>
                      <option>North Indian</option>
                      <option>South Indian</option>
                      <option>Chinese</option>
                      <option>Momos</option>
                      <option>Rolls</option>
                      <option>Sandwich</option>
                      <option>Pasta</option>
                      <option>Noodles</option>
                      <option>Dosa</option>
                      <option>Idli</option>
                      <option>Thali</option>
                      <option>Desserts</option>
                      <option>Ice Cream</option>
                      <option>Cakes</option>
                      <option>Bakery</option>
                      <option>Fast Food</option>
                      <option>Street Food</option>
                      <option>Healthy Food</option>
                      <option>Salads</option>
                      <option>Breakfast</option>
                      <option>Beverages</option>
                      <option>Juices</option>
                      <option>Coffee</option>
                      <option>Tea</option>
                      <option>Shakes</option>
                      <option>Chicken</option>
                      <option>Mutton</option>
                      <option>Seafood</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                    </select>

                  </div>


                  {/* Food Type */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Food Type
                    </label>

                    <div className="grid grid-cols-2 gap-3">

                      {/* Veg */}
                      <button
                        type="button"
                        onClick={() => setItemFoodType("veg")}
                        className={`rounded-xl border px-4 py-3 font-semibold transition ${itemFoodType === "veg"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        🟢 Veg
                      </button>


                      {/* Non Veg */}
                      <button
                        type="button"
                        onClick={() => setItemFoodType("non-veg")}
                        className={`rounded-xl border px-4 py-3 font-semibold transition ${itemFoodType === "non-veg"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        🔴 Non-Veg
                      </button>

                    </div>

                  </div>


                  {/* Food Image */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Food Image
                    </label>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300 bg-gray-50 hover:border-orange-300"
                        }`}
                    >

                      <input
                        id="food-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImage(e.target.files[0]);
                          }
                        }}
                      />


                      <label
                        htmlFor="food-image"
                        className="cursor-pointer"
                      >

                        {itemImage ? (

                          <div>

                            <img
                              src={URL.createObjectURL(itemImage)}
                              alt="Food preview"
                              className="mx-auto h-40 w-40 rounded-xl object-cover shadow-sm"
                            />

                            <p className="mt-3 text-sm font-medium text-gray-700">
                              {itemImage.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Click to change image
                            </p>

                          </div>

                        ) : (

                          <div>

                            <div className="text-4xl">
                              📸
                            </div>

                            <p className="mt-3 font-semibold text-gray-700">
                              Drag & drop your image here
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                              or click to browse
                            </p>

                          </div>

                        )}

                      </label>

                    </div>

                  </div>


                  {/* Buttons */}
                  <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={() => setEditingItem(false)}
                      className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>


                    {/* Add Item */}
                    <button
                      type="button"
                      disabled={itemLoading}
                      onClick={handleAddItems}
                      className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {itemLoading
                        ? "Updating"
                        : "+ Edit Food Item"
                      }
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}
          {/* ================= LOCATION ================= */}

          {!isOwner && (

            <div className="hidden md:flex items-center gap-2">

              <FiMapPin
                size={18}
                className="text-orange-500"
              />

              <span className="text-sm text-gray-600">
                {userCity || "Your Location"}
              </span>

            </div>

          )}

        </div>


        {/* ================= USER SEARCH ================= */}

        {!isOwner && (

          <div className="hidden md:flex flex-1 max-w-xl mx-8">

            <div className="w-full flex items-center bg-gray-100 rounded-xl px-4 py-2.5">

              <FiSearch
                size={20}
                className="text-gray-500"
              />

              <input
                type="text"
                placeholder="Search food or restaurants..."
                className="w-full bg-transparent outline-none px-3"
              />

            </div>

          </div>

        )}


        {/* ================= RIGHT ================= */}

        <div className="flex items-center gap-2 md:gap-4">


          {/* ================= NORMAL USER ================= */}

          {!isOwner && (

            <>

              {/* MOBILE SEARCH */}

              <button
                onClick={() =>
                  setMobileSearchOpen(
                    !mobileSearchOpen
                  )
                }
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiSearch size={21} />
              </button>


              {/* CART */}

              <button onClick={() => { navigate('/cart') }} className="relative p-2 hover:bg-gray-100 rounded-lg">

                <FiShoppingCart size={21} />

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cart.length}
                </span>

              </button>


              {/* ORDERS */}

              <button onClick={() => {
                navigate('/get-my-orders')
              }} className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">

                <FiPackage size={18} />

                <span>
                  Orders
                </span>

              </button>

            </>

          )}


          {/* ================= OWNER ================= */}

          {isOwner && (

            <>

              {/* MY SHOP */}

              <button className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg">

                <span>
                  My Shop
                </span>

              </button>
              {/* ORDERS */}

              <button onClick={() => {
                navigate('/get-owner-orders')
              }} className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg">

                <FiPackage size={18} />

                <span>
                  Orders
                </span>

              </button>



              {/* MOBILE ADD */}

              <button className="md:hidden p-2 bg-orange-500 text-white rounded-lg">

                <FiPlus size={20} />

              </button>

            </>

          )}


          {/* ================= PROFILE ================= */}

          <div className="relative">

            <button
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl"
            >

              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">

                {userLetter}

              </div>

              <span className="hidden md:block text-sm font-medium">

                {username}

              </span>

              <FiChevronDown
                size={16}
                className="hidden md:block"
              />

            </button>


            {/* PROFILE DROPDOWN */}

            {profileOpen && (

              <div className="absolute right-0 top-12 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50">

                {/* USER */}

                <div className="p-4 border-b">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">

                      {userLetter}

                    </div>

                    <div>

                      <p className="font-semibold">
                        {username}
                      </p>

                      <p className="text-xs text-gray-500">

                        {isOwner
                          ? "Shop Owner"
                          : "Customer"}

                      </p>

                    </div>

                  </div>

                </div>


                {/* OWNER OPTIONS */}

                {isOwner && (

                  <>

                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">

                      <MdOutlineShoppingCart size={20} /> My Shop

                    </button>


                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">

                      <IoIosAddCircle size={22} />

                      Add Food

                    </button>

                  </>

                )}


                {/* USER OPTIONS */}

                {!isOwner && (

                  <>

                    <button
                      onClick={() => navigate("/get-my-orders")}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <FiPackage size={20} />
                      My Orders
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">

                      <FiShoppingCart size={18} />

                      Cart

                    </button>

                  </>

                )}


                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t"
                >

                  <FiLogOut size={18} />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </nav>
      <main className="pt-16">



        {/* ================= MOBILE SEARCH ================= */}

        {!isOwner && mobileSearchOpen && (

          <div className="md:hidden p-3 bg-white border-b">

            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">

              <FiSearch
                size={20}
                className="text-gray-500"
              />

              <input
                autoFocus
                type="text"
                placeholder="Search food or restaurants..."
                className="w-full bg-transparent outline-none px-3"
              />

              <button
                onClick={() =>
                  setMobileSearchOpen(false)
                }
              >

                <FiX size={20} />

              </button>

            </div>

          </div>

        )}


        {/* ================= OWNER CONTENT ================= */}

        {isOwner ? (

          <main className="min-h-[calc(100vh-64px)] bg-gray-50 p-4 md:p-8">

            {/* WELCOME */}

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">

              <p className="text-sm text-orange-500 font-semibold">
                SHOP OWNER
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                Welcome, {username} 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Manage your restaurant and food items.
              </p>

            </div>


            {/* CREATE SHOP */}

            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    Your Restaurant
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Create your shop to start adding food.
                  </p>

                </div>

              </div>
              {shopData ? (
                <div className="mt-6 max-w-2xl">

                  {/* SHOP CARD */}
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md">

                    {/* SHOP IMAGE */}
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={shopData.image}
                        alt={shopData.name}
                        className="w-full h-full object-cover"
                      />

                      {/* ACTIVE BADGE */}
                      <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-green-600 text-sm font-semibold rounded-full shadow-sm">
                        ● Active
                      </span>
                    </div>

                    {/* SHOP DETAILS */}
                    <div className="p-5">

                      <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
                        Your Restaurant
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        {shopData.name}
                      </h3>

                      {/* LOCATION */}
                      <div className="mt-4">
                        <p className="text-gray-700 font-medium">
                          📍 {shopData.address}
                        </p>

                        <p className="text-gray-500 mt-1">
                          {shopData.city}, {shopData.state}
                        </p>
                      </div>

                      {/* ADD ITEM */}
                      <button
                        onClick={() => {
                          setshowAddItems(true)
                        }}
                        className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
                      >
                        <FiPlus size={20} />
                        Add Your Item
                      </button>

                    </div>
                  </div>

                </div>
              ) : (

                /* NO SHOP */

                <div className="mt-6 border border-dashed border-gray-300 rounded-xl p-8 text-center">

                  <p className="font-semibold mt-3">
                    No shop information yet
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Create your restaurant first.
                  </p>

                  <button
                    onClick={() => setshowCreateShop(true)}
                    className="bg-orange-500 text-white px-5 py-3 rounded-xl mt-4"
                  >
                    Create Shop
                  </button>

                </div>


              )}
            </div>
            <div className="mt-6">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-800">
                  Your Food Items
                </h2>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                  {items.length} Items
                </span>

              </div>


              {itemsLoading ? (

                <div className="py-10 text-center text-gray-500">
                  Loading your items...
                </div>

              ) : items.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

                  <div className="mb-2 text-4xl">
                    🍽️
                  </div>

                  <h3 className="font-semibold text-gray-700">
                    No food items yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Add your first food item to your shop.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {items.map((item) => (

                    <div
                      key={item._id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >

                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-44 w-full object-cover"
                      />


                      {/* Details */}
                      <div className="p-4">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <h3 className="font-bold text-gray-800">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {item.category}
                            </p>

                          </div>

                          <span className="font-bold text-orange-500">
                            ₹{item.price}
                          </span>

                        </div>


                        {/* Food type */}
                        <div className="mt-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.foodType === "veg"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                              }`}
                          >
                            {item.foodType === "veg"
                              ? "🟢 Veg"
                              : "🔴 Non-Veg"}
                          </span>

                        </div>


                        {/* Edit */}
                        <button onClick={() => { setEditingItem(true) }}

                          className="mt-4 w-full rounded-xl border border-orange-500 py-2.5 font-semibold text-orange-500 transition hover:bg-orange-50"
                        >
                          ✏️ Edit Item
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>




          </main>

        ) : (

          /* ================= NORMAL USER CONTENT ================= */

          <main className="min-h-[calc(100vh-64px)] bg-gray-50 p-4 md:p-8">

            <div className="bg-orange-500 text-white rounded-3xl p-8">

              <p className="text-sm opacity-90">
                Delicious food, delivered to you
              </p>

              <h2 className="text-3xl md:text-5xl font-bold mt-2">
                What are you craving today?
              </h2>

              <p className="mt-3 opacity-90">
                Discover delicious food from restaurants around you.
              </p>

            </div>


            <div className="mt-8">

              <h2 className="text-xl font-bold mb-4">
                Categories
              </h2>


              <div className="space-y-6">
                <div className="space-x-2 flex gap-3 overflow-x-auto">
                  {[
                    "Pizza",
                    "Burger",
                    "Biryani",
                    "Chinese",
                    "South Indian",
                    "Desserts",
                  ].map((category) => (
                    <button
                      key={category}
                      className="bg-white border px-5 py-3 rounded-xl whitespace-nowrap hover:border-orange-500 hover:text-orange-500"
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <FoodItems />
                </div>
              </div>

            </div>

          </main>

        )}
      </main>
    </>
  );
}
export default Nav;