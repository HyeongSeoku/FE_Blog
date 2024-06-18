import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";

interface AutoCompleteProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AutoComplete = ({
  suggestions,
  onSelectSuggestion,
}: AutoCompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    setInputValue(userInput);
    setFilteredSuggestions(
      suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1,
      ),
    );
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        onSelectSuggestion(filteredSuggestions[activeSuggestionIndex]);
        setInputValue("");
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (e.key === "ArrowUp") {
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.key === "ArrowDown") {
      if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const handleClick = (e: MouseEvent<HTMLLIElement, MouseEvent>) => {
    onSelectSuggestion(e.currentTarget.innerText);
    setInputValue("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          let className;
          if (index === activeSuggestionIndex) {
            className = "suggestion-active";
          }
          return (
            <li className={className} key={suggestion} onClick={handleClick}>
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
      {showSuggestions && inputValue && <SuggestionsListComponent />}
    </div>
  );
};

export default AutoComplete;
