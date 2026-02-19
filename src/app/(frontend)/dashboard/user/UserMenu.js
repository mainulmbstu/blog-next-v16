'use client'

import Link from "next/link";
import { ImProfile } from "react-icons/im";
import { PiUserListFill } from "react-icons/pi";
import { FaListOl } from "react-icons/fa";
import { MdOutlineAddBusiness } from "react-icons/md";
import { MdAllInclusive } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";

const UserMenu = () => {
  
    let path = usePathname()
  let router = useRouter()
  let menus = [
    {
      name: "profile",
      href: "/dashboard/user/profile",
      icon: <ImProfile />,
    },

    {
      name: "My Blogs",
      href: "/dashboard/user/my-blogs",
      icon: <FaListOl />,
    },
  
  ];

  return (
    <div className="card p-2">
      <Link
        className={path === "/dashboard/admin" ? "bg-blue-300 p-3" : "hover:bg-zinc-300 p-3"}
        href={"/dashboard/admin"}
      >
        Dashboard
      </Link>
      <ul className="menu rounded-box w-full">
        {menus.map((item, i) => (
          <li key={i} className={item.href === path ? "bg-blue-300" : ""}>
            <Link href={item.href}>
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserMenu;
