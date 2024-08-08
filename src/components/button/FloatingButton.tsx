"use client";
import React from "react";

import ChatBubbleIcon from "@/svg/ChatBubbleIcon";

const Fab = () => {
    return (
    <div>
        <div className="fixed right-5 bottom-5 text-white bg-blue-600 rounded-xl hover:cursor-pointer z-10" onClick={() => {window.open("https://docs.google.com/forms/d/e/1FAIpQLSfshLBcafYQvTgAjcmYu_0AyC8IuuoyXrA5LJtME_kD1oDLww/viewform", "_blank")}}>
            <div className="flex flex-row items-center py-3 px-5 gap-x-2">
                <button id="settings-fab">
                    <ChatBubbleIcon />
                </button>
                <h1 className="text-white text-sm font-bold">Give us Feedback</h1>
            </div>
        </div>
    </div>
    )
}

export default Fab