import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useRef } from "react";

const Header = () => {
  const { setInput, input } = useAppContext();

  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value); //this will work when we will enter data in input field and click on submit
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  }; //this helps to get the all blogs after seraching any blog
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-4 py-1.5 mb-4 border border-indigo-500/40 bg-blue-200/10 rounded-full text-sm text-bg-indigo-500">
          <p>New: AI feature integrated !</p>
          <img src={assets.star_icon} alt="" className="w-2.5" />
        </div>

        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          Your own <span className="text-indigo-600">blogging</span> <br />
          platform
        </h1>

        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          This is your space to think out loud , to share what truely matters,
          and to write without filters . Whether it's one word or a thousand ,
          your story starts right here.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Blogs"
            required
            className="w-full pl-4 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={() => window.location.href = '/user-dashboard'}
          className="font-medium py-2 px-6 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors mr-4"
        >
          My Dashboard
        </button>
        <button 
          onClick={() => window.location.href = '/add-blog'}
          className="font-medium py-2 px-6 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Create New Blog
        </button>
      </div>

      <div className="text-center mt-4">
        {input && (
          <button
            onClick={onClear}
            className="border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
