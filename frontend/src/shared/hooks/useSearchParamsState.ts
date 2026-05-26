import {
  useSearchParams,
} from "react-router-dom";

export function useSearchParamsState() {
  const [params, setParams] =
    useSearchParams();

  function setParam(
    key: string,
    value?: string
  ) {
    const next =
      new URLSearchParams(params);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setParams(next);
  }

  return {
    params,
    setParam,
  };
}