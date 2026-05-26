import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/app/layouts/AppLayout/AppLayout";

import CreateModPage from "@/pages/CreateModPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import HomePage from "@/pages/HomePage/HomePage";
import SearchPage from "@/pages/SearchPage/SearchPage";
import ModPage from "@/pages/ModPage";

// DASHBOARD
import ProjectDashboard from "@/pages/project/ProjectDashboard";
import OverviewTab from "@/pages/project/tabs/OverviewTab";
import VersionsTab from "@/pages/project/tabs/VersionsTab";
import GalleryTab from "@/pages/project/tabs/GalleryTab";
import SettingsTab from "@/pages/project/tabs/SettingsTab";

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
        // CREATE
        // SOLO ESTA REQUIERE LOGIN
        //////////////////////////////////////////////////

        {
          path: "/create",
          element: <CreateModPage />,
        },

        //////////////////////////////////////////////////
        // PROJECT DASHBOARD
        //////////////////////////////////////////////////

        {
          path: "/project/:slug",
          element: <ProjectDashboard />,

          children: [
            {
              index: true,
              element: <OverviewTab />,
            },

            {
              path: "versions",
              element: <VersionsTab />,
            },

            {
              path: "gallery",
              element: <GalleryTab />,
            },

            {
              path: "settings",
              element: <SettingsTab />,
            },
          ],
        },
      ],
    },
  ]);