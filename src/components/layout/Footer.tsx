import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-950/40">
        <div className="container px-6 py-5 mx-auto">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                <a href="./" className="flex flex-row items-center space-x-3 z-10">
                  <span className="text-sm font-thin text-blue-300">&copy; CURIO INSIGHTS {new Date().getFullYear()}. All Rights Reserved.</span>
                </a>
                {/* <div className="flex mt-3 -mx-2 sm:mt-0">
                    <a href="#" className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Teams </a>

                    <a href="#" className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Privacy </a>

                    <a href="#" className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Cookies </a>
                </div> */}
            </div>
        </div>
    </footer>
  );
}
