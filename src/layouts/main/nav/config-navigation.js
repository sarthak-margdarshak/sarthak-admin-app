/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

// IMPORT ---------------------------------------------------------------

// routes
import { PATH_PAGE } from "../../../routes/paths";
// components
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: "Home",
    icon: <Iconify icon="eva:home-fill" />,
    path: "/",
  },
  {
    title: "About us",
    icon: <Iconify icon="mdi:about" />,
    path: PATH_PAGE.about,
  },
  {
    title: "Contact us",
    icon: <Iconify icon="mdi:contact" />,
    path: PATH_PAGE.contact,
  },
  {
    title: "FAQs",
    icon: <Iconify icon="wpf:faq" />,
    path: PATH_PAGE.faqs,
  },
];

export default navConfig;
