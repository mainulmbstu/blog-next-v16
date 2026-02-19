"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "./context";
import Image from "next/image";
import Cookies from "js-cookie";
import { category } from "../helpers/categoryData";
import slugify from "slugify";

const Navbar = () => {
  let { userInfo, setUserInfo, setToken } = useAuth();
  let router = useRouter();
  let path = usePathname();
  // console.log(path);
  return (
    <div className="navbar bg-base-300 shadow-lg fixed z-50 h-[5vh]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1
          mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link className={path === "/" ? "bg-zinc-200" : ""} href={"/"}>
                Home
              </Link>
            </li>

            <li>
              <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="">
                  Dropdown
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu  rounded-box z-[1] w-40 p-2 shadow bg-base-300 ml-0"
                >
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <Link
                className={path === "/about" ? "bg-zinc-200" : ""}
                href={"/about"}
              >
                About
              </Link>
            </li>
            {userInfo ? (
              <>
                <li className=" min-w-28">
                  <details>
                    <summary>
                      <Image
                        priority={true}
                        width={400}
                        height={404}
                        src={
                          userInfo?.picture
                            ? userInfo?.picture?.secure_url
                            : "/dummy.jpeg"
                        }
                        alt="image"
                        className=" rounded-full w-12 object-contain"
                        // height={"100px"}
                        // width={"100px"}
                      />
                      {userInfo?.name}
                    </summary>
                    <ul
                      style={{ marginTop: "10px" }}
                      className="p-2 text-black w-full "
                    >
                      <li>
                        <Link
                          className={path === "/dashboard" ? "bg-zinc-200" : ""}
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
                        <Link
                          onClick={() => {
                            Cookies.remove(["userInfo"]);
                            Cookies.remove("token");
                            setUserInfo("");
                          }}
                          className={
                            path === "/user/login" ? "bg-zinc-200" : ""
                          }
                          href={"/user/login"}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className={path === "/user/login" ? "bg-zinc-200" : ""}
                    href={"/user/login"}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className={path === "/user/register" ? "bg-zinc-200" : ""}
                    href={"/user/register"}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link href={"/"} className="btn btn-ghost text-xl">
          Logo
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex justify-end w-2/3">
        <ul className="menu menu-horizontal px-1 flex items-center">
          <li>
            <Link className={path === "/" ? "bg-zinc-200" : ""} href={"/"}>
              Home
            </Link>
          </li>

          <li>
            <div
              className={
                path.startsWith(`/post/category`)
                  ? "bg-zinc-200 dropdown dropdown-bottom"
                  : "dropdown dropdown-bottom"
              }
            >
              <div tabIndex={0} role="button" className="">
                Category
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu  rounded-box z-[1] w-40 shadow bg-base-300 ml-0"
              >
                {category?.length &&
                  category.map((item) => (
                    <li key={item.id}>
                      <Link
                        className={
                          path == `/post/category/${slugify(item.name)}`
                            ? "bg-blue-200"
                            : ""
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
            </div>
          </li>
          <li>
            <Link
              className={path === "/about" ? "bg-zinc-200" : ""}
              href={"/about"}
            >
              About
            </Link>
          </li>
          {userInfo ? (
            <>
              <li className=" min-w-28">
                <details>
                  <summary>
                    <Image
                      priority={true}
                      width={400}
                      height={404}
                      src={
                        userInfo?.picture
                          ? userInfo?.picture?.secure_url
                          : "/dummy.jpeg"
                      }
                      alt="image"
                      className=" rounded-full w-12 object-contain"
                    />
                    {userInfo?.name}
                  </summary>
                  <ul
                    style={{ marginTop: "10px" }}
                    className="p-2 w-full bg-base-200 "
                  >
                    <li>
                      <Link
                        className={path === "/dashboard" ? "bg-zinc-200" : ""}
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
                        className={path === "/user/login" ? "bg-zinc-200" : ""}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className={path === "/user/login" ? "bg-zinc-200" : ""}
                  href={"/user/login"}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className={path === "/user/register" ? "bg-zinc-200" : ""}
                  href={"/user/register"}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
