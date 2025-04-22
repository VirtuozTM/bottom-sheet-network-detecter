import { useRef, useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export default function useStableNetInfo(delay = 1000) {
  const [state, setState] = useState<NetInfoState | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) => {
      if (!s.isConnected) {
        // on attend 'delay' ms avant de propager le vrai offline
        timeout.current = setTimeout(() => setState(s), delay);
      } else {
        // online : on annule le délai et on met à jour tout de suite
        if (timeout.current) clearTimeout(timeout.current);
        setState(s);
      }
    });
    return () => {
      unsub();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [delay]);

  return state;
}
