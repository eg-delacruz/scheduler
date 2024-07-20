import { useState, useEffect } from 'react';

type Value = string | number;

// Optimal wait time for debounce is 300ms
function useDebouncedSearchValue(value: Value, wait = 300) {
  //State to store the search value
  const [debouncedValue, setDebouncedValue] = useState<Value>(value);

  useEffect(() => {
    // Update the inner state after <wait> ms
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    // Clear previous timeout in case a new value is received
    return () => {
      window.clearTimeout(timeoutId);
    };
    //Every time the value changes, we want to reset the timer
  }, [value]);

  return debouncedValue;
}

export default useDebouncedSearchValue;
