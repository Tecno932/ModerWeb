import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import fav from "@/assets/icons/favorite.png";
import favColor from "@/assets/icons/favoritecolor.png";

export default function FavoriteButton({ modId }: any) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["favorite", modId],
    queryFn: async () => {
      if (!token) return { favorited: false };

      const res = await fetch(`http://192.168.0.110:3000/mods/${modId}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.json();
    },
    initialData: { favorited: false },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No auth");

      await fetch(`http://192.168.0.110:3000/mods/${modId}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    },

    onMutate: async () => {
      const prev = data?.favorited;

      queryClient.setQueryData(["favorite", modId], {
        favorited: !prev,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", modId] });
    },
  });

  const handleClick = () => {
    if (!token) {
      alert("Logueate");
      return;
    }

    mutation.mutate();
  };

  const favorited = data?.favorited;

  return (
  <button onClick={handleClick}>
    <img
      src={favorited ? favColor : fav}
      width={20}
    />
  </button>
  );
}