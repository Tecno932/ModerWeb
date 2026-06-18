import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth }
  from "@/features/auth/context/AuthContext";

import { useUpdateProfile }
  from "@/features/users/hooks/useUpdateProfile";

export default function EditProfilePage() {
  const navigate =
    useNavigate();

  const {
    user,
    loading,
  } = useAuth();

  const token =
    localStorage.getItem(
      "token"
    );

  const updateProfile =
    useUpdateProfile(
      token ?? ""
    );

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  //////////////////////////////////////////////////
  // LOAD USER
  //////////////////////////////////////////////////

  useEffect(() => {
    if (!user) return;

    setUsername(
      user.username
    );

    setBio(
      user.bio ?? ""
    );
  }, [user]);

  //////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        username,
        bio,
      });

      navigate(
        `/users/${username}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  //////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////

  if (loading) {
    return (
      <div>
        Cargando...
      </div>
    );
  }

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <form
      onSubmit={handleSubmit}
    >
      <h1>
        Edit Profile
      </h1>

      <input
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
          )
        }
        placeholder="Username"
      />

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(
            e.target.value
          )
        }
        placeholder="Biography"
      />

      <button
        disabled={
          updateProfile.isPending
        }
        type="submit"
      >
        {updateProfile.isPending
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}