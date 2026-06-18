import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout/AppLayout";

//////////////////////////////////////////////////
// PUBLIC PAGES
//////////////////////////////////////////////////

import HomePage from "@/pages/HomePage/HomePage";
import SearchPage from "@/pages/SearchPage/SearchPage";
import ModPage from "@/pages/ModPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

//////////////////////////////////////////////////
// USER PAGES
//////////////////////////////////////////////////

import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage/EditProfilePage";

//////////////////////////////////////////////////
// DASHBOARD LAYOUT
//////////////////////////////////////////////////

import DashboardLayout from "@/app/layouts/DashboardLayout/DashboardLayout";

//////////////////////////////////////////////////
// DASHBOARD PAGES
//////////////////////////////////////////////////

import CreateModPage from "@/pages/CreateMod/CreateModPage";
import ProjectsPage from "@/pages/project/ProjectsPage";
import ProjectDashboard from "@/pages/project/ProjectDashboard";

//////////////////////////////////////////////////
// PROJECT TABS
//////////////////////////////////////////////////

import OverviewTab from "@/pages/project/tabs/OverviewTab";
import VersionsTab from "@/pages/project/tabs/VersionsTab";
import GalleryTab from "@/pages/project/tabs/GalleryTab";
import SettingsTab from "@/pages/project/tabs/SettingsTab";

//////////////////////////////////////////////////
// ROUTER
//////////////////////////////////////////////////

export const router =
  createBrowserRouter([
    {
      element: <AppLayout />,

      children: [
        //////////////////////////////////////////////////
        // HOME
        //////////////////////////////////////////////////

        {
          path: "/",

          element: <HomePage />,
        },

        //////////////////////////////////////////////////
        // GAME PAGES
        //////////////////////////////////////////////////

        {
          path: "/minecraft",

          element: (
            <SearchPage
              platform="JAVA"
              title="Minecraft Java Mods"
            />
          ),
        },

        {
          path: "/minecraftbedrock",

          element: (
            <SearchPage
              platform="BEDROCK"
              title="Minecraft Bedrock Addons"
            />
          ),
        },

        //////////////////////////////////////////////////
        // SEARCH
        //////////////////////////////////////////////////

        {
          path: "/search",

          element: (
            <SearchPage
              platform="JAVA"
              title="Search Projects"
            />
          ),
        },

        //////////////////////////////////////////////////
        // MOD PAGE
        //////////////////////////////////////////////////

        {
          path: "/mods/:slug",

          element: <ModPage />,
        },

        //////////////////////////////////////////////////
        // AUTH
        //////////////////////////////////////////////////

        {
          path: "/login",

          element: <LoginPage />,
        },

        {
          path: "/register",

          element: <RegisterPage />,
        },

        //////////////////////////////////////////////////
        // DASHBOARD
        //////////////////////////////////////////////////

        {
          element: <DashboardLayout />,

          children: [
            //////////////////////////////////////////////////
            // USER PAGE
            //////////////////////////////////////////////////

            {
              path: "/users/:username",
              element: <ProfilePage />,
            },

            {
              path: "/profile/edit",
              element: <EditProfilePage />,
            },
            //////////////////////////////////////////////////
            // PROJECTS PAGE
            //////////////////////////////////////////////////

            {
              path: "/project",

              element: <ProjectsPage />,
            },

            //////////////////////////////////////////////////
            // CREATE MOD
            //////////////////////////////////////////////////

            {
              path: "/create",

              element:
                <CreateModPage />,
            },

            //////////////////////////////////////////////////
            // PROJECT DASHBOARD
            //////////////////////////////////////////////////

            {
              path: "/project/:slug",

              element:
                <ProjectDashboard />,

              children: [
                //////////////////////////////////////////////////
                // OVERVIEW
                //////////////////////////////////////////////////

                {
                  index: true,

                  element:
                    <OverviewTab />,
                },

                //////////////////////////////////////////////////
                // VERSIONS
                //////////////////////////////////////////////////

                {
                  path: "versions",

                  element:
                    <VersionsTab />,
                },

                //////////////////////////////////////////////////
                // GALLERY
                //////////////////////////////////////////////////

                {
                  path: "gallery",

                  element:
                    <GalleryTab />,
                },

                //////////////////////////////////////////////////
                // SETTINGS
                //////////////////////////////////////////////////

                {
                  path: "settings",

                  element:
                    <SettingsTab />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);