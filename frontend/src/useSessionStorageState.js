import { useState, useEffect } from "react";

function useSessionStorageState(key, defaultValue) {
    const [value, setValue] = useState(() => {
        const jsonValue = sessionStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);
        return defaultValue;
    });

    useEffect(() => {
        if (value === undefined) return;
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useSessionStorageState;
