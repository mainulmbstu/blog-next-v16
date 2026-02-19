"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { CgCloseR } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./context";
import Image from "next/image";
import Cookies from "js-cookie";
import { category } from "../helpers/categoryData";
import slugify from "slugify";
import { useTheme } from "next-themes";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

const NavMenu = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [drop1, setdrop1] = useState(false);
  const [drop2, setdrop2] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let menuClose = () => setisMenuOpen(false);
  let { userInfo, setUserInfo, setToken } = useAuth();
  let router = useRouter();
  let path = usePathname();

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-0 w-full z-10 shadow-lg flex  justify-between md:items-center p-4  bg-base-300">
      <div className="">
        <Link href="/">logo</Link>
      </div>
      <div
        className={`h-6  transition-all  duration-500 ${
          isMenuOpen ? "h-60 flex-1" : ""
        }`}
      >
        <nav className=" relative">
          <ul
            className={`${
              isMenuOpen
                ? "flex flex-col scale-y-100 pt-12 text-center transition-all  duration-500"
                : "scale-y-0"
            } md:flex md:gap-6 md:scale-y-100`}
          >
            <li className=" border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
              <Link
                className={path === "/" ? "underline text-blue-700" : ""}
                onClick={menuClose}
                href={"/"}
              >
                Home
              </Link>
            </li>
            <li className=" border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
              <Link
                className={path === "/about" ? "underline text-blue-700" : ""}
                onClick={menuClose}
                href={"/about"}
              >
                About
              </Link>
            </li>

            <li
              onClick={() => setdrop1(!drop1)}
              className=" relative cursor-pointer border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all"
            >
              <p
                className={
                  path.startsWith(`/post/category`)
                    ? "underline text-blue-700"
                    : ""
                }
              >
                <span className=" flex justify-center gap-2">
                  Category
                  <IoIosArrowDown
                    className={`mt-1 ${drop1 ? "rotate-180" : ""}`}
                  />{" "}
                </span>
              </p>
              <ul
                className={`absolute top-full z-30  md:left-0 bg-base-300 w-full md:w-fit whitespace-nowrap origin-top duration-300 ${
                  drop1 ? "scale-y-100" : "scale-y-0"
                }`}
              >
                {category?.length &&
                  category.map((item) => (
                    <li className="" key={item.id}>
                      <Link
                        onClick={menuClose}
                        className={
                          path == `/post/category/${slugify(item.name)}`
                            ? "bg-zinc-400  w-full inline-block p-2 hover:bg-zinc-400"
                            : "w-full inline-block p-2 hover:bg-zinc-400"
                        }
                        href={`/post/category/${slugify(
                          item.name
                        )}?categoryName=${item.name}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {userInfo ? (
              <>
                <li
                  onClick={() => setdrop2(!drop2)}
                  className=" relative cursor-pointer  border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all"
                >
                  <span></span>
                  <span className=" flex justify-center gap-2">
                    <Image
                      priority={true}
                      width={400}
                      height={400}
                      src={
                        userInfo?.picture
                          ? userInfo?.picture?.secure_url
                          : "/dummy.jpeg"
                      }
                      alt="image"
                      className=" rounded-full w-8 h-8 object-contain"
                    />
                    {userInfo?.name}
                    <IoIosArrowDown
                      className={`mt-1 ${drop2 ? "rotate-180" : ""}`}
                    />{" "}
                  </span>
                  <ul
                    className={`absolute top-full z-20  md:right-0 bg-base-300 w-full md:w-fit whitespace-nowrap origin-top duration-300 ${
                      drop2 ? "scale-y-100" : "scale-y-0"
                    }`}
                  >
                    <li>
                      <Link
                        onClick={menuClose}
                        className={
                          path.startsWith(`/dashboard`)
                            ? "bg-zinc-300  w-full inline-block p-2 hover:bg-zinc-400 underline"
                            : "w-full inline-block p-2 hover:bg-zinc-300"
                        }
                        href={
                          userInfo?.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                        }
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          Cookies.remove("token");
                          setUserInfo(null);
                          setToken(null);
                          router.refresh("/");
                        }}
                        className={
                          "w-full inline-block md:text-left p-2 hover:bg-zinc-300 cursor-pointer"
                        }
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className=" border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
                  <Link
                    className={
                      path === "/user/login" ? "underline text-blue-700" : ""
                    }
                    onClick={menuClose}
                    href={"/user/login"}
                  >
                    Login
                  </Link>
                </li>
                <li className=" border-b-1 border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
                  <Link
                    className={
                      path === "/user/register" ? "underline text-blue-700" : ""
                    }
                    onClick={menuClose}
                    href={"/user/register"}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="me-5 text-lg">
        <button
          className=" cursor-pointer"
          onClick={() => setTheme(theme == "light" ? "dark" : "light")}
        >
          {theme == "light" ? <FaMoon /> : <GoSun />}
        </button>
      </div>
      <div className="md:hidden cursor-pointer">
        <span onClick={() => setisMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <CgCloseR className=" hover:scale-125 transition-all text-2xl " />
          ) : (
            <FaBars className=" hover:scale-125 transition-all text-2xl " />
          )}
        </span>
      </div>
    </div>
  );
};

export default NavMenu;
