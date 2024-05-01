import React from "react";

function useLocalStorageValue(key,value = '',
    {serialize = JSON.stringify, deserialize = JSON.parse} = {},) {
      const [state, setState] = React.useState(() => {
        const valueInLocalStorage = window.localStorage.getItem(key);

        if (valueInLocalStorage) {
          try {
            return deserialize(valueInLocalStorage);
          } catch (error) {
            window.localStorage.removeItem(key);
          }
        }

        return typeof value === 'function' ? value() : value;
      });

      const prevKeyRef = React.useRef(key);

      React.useEffect(() => {
        const prevKey = prevKeyRef.current;

        if (prevKey !== key) {
          window.localStorage.removeItem(prevKey);
        }

        prevKeyRef.current = key;

        window.localStorage.setItem(key, serialize(state));
      }, [key, state, serialize])

    return [state, setState];
};

export { useLocalStorageValue }