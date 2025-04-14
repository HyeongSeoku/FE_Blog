"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import { handleKeyboardClick } from "@/utils/eventListener";

interface AutoCompleteProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  inputValue: string;
  setInputValue: (value: SetStateAction<string>) => void;
  allowCustomEntries?: boolean;
}

const AutoComplete = ({
  suggestions,
  onSelectSuggestion,
  inputValue,
  setInputValue,
  allowCustomEntries = false,
}: AutoCompleteProps) => {
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const filteredSuggestions = useMemo(() => {
    if (!inputValue) return [];
    const input = inputValue.replace(/\s+/g, "").toLowerCase();
    return suggestions.filter((suggestion) =>
      suggestion.replace(/\s+/g, "").toLowerCase().includes(input),
    );
  }, [inputValue, suggestions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value.trim());
    setActiveSuggestionIndex(-1);
  };

  function handleClick(
    e: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>,
  ) {
    const { innerText } = e.currentTarget;
    setInputValue(innerText);
    onSelectSuggestion(innerText);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeSuggestionIndex === -1) {
        if (allowCustomEntries) {
          onSelectSuggestion(inputValue);
          setInputValue("");
        }

        return;
      }

      setInputValue(filteredSuggestions[activeSuggestionIndex]);
      onSelectSuggestion(filteredSuggestions[activeSuggestionIndex]);
      return;
    }
    if (e.key === "ArrowUp") {
      if (activeSuggestionIndex === -1) return;
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
      return;
    }
    if (e.key === "ArrowDown") {
      if (activeSuggestionIndex === filteredSuggestions.length - 1) return;
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
      return;
    }
  };
  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions" role="listbox">
        {filteredSuggestions.map((suggestion, index) => {
          return (
            <li
              role="option"
              aria-selected={index === activeSuggestionIndex}
              tabIndex={0}
              className={classNames("p-2 cursor-pointer", {
                "bg-gray-200 text-blue-500": index === activeSuggestionIndex,
              })}
              key={suggestion}
              onClick={handleClick}
              onKeyDown={(e) => handleKeyboardClick(e, () => handleClick(e))}
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions"></div>
    );
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      {inputValue && <SuggestionsListComponent />}
    </div>
  );
};

export default AutoComplete;
