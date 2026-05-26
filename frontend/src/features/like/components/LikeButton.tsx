import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import likeColor from "@/assets/icons/likecolor.png";
import like from "@/assets/icons/like.png";

type Props = {
  modId: number;
  initialCount: number;
};

export default function LikeButton({ modId, initialCount }: Props) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // 🧠 estado real desde backend
  const { data } = useQuery({
    queryKey: ["like", modId],
    queryFn: async () => {
      const res = await fetch(`http://192.168.0.110:3000/mods/${modId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return { liked: false };

      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  // 🧠 contador desde cache global
  const mod = queryClient.getQueryData<any>(["mod", modId]);
  const count = mod?.likesCount ?? initialCount;

  // 🔁 toggle
  const mutation = useMutation({
    mutationFn: async () => {
      await fetch(`http://192.168.0.110:3000/mods/${modId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onMutate: () => {
      const prevLiked = data?.liked;

      // ⚡ estado instantáneo
      queryClient.setQueryData(["like", modId], {
        liked: !prevLiked,
      });

      // ⚡ contador instantáneo
      queryClient.setQueryData(["mod", modId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likesCount: prevLiked
            ? old.likesCount - 1
            : old.likesCount + 1,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["like", modId] });
      queryClient.invalidateQueries({ queryKey: ["mod", modId] });
    },
  });

  const handleClick = () => {
    if (!token) {
      alert("Logueate");
      return;
    }

    mutation.mutate();
  };

  const liked = data?.liked ?? false;

  return (
    <button onClick={handleClick}>
      <img
        src={liked ? likeColor : like}
        width={20}
      />
      {" "}
      {count}
    </button>
  );
}