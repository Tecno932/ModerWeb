import { useMutation, useQuery, } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  createVersion,
  uploadFileR2,
  getVersions,
  deleteVersion,
  updateVersion,
} from "@/features/versions/api";

////////////////////////////////////////////////////////
// CREATE VERSION
////////////////////////////////////////////////////////

export function useCreateVersion() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createVersion,

    ////////////////////////////////////////////////////
    // OPTIMISTIC UPDATE
    ////////////////////////////////////////////////////

    onMutate: async (
      newVersion
    ) => {
      const queryKey = [
        "mod",
        newVersion.modId,
        "versions",
      ];

      //////////////////////////////////////////////////
      // CANCEL REFETCHES
      //////////////////////////////////////////////////

      await queryClient.cancelQueries(
        {
          queryKey,
        }
      );

      //////////////////////////////////////////////////
      // PREVIOUS DATA
      //////////////////////////////////////////////////

      const previousVersions =
        queryClient.getQueryData(
          queryKey
        );

      //////////////////////////////////////////////////
      // OPTIMISTIC VERSION
      //////////////////////////////////////////////////

      const optimisticVersion = {
        id:
          "temp-" +
          Date.now(),

        version:
          newVersion.version,

        minecraftVersion:
          newVersion.minecraftVersion,

        loader:
          newVersion.loader,

        createdAt:
          new Date().toISOString(),

        downloads: 0,

        files: [],
      };

      //////////////////////////////////////////////////
      // UPDATE CACHE
      //////////////////////////////////////////////////

      queryClient.setQueryData(
        queryKey,
        (
          old: any[] = []
        ) => [
          optimisticVersion,
          ...old,
        ]
      );

      //////////////////////////////////////////////////
      // CONTEXT
      //////////////////////////////////////////////////

      return {
        previousVersions,
      };
    },

    ////////////////////////////////////////////////////
    // ROLLBACK
    ////////////////////////////////////////////////////

    onError: (
      _err,
      variables,
      context
    ) => {
      queryClient.setQueryData(
        [
          "mod",
          variables.modId,
          "versions",
        ],

        context?.previousVersions
      );
    },

    ////////////////////////////////////////////////////
    // REFETCH REAL DATA
    ////////////////////////////////////////////////////

    onSettled: (
      _data,
      _error,
      variables
    ) => {
      queryClient.invalidateQueries(
        {
          queryKey: [
            "mod",
            variables.modId,
            "versions",
          ],
        }
      );
    },
  });
}

////////////////////////////////////////////////////////
// DELETE VERSION
////////////////////////////////////////////////////////

export function useDeleteVersion(
  modId: string | number
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteVersion,

    ////////////////////////////////////////////////////
    // OPTIMISTIC DELETE
    ////////////////////////////////////////////////////

    onMutate: async (
      versionId
    ) => {
      const queryKey = [
        "mod",
        modId,
        "versions",
      ];

      await queryClient.cancelQueries(
        {
          queryKey,
        }
      );

      const previousVersions =
        queryClient.getQueryData<
          any[]
        >(queryKey);

      queryClient.setQueryData(
        queryKey,

        (
          old: any[] = []
        ) =>
          old.filter(
            (v) =>
              v.id !== versionId
          )
      );

      return {
        previousVersions,
      };
    },

    ////////////////////////////////////////////////////
    // ROLLBACK
    ////////////////////////////////////////////////////

    onError: (
      _err,
      _variables,
      context
    ) => {
      queryClient.setQueryData(
        [
          "mod",
          modId,
          "versions",
        ],

        context?.previousVersions
      );
    },

    ////////////////////////////////////////////////////
    // SYNC
    ////////////////////////////////////////////////////

    onSettled: () => {
      queryClient.invalidateQueries(
        {
          queryKey: [
            "mod",
            modId,
            "versions",
          ],
        }
      );
    },
  });
}

////////////////////////////////////////////////////////
// UPDATE VERSION
////////////////////////////////////////////////////////

export function useUpdateVersion(
  modId: string | number
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateVersion,

    ////////////////////////////////////////////////////
    // OPTIMISTIC UPDATE
    ////////////////////////////////////////////////////

    onMutate: async (
      updated
    ) => {
      const queryKey = [
        "mod",
        modId,
        "versions",
      ];

      await queryClient.cancelQueries(
        {
          queryKey,
        }
      );

      const previousVersions =
        queryClient.getQueryData<
          any[]
        >(queryKey);

      queryClient.setQueryData(
        queryKey,

        (
          old: any[] = []
        ) =>
          old.map((v) =>
            v.id ===
            updated.versionId
              ? {
                  ...v,
                  version:
                    updated.version,
                }
              : v
          )
      );

      return {
        previousVersions,
      };
    },

    ////////////////////////////////////////////////////
    // ROLLBACK
    ////////////////////////////////////////////////////

    onError: (
      _err,
      _variables,
      context
    ) => {
      queryClient.setQueryData(
        [
          "mod",
          modId,
          "versions",
        ],

        context?.previousVersions
      );
    },

    ////////////////////////////////////////////////////
    // SYNC
    ////////////////////////////////////////////////////

    onSettled: () => {
      queryClient.invalidateQueries(
        {
          queryKey: [
            "mod",
            modId,
            "versions",
          ],
        }
      );
    },
  });
}

////////////////////////////////////////////////////////
// UPLOAD FILE
////////////////////////////////////////////////////////

export function useUploadFile() {
  return useMutation({
    mutationFn: (data: {
      versionId: number;
      
      file: File;

      onProgress?: (
        progress: number
      ) => void;
    }) => uploadFileR2(data),
  });
}

////////////////////////////////////////////////////////
// GET VERSIONS
////////////////////////////////////////////////////////

export function useVersions(
  modId: string | number
) {
  return useQuery({
    queryKey: [
      "mod",
      modId,
      "versions",
    ],

    queryFn: () =>
      getVersions(modId),

    enabled: !!modId,
  });
}